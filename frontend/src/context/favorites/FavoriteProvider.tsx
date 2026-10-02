import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getFavorite,
  addFavorite,
  deleteFavorite,
} from '../../services/product.service';

import { FavoriteContext } from './FavoriteContext';

type FavoriteProviderProps = {
  children: ReactNode;
};

export function FavoriteProvider({
  children,
}: FavoriteProviderProps) {
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(
    []
  );

  useEffect(() => {
    const loadFavorites = async () => {
      const storedUser = localStorage.getItem('user');

      if (!storedUser) {
        setFavoriteCount(0);
        setFavoriteIds([]);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        setFavoriteCount(0);
        setFavoriteIds([]);
        return;
      }

      try {
        const favorites = await getFavorite(userId);

        const ids = favorites.map(
          (favorite: { id: number }) => favorite.id
        );

        setFavoriteIds(ids);
        setFavoriteCount(ids.length);
      } catch (error) {
        console.error(
          'Error al cargar favoritos:',
          error
        );

        setFavoriteCount(0);
        setFavoriteIds([]);
      }
    };

    loadFavorites();
  }, []);

  const isFavorite = (productId: number) => {
    return favoriteIds.includes(productId);
  };

  const addFavoriteProduct = async (productId: number) => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('No hay usuario autenticado');
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    await addFavorite(userId, productId);

    setFavoriteIds((currentIds) => [
      ...currentIds,
      productId,
    ]);

    setFavoriteCount(
      (currentCount) => currentCount + 1
    );
  };

  const removeFavoriteProduct = async (
    productId: number
  ) => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      throw new Error('No hay usuario autenticado');
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    await deleteFavorite(userId, productId);

    setFavoriteIds((currentIds) =>
      currentIds.filter((id) => id !== productId)
    );

    setFavoriteCount((currentCount) =>
      Math.max(0, currentCount - 1)
    );
  };

  return (
    <FavoriteContext.Provider
      value={{
        favoriteCount,
        isFavorite,
        addFavoriteProduct,
        removeFavoriteProduct,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}