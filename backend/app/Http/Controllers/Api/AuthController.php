<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\AuthenticaService;
use App\Support\Phone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function __construct(private AuthenticaService $authentica)
    {
    }

    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        if (! Phone::isValid($data['phone'])) {
            return response()->json(['message' => 'رقم الجوال غير صحيح (مثال: 05XXXXXXXX)'], 422);
        }

        $phone = Phone::normalize($data['phone']);
        if (User::where('phone', $phone)->exists()) {
            return response()->json(['message' => 'رقم الجوال مسجّل مسبقاً'], 422);
        }

        User::create([
            'full_name' => trim($data['fullName']),
            'phone' => $phone,
            'password' => $data['password'],
            'is_verified' => false,
            'role' => 'user',
        ]);

        $this->authentica->sendOtp($phone, 'verify');

        return response()->json(['message' => 'تم إنشاء الحساب، تم إرسال رمز التحقق'], 201);
    }

    public function requestOtp(Request $request): JsonResponse
    {
        $request->validate(['phone' => ['required', 'string']]);
        $phone = Phone::normalize($request->input('phone'));

        if (! User::where('phone', $phone)->exists()) {
            return response()->json(['message' => 'لا يوجد حساب بهذا الرقم'], 422);
        }

        $this->authentica->sendOtp($phone, 'verify');

        return response()->json(['message' => 'تم إرسال رمز التحقق']);
    }

    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
        ]);
        $phone = Phone::normalize($request->input('phone'));
        $user = User::where('phone', $phone)->first();

        if (! $user) {
            return response()->json(['message' => 'تعذّر العثور على الحساب'], 422);
        }
        if (! $this->authentica->verify($phone, $request->input('code'), 'verify')) {
            return response()->json(['message' => 'رمز التحقق غير صحيح'], 422);
        }

        $user->update(['is_verified' => true]);

        return $this->tokenResponse($user);
    }

    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);
        $phone = Phone::normalize($request->input('phone'));
        $user = User::where('phone', $phone)->first();

        if (! $user || ! Hash::check($request->input('password'), $user->password)) {
            return response()->json(['message' => 'رقم الجوال أو كلمة المرور غير صحيحة'], 422);
        }
        if (! $user->is_verified) {
            $this->authentica->sendOtp($phone, 'verify');

            return response()->json(['message' => 'الحساب غير مُفعّل، تم إرسال رمز التحقق'], 403);
        }

        return $this->tokenResponse($user);
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['phone' => ['required', 'string']]);
        $phone = Phone::normalize($request->input('phone'));

        if (! User::where('phone', $phone)->exists()) {
            return response()->json(['message' => 'لا يوجد حساب بهذا الرقم'], 422);
        }

        $this->authentica->sendOtp($phone, 'reset');

        return response()->json(['message' => 'تم إرسال رمز التحقق']);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'phone' => ['required', 'string'],
            'code' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);
        $phone = Phone::normalize($request->input('phone'));
        $user = User::where('phone', $phone)->first();

        if (! $user) {
            return response()->json(['message' => 'تعذّر العثور على الحساب'], 422);
        }
        if (! $this->authentica->verify($phone, $request->input('code'), 'reset')) {
            return response()->json(['message' => 'رمز التحقق غير صحيح'], 422);
        }

        $user->update(['password' => $request->input('password'), 'is_verified' => true]);

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => new UserResource($request->user())]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'تم تسجيل الخروج']);
    }

    public function updateProfile(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fullName' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string'],
        ]);

        if (! Phone::isValid($data['phone'])) {
            return response()->json(['message' => 'رقم الجوال غير صحيح'], 422);
        }

        $user = $request->user();
        $phone = Phone::normalize($data['phone']);
        if (User::where('phone', $phone)->where('id', '!=', $user->id)->exists()) {
            return response()->json(['message' => 'رقم الجوال مستخدم في حساب آخر'], 422);
        }

        $user->update(['full_name' => trim($data['fullName']), 'phone' => $phone]);

        return response()->json(['user' => new UserResource($user->fresh())]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6'],
        ]);

        $user = $request->user();
        if (! Hash::check($data['current'], $user->password)) {
            return response()->json(['message' => 'كلمة المرور الحالية غير صحيحة'], 422);
        }

        $user->update(['password' => $data['password']]);

        return response()->json(['message' => 'تم تغيير كلمة المرور بنجاح']);
    }

    private function tokenResponse(User $user): JsonResponse
    {
        $token = $user->createToken('web')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }
}
