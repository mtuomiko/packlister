export interface Packlist {
  id: string;
  name: string;
  description: string;
  categories: Category[];
}

export interface Category {
  internalId: string;
  name: string;
  categoryItems: CategoryItem[];
}

export interface CategoryItem {
  internalId: string;
  userItemId: string;
  quantity: number;
}

export interface UserItem {
  internalId: string;
  name: string;
  description: string;
  weight: number;
  __typename: string;
}

export interface UserState {
  noLogin?: boolean;
  token?: string;
  id?: string;
  username?: string;
  email?: string;
}