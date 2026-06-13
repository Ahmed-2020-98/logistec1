import type {
  Banner,
  CargoType,
  CustomsAd,
  QuickLink,
  SaleAd,
  ServiceRequest,
  TransportAd,
  User,
} from "./types";

const IMG = "https://images.unsplash.com";
const truck1 = `${IMG}/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=900&q=70`;
const truck2 = `${IMG}/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=900&q=70`;
const excavator = `${IMG}/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=900&q=70`;
const crane = `${IMG}/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=70`;
const port1 = `${IMG}/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1600&q=70`;
const port2 = `${IMG}/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1600&q=70`;

export const ADMIN_DEMO = {
  phone: "+966500000000",
  password: "admin123",
};
export const USER_DEMO = {
  phone: "+966512345678",
  password: "user1234",
};

export const seedUsers: User[] = [
  {
    id: "u-admin",
    fullName: "مدير المنصة",
    phone: ADMIN_DEMO.phone,
    password: ADMIN_DEMO.password,
    isVerified: true,
    role: "admin",
    createdAt: "2026-01-05T08:00:00.000Z",
  },
  {
    id: "u-demo",
    fullName: "أحمد الغامدي",
    phone: USER_DEMO.phone,
    password: USER_DEMO.password,
    isVerified: true,
    role: "user",
    createdAt: "2026-02-12T10:30:00.000Z",
  },
];

export const seedBanners: Banner[] = [
  {
    id: "b1",
    image: port1,
    title: "منصة الخليج للخدمات اللوجستية",
    description: "جميع خدمات النقل والتخليص والشحن في مكان واحد",
    buttonText: "اطلب خدمة",
    url: "/services",
  },
  {
    id: "b2",
    image: port2,
    title: "أضف إعلانك وابدأ النقل اليوم",
    description: "اعرض حمولتك أو شاحنتك أمام آلاف الناقلين والمخلصين في المملكة",
    buttonText: "أضف إعلان",
    url: "/add-ad",
  },
];

export const seedQuickLinks: QuickLink[] = [
  { id: "q1", image: "🛃", title: "منصة فسح", url: "https://www.fasah.sa" },
  { id: "q2", image: "🚪", title: "منصة دول", url: "https://www.fasah.sa" },
  { id: "q3", image: "🚛", title: "الهيئة العامة للنقل", url: "https://tga.gov.sa" },
  { id: "q4", image: "🍎", title: "هيئة الغذاء والدواء", url: "https://www.sfda.gov.sa" },
  { id: "q5", image: "🚢", title: "تتبع السفن", url: "https://www.marinetraffic.com" },
  { id: "q6", image: "📄", title: "وثائق النقل", url: "#" },
];

export const seedCargoTypes: CargoType[] = [
  { id: "c1", name: "حاويات جاف" },
  { id: "c2", name: "حاويات مبرد" },
  { id: "c3", name: "بضائع سائبة" },
  { id: "c4", name: "مواد بناء" },
  { id: "c5", name: "سيارات ومعدات" },
  { id: "c6", name: "أكياس جامبو" },
  { id: "c7", name: "أخشاب" },
  { id: "c8", name: "مواد غذائية" },
  { id: "c9", name: "مواد خطرة" },
];

export const seedTransportAds: TransportAd[] = [
  {
    id: "t1",
    category: "transport",
    fromCity: "جدة",
    toCity: "الرياض",
    cargoType: "حاويات جاف 40 قدم",
    weight: "28 طن",
    weightWithTrailer: "42 طن",
    phone: "+966551112233",
    description: "متوفر شاحنة لنقل حاوية جاف من ميناء جدة إلى الرياض، تحميل فوري.",
    userId: "u-demo",
    createdAt: "2026-06-11T09:00:00.000Z",
  },
  {
    id: "t2",
    category: "transport",
    fromCity: "الدمام",
    toCity: "جدة",
    cargoType: "بضائع سائبة",
    weight: "20 طن",
    weightWithTrailer: "34 طن",
    phone: "+966552223344",
    description: "نقل بضائع سائبة بسطحة مجهزة، خدمة يومية بين المنطقة الشرقية والغربية.",
    userId: "u-demo",
    createdAt: "2026-06-10T14:20:00.000Z",
  },
  {
    id: "t3",
    category: "transport",
    fromCity: "الرياض",
    toCity: "الدمام",
    cargoType: "حاويات مبرد",
    weight: "24 طن",
    weightWithTrailer: "38 طن",
    phone: "+966553334455",
    description: "شاحنة مبردة لنقل المواد الغذائية، تحكم بدرجة الحرارة طوال الرحلة.",
    userId: null,
    createdAt: "2026-06-09T07:45:00.000Z",
  },
  {
    id: "t4",
    category: "transport",
    fromCity: "ينبع",
    toCity: "مكة المكرمة",
    cargoType: "مواد بناء",
    weight: "30 طن",
    weightWithTrailer: "45 طن",
    phone: "+966554445566",
    description: "نقل مواد بناء وحديد، أسعار منافسة وتأمين على الحمولة.",
    userId: null,
    createdAt: "2026-06-08T11:10:00.000Z",
  },
];

