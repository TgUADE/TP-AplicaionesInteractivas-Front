import { createContext, useContext } from "react";
import { useFavorites } from "../hook/useFavorites";

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const favoritesData = useFavorites();
  
  return (
    <FavoritesContext.Provider value={favoritesData}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook para usar favoritos en cualquier componente
export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  
  if (!context) {
    throw new Error('useFavoritesContext must be used within a FavoritesProvider');
  }
  
  return context;
};
