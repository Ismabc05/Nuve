import { useContext } from 'react';

import { FavoriteContext } from './FavoriteContext';
// Funcion que usamos para utilizar el contexto de favoritos
export function useFavorite() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      'useFavorite debe utilizarse dentro de un FavoriteProvider'
    );
  }

  return context;
}