export type TagDto = {
  id: string;
  name: string;
  slug: string;
  type: string;
};

export type UserDto = {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  bio?: string | null;
  isAmbassador?: boolean;
};

export type RestaurantDto = {
  id: string;
  name: string;
  description: string | null;
  city: string;
  district: string | null;
  country: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  cuisine: string | null;
  chefName: string | null;
  priceLabel: string | null;
  budget: string;
  award: string;
  sourceUrl: string | null;
  tags: TagDto[];
  likesCount: number;
  matchReason?: string;
  score?: number;
};

export type CollectionDto = {
  id: string;
  title: string;
  description: string | null;
  coverUrl: string | null;
  isPublic: boolean;
  owner: UserDto;
  items: Array<{
    id: string;
    note: string | null;
    restaurant: RestaurantDto;
  }>;
};

export type FollowingLikedDto = Array<{
  restaurant: RestaurantDto;
  likedBy: UserDto[];
}>;
