import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  getFavorite,
  addFavorite,
  deleteFavorite,
} from '../../services/favorite.service';

import { FavoriteContext } from './FavoriteContext';

// Definimos el tipado de favoriteProvider que va a tener la propiedad children, esta sirve para que cualqier elemento que este dentro de él podrá acceder a las funciones y valores definidos
type FavoriteProviderProps = {
  children: ReactNode;
};

export function FavoriteProvider({
  children,
}: FavoriteProviderProps) {
  const [favoriteCount, setFavoriteCount] = useState(0); // Estado para almacenar la cantidad de productos favoritos
  const [favoriteIds, setFavoriteIds] = useState<number[]>( // Estado para almacenar los IDs de los productos favoritos
    []
  );

  // Este useEffect se ejecuta solamente cuando se monta el elemento en este caso el navbar
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

        // Recorremos el array y guardamos los ids
        const ids = favorites.map(
          (favorite: { id: number }) => favorite.id
        );

        // Actualizamos los estados guardando los ids y la cantidad
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

  // Funcion que retorna un boolena (si o no) en funcion que si dentro de el array incluye se producto
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

    // Actualizamos el array de ids con el nuevo productId
    setFavoriteIds((currentIds) => [
      ...currentIds,
      productId,
    ]);

    // Actualizamos el contador sumandole 1
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

    // Actualiza el array de ids con los productos que no coincidan con ese productId que es el que hemos eliminado
    setFavoriteIds((currentIds) =>
      currentIds.filter((id) => id !== productId)
    );

    // Actualizamos el contador restandole 1 a la cantidad que ya teniamos
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