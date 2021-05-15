export interface Packlist {
  id: string;
  name: string;
  description?: string;
  categories: Category[];
}

export interface Category {
  internalId: string;
  name: string;
  categoryItems: CategoryItem[];
}

export interface CategoryItem {
  userItemId: string;
  quantity: number;
}

export interface UserItem {
  internalId: string;
  name: string;
  description: string;
  weight: number;
}

export interface UserState {
  token: string;
  id: string;
  username: string;
  email: string;
}