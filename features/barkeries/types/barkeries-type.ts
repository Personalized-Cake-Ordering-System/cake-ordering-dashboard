export type IBarkery = {
  id: string;
  bakeryName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  ownerName: string;
  avatarFileId: string;
  avatarFile: IAvatar;
  identityCardNumber: string;
  frontCardFileId: string;
};

export type IAvatar = {
  fileName: string;
  fileUrl: string;
  id: string;
};

export interface BakeryType {
  id: string;
  name: string;
  logo?: string;
  bannerImage?: string;
  description?: string;
  address: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  rating: number;
  totalReviews: number | string;
  followerCount: number | string;
  productCount: number;
  currentlyViewing?: number;
  establishedDate?: string;
  responseRate?: string;
  isVerified: boolean;
  isActive: boolean;
  ownerId: string;
  ownerName?: string;
  specialties?: string[];
  promotions?: BakeryPromotion[];
  createdAt: string;
  updatedAt: string;
}

export interface BakeryPromotion {
  id: number | string;
  title?: string;
  discount: string;
  minSpend: string;
  maxDiscount: string;
  expires: string;
  used?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateBakeryDto {
  name: string;
  logo?: string | File;
  bannerImage?: string | File;
  description?: string;
  address: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  ownerId?: string;
  specialties?: string[];
}

export interface UpdateBakeryDto {
  name?: string;
  logo?: string | File;
  bannerImage?: string | File;
  description?: string;
  address?: string;
  contactNumber?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  isActive?: boolean;
  specialties?: string[];
}

export interface BakeryFilters {
  search?: string;
  rating?: number;
  isVerified?: boolean;
  isActive?: boolean;
  sortBy?: "name" | "rating" | "followers" | "products" | "createdAt";
  sortOrder?: "asc" | "desc";
}

export interface BakeryStats {
  totalProducts: number;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  totalFollowers: number;
  topProducts: {
    id: string;
    name: string;
    sales: number;
  }[];
  salesByMonth: {
    month: string;
    sales: number;
    revenue: number;
  }[];
}

export interface BakeryProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  image?: string;
  category: string;
  rating: number;
  sold: number;
  inStock: boolean;
  bakeryId: string;
}

export interface BakeryReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  productId?: string;
  productName?: string;
}
