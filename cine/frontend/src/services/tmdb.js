const VITE_BASE_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// objeto que me permite decidir el tamaño de las imágenes
export const IMAGES_SIZES = {
  POSTER: "w500",
  BACKDROP: "original",
};

// ------------- FUNCIONES QUE VOY A CREAR PARA LA API -------------
// función obtener url de imagen (seguiremos accedinedo API original)
// le paso un path : /sssss
export const getImageUrl = (path, size = IMAGES_SIZES.POSTER) => {
  if (!path) return "/placeholder-movie.jpg";
  return `${VITE_BASE_IMAGE_URL}/${size}${path}`;
};

// con un solo fetch chetado accedemos a todos los endpoints  
const fetchFromBackend = async (endpoint, options = {}) => {
  try {
    const defaultOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(
      `${VITE_BACKEND_URL}/api${endpoint}`,
      { ...defaultOptions, ...options }
    );

    if (!response.ok) {
      throw new Error("Error en la petición");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

// llamadas a las pelis
export const getPopularMovies = async (page = 1) => {
  return fetchFromBackend(`/movies?page=${page}`);
};

export const getMovieDetails = async (id) => {
  return fetchFromBackend(`/movie/${id}`);
};

// llamadas a favoritos 
// Obtener favoritos
export const getFavoriteMovies = async () => {
  return fetchFromBackend('/movies/favorites');
};
import { toast } from "sonner";

// Añadir a favoritos
export const addToFavorites = async (movieId) => {
  try {
    const response = await fetchFromBackend('/movies/favorites', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });

    if (response.message === "Película añadida a favoritos") {
      toast.success("Pelicula añadida a favoritos", {
        style: {
          background: "#00bcd4",
          border: "1px solid black",
          color: "white",
        },
      });
    } else if (response.message === "La película ya está en favoritos") {
      toast.info("La película ya está en favoritos");
    } else {
      toast.error("Hubo un error al añadir la película a favoritos");
    }
  } catch (error) {
    toast.error("Error al añadir la película a favoritos");
    console.error(error);
  }
};

// Eliminar de favoritos
export const removeFromFavorites = async (movieId) => {
  try {
    const response = await fetchFromBackend(`/movies/favorites/${movieId}`, {
      method: 'DELETE',
    });

    if (response.message === "Película eliminada de favoritos") {
      toast.success("Película eliminada de favoritos");
    } else {
      toast.error("Hubo un error al eliminar la película de favoritos");
    }
  } catch (error) {
    toast.error("Error al eliminar la película de favoritos");
    console.error(error);
  }
};