<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BannerResource;
use App\Http\Resources\CargoTypeResource;
use App\Http\Resources\QuickLinkResource;
use App\Models\Banner;
use App\Models\CargoType;
use App\Models\QuickLink;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PublicController extends Controller
{
    public function banners(): AnonymousResourceCollection
    {
        return BannerResource::collection(Banner::latest()->get());
    }

    public function quickLinks(): AnonymousResourceCollection
    {
        return QuickLinkResource::collection(QuickLink::orderBy('id')->get());
    }

    public function cargoTypes(): AnonymousResourceCollection
    {
        return CargoTypeResource::collection(CargoType::orderBy('name')->get());
    }
}
