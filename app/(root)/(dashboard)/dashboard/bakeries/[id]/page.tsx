import { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Users, Clock, PercentCircle } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BreadCrumb from '@/components/shared/dashboard/bread-crumb';
import { LoadingSpinner } from '@/components/shared/custom-ui/loading-spinner';

import { getBakeryById } from '@/features/barkeries/actions/barkeries-action';

export default async function BakeryPage({ params }: { params: { id: string } }) {
    // Fetch bakery data
    const bakeryData = await getBakeryById(params.id);

    const breadcrumbItems = [
        { label: 'Dashboard', href: '/dashboard', isLast: false },
        { label: 'Bakeries', href: '/dashboard/bakeries', isLast: false },
        { label: bakeryData?.name || 'Bakery Details', href: `/dashboard/bakeries/${params.id}`, isLast: true },
    ];

    return (
        <div className="container mx-auto px-4 py-6">
            <BreadCrumb items={breadcrumbItems} />

            <Suspense fallback={<LoadingSpinner />}>
                <BakeryDetails bakery={bakeryData} />
            </Suspense>
        </div>
    );
}

function BakeryDetails({ bakery }: { bakery: any }) {
    // Mock data based on the Shopee Mall image
    const mockBakery = {
        id: bakery?.id || '123',
        name: bakery?.name || 'Sweet Delights Bakery',
        logo: bakery?.logo || '/images/auth/auth-illustration.png',
        online: '1 hour ago',
        products: bakery?.productCount || 492,
        followers: bakery?.followerCount || '493.1k',
        currentlyViewing: bakery?.currentlyViewing || 5,
        rating: bakery?.rating || 4.9,
        totalReviews: bakery?.totalReviews || '681k',
        establishedDate: bakery?.establishedDate || '6 Years Ago',
        responseRate: bakery?.responseRate || '100%',
        bannerImage: bakery?.bannerImage || '/images/bakery-banner-placeholder.png',
        promotions: [
            { id: 1, discount: '20%', minSpend: '₫0', maxDiscount: '₫50k', expires: '31.03.2025', used: '66%' },
            { id: 2, discount: '15%', minSpend: '₫0', maxDiscount: '₫100k', expires: '31.03.2025', used: '59%' },
            { id: 3, discount: '8%', minSpend: '₫199k', maxDiscount: '₫30k', expires: 'In 2 hours', used: '89%' },
            { id: 4, discount: '10%', minSpend: '₫240k', maxDiscount: '₫50k', expires: 'In 2 hours', used: '75%' }
        ],
        recommendedProducts: [
            { id: 1, name: 'Chocolate Cake', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 },
            { id: 2, name: 'Strawberry Cake', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 },
            { id: 3, name: 'Cheesecake', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 },
            { id: 4, name: 'Red Velvet Cake', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 },
            { id: 5, name: 'Vanilla Cake', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 },
            { id: 6, name: 'Tiramisu', image: '/images/auth/auth-illustration.png', price: 300, discountedPrice: 255 }
        ]
    };

    return (
        <div className="space-y-6">
            {/* Header section with bakery info */}
            <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-rose-700 to-red-800 text-white">
                <div className="flex items-start p-6">
                    <div className="flex items-center gap-4">
                        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-white p-1">
                            <Image
                                src={'/images/auth/auth-illustration.png'}
                                alt={mockBakery.name}
                                width={100}
                                height={100}
                                className="rounded-full object-cover"
                            />
                            <Badge className="absolute bottom-0 right-0 bg-white text-red-600 text-xs">
                                Official
                            </Badge>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{mockBakery.name}</h1>
                            <p className="text-sm flex items-center gap-1">
                                <Clock className="h-4 w-4" /> Online {mockBakery.online}
                            </p>
                            <div className="flex gap-4">
                                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white/20">
                                    <Users className="h-4 w-4 mr-1" /> Follow
                                </Button>
                                <Button variant="outline" size="sm" className="bg-transparent border-white text-white hover:bg-white/20">
                                    Chat
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto grid grid-cols-2 gap-x-12 gap-y-4">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5" />
                            <div>
                                <div className="text-sm opacity-80">Products:</div>
                                <div className="font-semibold">{mockBakery.products}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            <div>
                                <div className="text-sm opacity-80">Followers:</div>
                                <div className="font-semibold">{mockBakery.followers}</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            <div>
                                <div className="text-sm opacity-80">Rating:</div>
                                <div className="font-semibold">{mockBakery.rating} ({mockBakery.totalReviews})</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            <div>
                                <div className="text-sm opacity-80">Established:</div>
                                <div className="font-semibold">{mockBakery.establishedDate}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid grid-cols-6 mb-6">
                    <TabsTrigger value="all" className="text-sm font-medium">All Products</TabsTrigger>
                    <TabsTrigger value="birthday" className="text-sm font-medium">Birthday Cakes</TabsTrigger>
                    <TabsTrigger value="wedding" className="text-sm font-medium">Wedding Cakes</TabsTrigger>
                    <TabsTrigger value="cupcakes" className="text-sm font-medium">Cupcakes</TabsTrigger>
                    <TabsTrigger value="cookies" className="text-sm font-medium">Cookies</TabsTrigger>
                    <TabsTrigger value="more" className="text-sm font-medium">More ▼</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                    {/* Promotions */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Available Promotions</h2>
                            <Link href="/dashboard/bakeries/promotions" className="text-red-600 text-sm font-medium">View All &gt;</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {mockBakery.promotions.map((promo) => (
                                <div key={promo.id} className="bg-white p-4 rounded-lg border border-gray-100 relative">
                                    <div className="absolute top-3 right-3 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                                        x3
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-red-600 font-bold text-lg">Save {promo.discount}</div>
                                        <div className="text-sm">Min Spend {promo.minSpend} Max Discount {promo.maxDiscount}</div>
                                        <div className="mt-1 text-xs py-1 px-2 bg-gray-100 inline-block rounded-md">
                                            Limited Time Offer
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {promo.used} used • Expires {promo.expires}
                                        </div>
                                        <Button variant="destructive" size="sm" className="mt-2">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recommended Products */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Recommended For You</h2>
                            <Link href="/dashboard/bakeries/recommended" className="text-red-600 text-sm font-medium">View All &gt;</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {mockBakery.recommendedProducts.map((product) => (
                                <Card key={product.id} className="overflow-hidden">
                                    <div className="aspect-square relative">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
                                        <div className="mt-2 flex items-center">
                                            <span className="text-red-600 font-bold">${product.discountedPrice}</span>
                                            <span className="ml-2 text-sm text-gray-500 line-through">${product.price}</span>
                                        </div>
                                        <div className="mt-2 flex items-center text-xs text-gray-500">
                                            <Star className="h-3 w-3 fill-amber-400 stroke-amber-400 mr-1" />
                                            <span>{mockBakery.rating}</span>
                                            <span className="mx-1">•</span>
                                            <span>Sold 1.2k</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}