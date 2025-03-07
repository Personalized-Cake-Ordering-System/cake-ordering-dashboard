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
  description: string;
  address: string;
  contactNumber: string;
  email: string;
  logo: string;
  bannerImage: string;
  rating: number;
  totalReviews: number;
  followerCount: string;
  productCount: number;
  currentlyViewing?: number;
  isVerified: boolean;
  isActive: boolean;
  ownerId: string;
  ownerName: string;
  specialties: string[];
  establishedDate?: string;
  responseRate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BakeryFilterParams {
  isVerified?: boolean;
  isActive?: boolean;
  minRating?: number;
  specialties?: string[];
}

export interface CreateBakeryInput {
  name: string;
  description: string;
  address: string;
  contactNumber: string;
  email: string;
  logo?: string;
  bannerImage?: string;
  ownerId: string;
  ownerName: string;
  specialties: string[];
  isActive?: boolean;
}