export const seedCustomsAds: CustomsAd[] = [
  {
    id: "cu1",
    category: "customs",
    portName: "ميناء الملك عبدالعزيز - الدمام",
    arrivalDate: "2026-06-19",
    containersCount: "6",
    shipmentType: "حاويات جاف 40 قدم",
    blNumber: "MAEU123456789",
    phone: "+966555556677",
    notes: "مطلوب مخلص جمركي لإنهاء إجراءات 6 حاويات وارد.",
    userId: "u-demo",
    createdAt: "2026-06-12T08:30:00.000Z",
  },
  {
    id: "cu2",
    category: "customs",
    portName: "ميناء جدة الإسلامي",
    arrivalDate: "2026-06-22",
    containersCount: "12",
    shipmentType: "حاويات مبرد",
    blNumber: "CMAU987654321",
    phone: "+966556667788",
    notes: "تخليص حاويات مبردة (مواد غذائية) مع شهادة هيئة الغذاء والدواء.",
    userId: null,
    createdAt: "2026-06-11T16:00:00.000Z",
  },
  {
    id: "cu3",
    category: "customs",
    portName: "ميناء الملك عبدالله - رابغ",
    arrivalDate: "2026-06-25",
    containersCount: "3",
    shipmentType: "سيارات ومعدات",
    blNumber: "HLCU456123789",
    phone: "+966557778899",
    notes: "تخليص سيارات ومعدات ثقيلة، خبرة في الفسوحات.",
    userId: null,
    createdAt: "2026-06-10T12:15:00.000Z",
  },
];

export const seedSaleAds: SaleAd[] = [
  {
    id: "s1",
    category: "sale",
    kind: "truck",
    title: "شاحنة مرسيدس أكتروس 2021 بحالة ممتازة",
    price: "320000",
    location: "الرياض",
    description:
      "مرسيدس أكتروس موديل 2021، ماشية 180 ألف كم، صيانة منتظمة بالوكالة، جاهزة للعمل.",
    images: [truck1, truck2],
    phone: "+966551110001",
    userId: "u-demo",
    createdAt: "2026-06-12T10:00:00.000Z",
  },
  {
    id: "s2",
    category: "sale",
    kind: "equipment",
    title: "حفّار كاتربيلر 320 موديل 2019",
    price: "410000",
    location: "الدمام",
    description: "حفّار كاتربيلر 320، ساعات تشغيل قليلة، حالة الزحافات ممتازة.",
    images: [excavator],
    phone: "+966551110002",
    userId: null,
    createdAt: "2026-06-11T13:30:00.000Z",
  },
  {
    id: "s3",
    category: "sale",
    kind: "flatbed",
    title: "سطحة لوبد 3 محاور لنقل المعدات الثقيلة",
    price: "150000",
    location: "جدة",
    description: "سطحة لوبد ثلاثية المحاور، مجهزة لنقل المعدات الثقيلة، أوراق سليمة.",
    images: [crane],
    phone: "+966551110003",
    userId: null,
    createdAt: "2026-06-10T09:20:00.000Z",
  },
  {
    id: "s4",
    category: "sale",
    kind: "truck",
    title: "شاحنة فولفو FH 2018 - رأس قاطرة",
    price: "245000",
    location: "الخبر",
    description: "فولفو FH موديل 2018، رأس قاطرة، اقتصادية في الوقود وحالة ميكانيكية ممتازة.",
    images: [truck2],
    phone: "+966551110004",
    userId: null,
    createdAt: "2026-06-09T15:40:00.000Z",
  },
];

export const seedServiceRequests: ServiceRequest[] = [
  {
    id: "r1",
    type: "transport",
    scope: "domestic",
    fromCity: "جدة",
    toCity: "الرياض",
    cargoType: "حاويات جاف",
    name: "خالد العتيبي",
    mobile: "+966500000011",
    notes: "أحتاج نقل حاوية واحدة خلال يومين.",
    userId: "u-demo",
    createdAt: "2026-06-12T11:00:00.000Z",
  },
  {
    id: "r2",
    type: "customs",
    customsKind: "import",
    name: "شركة النور للاستيراد",
    mobile: "+966500000022",
    notes: "تخليص شحنة وارد من الصين.",
    userId: null,
    createdAt: "2026-06-11T09:30:00.000Z",
  },
];
