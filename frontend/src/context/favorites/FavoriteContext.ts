import { createContext } from 'react';

type FavoriteContextType = {
  favoriteCount: number;
  isFavorite: (productId: number) => boolean;
  addFavoriteProduct: (productId: number) => Promise<void>;
  removeFavoriteProduct: (productId: number) => Promise<void>;
};

export const FavoriteContext = createContext<
  FavoriteContextType | undefined
>(undefined);