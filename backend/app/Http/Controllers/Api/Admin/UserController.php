<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class UserController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return UserResource::collection(User::latest()->get());
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $data = $request->validate([
            'role' => ['sometimes', 'in:user,admin'],
            'isVerified' => ['sometimes', 'boolean'],
        ]);

        if (array_key_exists('role', $data)) {
            $user->role = $data['role'];
        }
        if (array_key_exists('isVerified', $data)) {
            $user->is_verified = $data['isVerified'];
        }
        $user->save();

        return response()->json(['user' => new UserResource($user)]);
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json(['message' => 'لا يمكنك حذف حسابك الحالي'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'تم حذف المستخدم']);
    }
}
