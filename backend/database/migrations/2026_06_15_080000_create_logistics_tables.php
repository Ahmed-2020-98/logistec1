<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->index();
            $table->string('code');
            $table->string('purpose')->default('verify'); // verify | reset
            $table->timestamp('expires_at');
            $table->boolean('used')->default(false);
            $table->timestamps();
        });

        Schema::create('cargo_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });

        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->text('image')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('button_text')->nullable();
            $table->string('url')->nullable();
            $table->timestamps();
        });

        Schema::create('quick_links', function (Blueprint $table) {
            $table->id();
            $table->text('image')->nullable(); // emoji, image URL, or data URL
            $table->string('title');
            $table->string('url');
            $table->timestamps();
        });

        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // transport | customs | shipping
            $table->string('scope')->nullable();
            $table->string('from_city')->nullable();
            $table->string('to_city')->nullable();
            $table->string('cargo_type')->nullable();
            $table->string('customs_kind')->nullable();
            $table->string('shipping_kind')->nullable();
            $table->string('name');
            $table->string('mobile');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('transport_ads', function (Blueprint $table) {
            $table->id();
            $table->string('from_city');
            $table->string('to_city');
            $table->string('cargo_type');
            $table->string('weight')->nullable();
            $table->string('weight_with_trailer')->nullable();
            $table->string('phone');
            $table->text('description')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('customs_ads', function (Blueprint $table) {
            $table->id();
            $table->string('port_name');
            $table->date('arrival_date')->nullable();
            $table->string('containers_count')->nullable();
            $table->string('shipment_type')->nullable();
            $table->string('bl_number')->nullable();
            $table->string('phone');
            $table->text('notes')->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });

        Schema::create('sale_ads', function (Blueprint $table) {
            $table->id();
            $table->string('kind'); // truck | equipment | flatbed
            $table->string('title');
            $table->string('price');
            $table->string('location');
            $table->text('description')->nullable();
            $table->json('images')->nullable(); // array of stored paths or URLs
            $table->string('phone');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sale_ads');
        Schema::dropIfExists('customs_ads');
        Schema::dropIfExists('transport_ads');
        Schema::dropIfExists('service_requests');
        Schema::dropIfExists('quick_links');
        Schema::dropIfExists('banners');
        Schema::dropIfExists('cargo_types');
        Schema::dropIfExists('otps');
    }
};
