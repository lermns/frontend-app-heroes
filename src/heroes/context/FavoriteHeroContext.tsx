import {
  createContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import type { Hero } from "../types/hero-interface";

interface FavoriteHeroContext {
  // state
  favorites: Hero[];
  favoriteCount: number;

  // methods
  toggleFavorite: (hero: Hero) => void;
  isFavorite: (hero: Hero) => boolean;
}

export const FavoriteHeroContext = createContext({} as FavoriteHeroContext);

// intentar usar zod para validar los datos del localstorage
const getFavoritesFromLocalStorage = (): Hero[] => {
  const favorite = localStorage.getItem("favorites");
  return favorite ? JSON.parse(favorite) : [];
};

export const FavoriteHeroProvider = ({ children }: PropsWithChildren) => {
  const [favorites, setFavorites] = useState<Hero[]>(
    getFavoritesFromLocalStorage()
  );

  const toggleFavorite = (hero: Hero) => {
    const heroExist = favorites.find((h) => h.id === hero.id);

    if (heroExist) {
      const newFavorites = favorites.filter((h) => h.id !== hero.id);
      setFavorites(newFavorites);
      return;
    }

    setFavorites([...favorites, hero]);
  };

  const isFavorite = (hero: Hero) => favorites.some((h) => h.id === hero.id);

  // cada que se recargue la pantalla el useEffect cogera los datos del localstorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  return (
    <FavoriteHeroContext
      value={{
        // State
        favoriteCount: favorites.length,
        favorites: favorites,

        // Methods
        toggleFavorite: toggleFavorite,
        isFavorite: isFavorite,
      }}
    >
      {children}
    </FavoriteHeroContext>
  );
};
