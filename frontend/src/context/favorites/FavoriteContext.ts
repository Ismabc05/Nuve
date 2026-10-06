import { createContext } from 'react';

// Mi contexto de favoritos va a proporcionar estas 4 cosas.
type FavoriteContextType = {
  favoriteCount: number;
  isFavorite: (productId: number) => boolean;
  addFavoriteProduct: (productId: number) => Promise<void>;
  removeFavoriteProduct: (productId: number) => Promise<void>;
};

// Aquí creamos el contexto de favoritos, que será utilizado por el provider y los componentes que necesiten acceder a la información de favoritos.
export const FavoriteContext = createContext<
  FavoriteContextType | undefined
>(undefined);