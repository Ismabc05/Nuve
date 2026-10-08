export type Address = {
  id: number;
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
};

export type User = {
  id: number;
  email: string;
  role: string;
  profile: {
    id: number;
    name: string;
    lastname: string;
    phone: string;
    zip_code: string;
    image: string;
    addresses: Address[] | null;
    favorites: number[];
  };
  orders: {
    id: number;
    status: string;
    total: string;
  }[];
};

export type UserData = {
  name?: string;
  lastname?: string;
  phone?: string;
  zip_code?: string;
  image?: string;
};

export type AddressData = {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
};