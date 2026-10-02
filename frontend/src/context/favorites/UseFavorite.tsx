import { useContext } from 'react';

import { FavoriteContext } from './FavoriteContext';

export function useFavorite() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error(
      'useFavorite debe utilizarse dentro de un FavoriteProvider'
    );
  }

  return context;
}