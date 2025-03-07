import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Star, Users, Search, Filter, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import BreadCrumb from '@/components/shared/dashboard/bread-crumb';
import { LoadingSpinner } from '@/components/shared/custom-ui/loading-spinner';

import { getAllBakeries } from '@/features/barkeries/actions/barkeries-action';
import { BakeryType } from '@/features/barkeries/types/barkeries-type';
import { log } from 'console';

export default async function BakeriesPage({
  searchParams,
}: {
  searchParams: { search?: string; page?: string; sort?: string; filter?: string };
}) {
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Bakeries', link: '/dashboard/bakeries' },
  ].map((item, index, array) => ({
    label: item.title,
    href: item.link,
    isLast: index === array.length - 1
  }));

  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const sort = searchParams.sort || 'rating-desc';
  const filter = searchParams.filter || '';

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <BreadCrumb items={breadcrumbItems} />
        <Button className="bg-red-600 hover:bg-red-700">
          Add New Bakery
        </Button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-bold">Bakeries</h1>
        <p className="text-gray-500">Browse and manage all partner bakeries</p>
      </div>

      <div className="bg-white rounded-lg border shadow-sm mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, address, or specialty..."
                className="pl-10 w-full"
                defaultValue={search}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" /> Sort by
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem>Most Popular</DropdownMenuItem>
                  <DropdownMenuItem>Recently Added</DropdownMenuItem>
                  <DropdownMenuItem>Alphabetical A-Z</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all" className="mt-4">
            <TabsList className="w-full flex justify-start mb-0 bg-transparent">
              <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-gray-100">All Bakeries</TabsTrigger>
              <TabsTrigger value="verified" className="rounded-md data-[state=active]:bg-gray-100">Verified</TabsTrigger>
              <TabsTrigger value="popular" className="rounded-md data-[state=active]:bg-gray-100">Popular</TabsTrigger>
              <TabsTrigger value="new" className="rounded-md data-[state=active]:bg-gray-100">New</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Suspense fallback={<BakeriesLoadingSkeleton />}>
          <BakeriesList page={page} search={search} sort={sort} filter={filter} />
        </Suspense>
      </div>
    </div>
  );
}

async function BakeriesList({
  page,
  search,
  sort,
  filter,
}: {
  page: number;
  search: string;
  sort: string;
  filter: string;
}) {
  // Parse sort parameter
  const [sortBy, sortOrder] = sort.split('-');

  // Fetch bakeries
  const bakeries = await getAllBakeries({
    page,
    limit: 9,
    search,
    sortBy,
    sortOrder: sortOrder as 'asc' | 'desc',
  });

  // Mock data for display until API is connected
  const mockBakeries: BakeryType[] = Array.from({ length: 9 }, (_, i) => ({
    id: `bakery-${i + 1}`,
    name: `${['Sweet Delights', 'Cake Haven', 'Frosted Dreams', 'Sugar & Spice', 'The Cake Studio',
      'Bake My Day', 'Heavenly Cakes', 'Pastry Paradise', 'Cake Couture'][i % 9]} Bakery`,
    description: 'Specializing in custom cakes and pastries for all occasions',
    address: `${123 + i} Baker Street, Sweet City`,
    contactNumber: '+1 (555) 123-4567',
    email: `bakery${i + 1}@example.com`,
    logo: '/images/auth/auth-illustration.png',
    bannerImage: '/images/auth/auth-illustration.png',
    rating: 4.5 + (Math.random() * 0.5),
    totalReviews: Math.floor(100 + Math.random() * 900),
    followerCount: `${Math.floor(1 + Math.random() * 10)}k`,
    productCount: Math.floor(20 + Math.random() * 100),
    isVerified: i % 3 === 0,
    isActive: true,
    ownerId: `owner-${i + 1}`,
    ownerName: `Owner ${i + 1}`,
    specialties: ['Birthday Cakes', 'Wedding Cakes', 'Cupcakes'].slice(0, 1 + (i % 3)),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  if (!mockBakeries.length) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No bakeries found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {mockBakeries.map((bakery) => (
          <Link href={`/dashboard/bakeries/${bakery.id}`} key={bakery.id}>
            <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={bakery.bannerImage || '/public/images/auth/auth-illustration.png'}
                  alt={bakery.name}
                  fill
                  className="object-cover"
                />
                {bakery.isVerified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-500 hover:bg-blue-600">
                      <CheckCircle className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="h-14 w-14 rounded-full overflow-hidden relative bg-gray-100 border flex-shrink-0">
                    <Image
                      src={bakery.logo || '/public/images/auth/auth-illustration.png'}
                      alt={`${bakery.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{bakery.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400 mr-1" />
                      <span>{bakery.rating.toFixed(1)}</span>
                      <span className="mx-1">•</span>
                      <span>{bakery.totalReviews} reviews</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{bakery.description}</p>
                <div className="flex flex-wrap gap-1">
                  {bakery.specialties?.map((specialty, index) => (
                    <Badge variant="outline" key={index} className="bg-gray-50">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {bakery.followerCount} followers
                  </div>
                  <div>{bakery.productCount} products</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing <span className="font-medium">1-{Math.min(9, mockBakeries.length)}</span> of <span className="font-medium">42</span> bakeries
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <Button variant="outline" size="sm">
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function BakeriesLoadingSkeleton() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden border">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-3" />
              <div className="flex gap-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <div className="mt-4 pt-3 border-t flex justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  );
}