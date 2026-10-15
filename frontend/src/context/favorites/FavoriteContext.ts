import { createContext } from 'react';

// Mi contexto de favoritos va a proporcionar estas 4 cosas.
type FavoriteContextType = {
  favoriteCount: number; // Numero de favoritos que hay 
  isFavorite: (productId: number) => boolean; // Funcion que permite saber si ese producto es favorito o no
  addFavoriteProduct: (productId: number) => Promise<void>; // Funcion para añadir un favorito
  removeFavoriteProduct: (productId: number) => Promise<void>; // Funcion para eliminar un favorito
  clearFavorite: () => void;
  refreshFavorites: () => Promise<void>;
};

// Aquí creamos el contexto de favoritos, que será utilizado por el provider y los componentes que necesiten acceder a la información de favoritos.
export const FavoriteContext = createContext<
  FavoriteContextType | undefined
>(undefined);