<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\CargoType;
use App\Models\CustomsAd;
use App\Models\QuickLink;
use App\Models\SaleAd;
use App\Models\ServiceRequest;
use App\Models\TransportAd;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $img = 'https://images.unsplash.com';
        $truck1 = "$img/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70";
        $truck2 = "$img/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=900&q=70";
        $excavator = "$img/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=70";
        $crane = "$img/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=70";
        $port1 = "$img/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=70";
        $port2 = "$img/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1600&q=70";

        $admin = User::create([
            'full_name' => 'مدير المنصة',
            'phone' => '+966500000000',
            'password' => Hash::make('admin123'),
            'is_verified' => true,
            'role' => 'admin',
        ]);

        $user = User::create([
            'full_name' => 'أحمد الغامدي',
            'phone' => '+966512345678',
            'password' => Hash::make('user1234'),
            'is_verified' => true,
            'role' => 'user',
        ]);

        Banner::insert([
            ['image' => $port1, 'title' => 'منصة الخليج للخدمات اللوجستية', 'description' => 'جميع خدمات النقل والتخليص والشحن في مكان واحد', 'button_text' => 'اطلب خدمة', 'url' => '/services', 'created_at' => now(), 'updated_at' => now()],
            ['image' => $port2, 'title' => 'أضف إعلانك وابدأ النقل اليوم', 'description' => 'اعرض حمولتك أو شاحنتك أمام آلاف الناقلين والمخلصين في المملكة', 'button_text' => 'أضف إعلان', 'url' => '/add-ad', 'created_at' => now(), 'updated_at' => now()],
        ]);

        QuickLink::insert([
            ['image' => '🛃', 'title' => 'منصة فسح', 'url' => 'https://www.fasah.sa', 'created_at' => now(), 'updated_at' => now()],
            ['image' => '🚪', 'title' => 'منصة دول', 'url' => 'https://www.fasah.sa', 'created_at' => now(), 'updated_at' => now()],
            ['image' => '🚛', 'title' => 'الهيئة العامة للنقل', 'url' => 'https://tga.gov.sa', 'created_at' => now(), 'updated_at' => now()],
            ['image' => '🍎', 'title' => 'هيئة الغذاء والدواء', 'url' => 'https://www.sfda.gov.sa', 'created_at' => now(), 'updated_at' => now()],
            ['image' => '🚢', 'title' => 'تتبع السفن', 'url' => 'https://www.marinetraffic.com', 'created_at' => now(), 'updated_at' => now()],
            ['image' => '📄', 'title' => 'وثائق النقل', 'url' => '#', 'created_at' => now(), 'updated_at' => now()],
        ]);

        foreach (['حاويات جاف', 'حاويات مبرد', 'بضائع سائبة', 'مواد بناء', 'سيارات ومعدات', 'أكياس جامبو', 'أخشاب', 'مواد غذائية', 'مواد خطرة'] as $name) {
            CargoType::create(['name' => $name]);
        }

        TransportAd::insert([
            ['from_city' => 'جدة', 'to_city' => 'الرياض', 'cargo_type' => 'حاويات جاف 40 قدم', 'weight' => '28 طن', 'weight_with_trailer' => '42 طن', 'phone' => '+966551112233', 'description' => 'متوفر شاحنة لنقل حاوية جاف من ميناء جدة إلى الرياض، تحميل فوري.', 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
            ['from_city' => 'الدمام', 'to_city' => 'جدة', 'cargo_type' => 'بضائع سائبة', 'weight' => '20 طن', 'weight_with_trailer' => '34 طن', 'phone' => '+966552223344', 'description' => 'نقل بضائع سائبة بسطحة مجهزة، خدمة يومية بين المنطقة الشرقية والغربية.', 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
            ['from_city' => 'الرياض', 'to_city' => 'الدمام', 'cargo_type' => 'حاويات مبرد', 'weight' => '24 طن', 'weight_with_trailer' => '38 طن', 'phone' => '+966553334455', 'description' => 'شاحنة مبردة لنقل المواد الغذائية، تحكم بدرجة الحرارة طوال الرحلة.', 'user_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['from_city' => 'ينبع', 'to_city' => 'مكة المكرمة', 'cargo_type' => 'مواد بناء', 'weight' => '30 طن', 'weight_with_trailer' => '45 طن', 'phone' => '+966554445566', 'description' => 'نقل مواد بناء وحديد، أسعار منافسة وتأمين على الحمولة.', 'user_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        CustomsAd::insert([
            ['port_name' => 'ميناء الملك عبدالعزيز - الدمام', 'arrival_date' => '2026-06-19', 'containers_count' => '6', 'shipment_type' => 'حاويات جاف 40 قدم', 'bl_number' => 'MAEU123456789', 'phone' => '+966555556677', 'notes' => 'مطلوب مخلص جمركي لإنهاء إجراءات 6 حاويات وارد.', 'user_id' => $user->id, 'created_at' => now(), 'updated_at' => now()],
            ['port_name' => 'ميناء جدة الإسلامي', 'arrival_date' => '2026-06-22', 'containers_count' => '12', 'shipment_type' => 'حاويات مبرد', 'bl_number' => 'CMAU987654321', 'phone' => '+966556667788', 'notes' => 'تخليص حاويات مبردة (مواد غذائية) مع شهادة هيئة الغذاء والدواء.', 'user_id' => null, 'created_at' => now(), 'updated_at' => now()],
            ['port_name' => 'ميناء الملك عبدالله - رابغ', 'arrival_date' => '2026-06-25', 'containers_count' => '3', 'shipment_type' => 'سيارات ومعدات', 'bl_number' => 'HLCU456123789', 'phone' => '+966557778899', 'notes' => 'تخليص سيارات ومعدات ثقيلة، خبرة في الفسوحات.', 'user_id' => null, 'created_at' => now(), 'updated_at' => now()],
        ]);

        SaleAd::create(['kind' => 'truck', 'title' => 'شاحنة مرسيدس أكتروس 2021 بحالة ممتازة', 'price' => '320000', 'location' => 'الرياض', 'description' => 'مرسيدس أكتروس موديل 2021، ماشية 180 ألف كم، صيانة منتظمة بالوكالة، جاهزة للعمل.', 'images' => [$truck1, $truck2], 'phone' => '+966551110001', 'user_id' => $user->id]);
        SaleAd::create(['kind' => 'equipment', 'title' => 'حفّار كاتربيلر 320 موديل 2019', 'price' => '410000', 'location' => 'الدمام', 'description' => 'حفّار كاتربيلر 320، ساعات تشغيل قليلة، حالة الزحافات ممتازة.', 'images' => [$excavator], 'phone' => '+966551110002', 'user_id' => null]);
        SaleAd::create(['kind' => 'flatbed', 'title' => 'سطحة لوبد 3 محاور لنقل المعدات الثقيلة', 'price' => '150000', 'location' => 'جدة', 'description' => 'سطحة لوبد ثلاثية المحاور، مجهزة لنقل المعدات الثقيلة، أوراق سليمة.', 'images' => [$crane], 'phone' => '+966551110003', 'user_id' => null]);
        SaleAd::create(['kind' => 'truck', 'title' => 'شاحنة فولفو FH 2018 - رأس قاطرة', 'price' => '245000', 'location' => 'الخبر', 'description' => 'فولفو FH موديل 2018، رأس قاطرة، اقتصادية في الوقود وحالة ميكانيكية ممتازة.', 'images' => [$truck2], 'phone' => '+966551110004', 'user_id' => null]);

        ServiceRequest::create(['type' => 'transport', 'scope' => 'domestic', 'from_city' => 'جدة', 'to_city' => 'الرياض', 'cargo_type' => 'حاويات جاف', 'name' => 'خالد العتيبي', 'mobile' => '+966500000011', 'notes' => 'أحتاج نقل حاوية واحدة خلال يومين.', 'user_id' => $user->id]);
        ServiceRequest::create(['type' => 'customs', 'customs_kind' => 'import', 'name' => 'شركة النور للاستيراد', 'mobile' => '+966500000022', 'notes' => 'تخليص شحنة وارد من الصين.', 'user_id' => null]);
    }
}
