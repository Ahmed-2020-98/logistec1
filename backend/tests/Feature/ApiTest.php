<?php

namespace Tests\Feature;

use App\Models\Banner;
use App\Models\Otp;
use App\Models\TransportAd;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_banners_are_listed(): void
    {
        Banner::create(['title' => 'بانر', 'image' => 'x.jpg']);

        $this->getJson('/api/banners')
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'بانر');
    }

    public function test_register_verify_and_me_flow(): void
    {
        $this->postJson('/api/auth/register', [
            'fullName' => 'مستخدم جديد',
            'phone' => '0599990000',
            'password' => 'secret123',
        ])->assertCreated();

        $code = Otp::where('phone', '+966599990000')->latest()->first()->code;

        $verify = $this->postJson('/api/auth/verify-otp', [
            'phone' => '0599990000',
            'code' => $code,
        ])->assertOk()->assertJsonStructure(['token', 'user' => ['id', 'fullName', 'phone']]);

        $token = $verify->json('token');

        $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/auth/me')
            ->assertOk()
            ->assertJsonPath('user.fullName', 'مستخدم جديد');
    }

    public function test_login_blocks_unverified_user(): void
    {
        User::factory()->unverified()->create([
            'phone' => '+966512300000',
            'password' => 'secret123',
        ]);

        $this->postJson('/api/auth/login', ['phone' => '0512300000', 'password' => 'secret123'])
            ->assertStatus(403);
    }

    public function test_admin_stats_require_admin_role(): void
    {
        Sanctum::actingAs(User::factory()->create());
        $this->getJson('/api/admin/stats')->assertStatus(403);

        Sanctum::actingAs(User::factory()->admin()->create());
        $this->getJson('/api/admin/stats')->assertOk()->assertJsonStructure(['users', 'transportAds']);
    }

    public function test_ad_details_require_authentication(): void
    {
        $ad = TransportAd::create([
            'from_city' => 'جدة', 'to_city' => 'الرياض', 'cargo_type' => 'حاويات',
            'phone' => '+966551112233',
        ]);

        $this->getJson("/api/ads/transport/{$ad->id}")->assertStatus(401);

        Sanctum::actingAs(User::factory()->create());
        $this->getJson("/api/ads/transport/{$ad->id}")->assertOk()->assertJsonPath('data.fromCity', 'جدة');
    }

    public function test_only_owner_or_admin_can_delete_ad(): void
    {
        $owner = User::factory()->create();
        Sanctum::actingAs($owner);
        $id = $this->postJson('/api/ads/transport', [
            'fromCity' => 'الرياض', 'toCity' => 'جدة', 'cargoType' => 'مواد', 'phone' => '0551112233',
        ])->assertCreated()->json('data.id');

        // another user cannot delete
        Sanctum::actingAs(User::factory()->create());
        $this->deleteJson("/api/ads/transport/{$id}")->assertStatus(403);

        // owner can delete
        Sanctum::actingAs($owner);
        $this->deleteJson("/api/ads/transport/{$id}")->assertOk();
        $this->assertDatabaseMissing('transport_ads', ['id' => $id]);
    }

    public function test_guest_cannot_create_service_request(): void
    {
        $this->postJson('/api/service-requests', [
            'type' => 'transport', 'name' => 'x', 'mobile' => '0500000000',
        ])->assertStatus(401);
    }
}
