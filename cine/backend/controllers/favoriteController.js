// controllers/favoriteController.js
import Favorite from '../models/Favorite.js';
import Movie from '../models/Movie.js';

export const getFavorites = async (req, res) => {
    try {
              
      if (!req.userId) {
        return res.status(401).json({ message: "Usuario no autenticado" });
      }
  
      const userId = req.userId;
      console.log('Buscando favoritos para userId:', userId);
      
      const favorites = await Favorite.find({ userId })
        .sort({ addedAt: -1 });

      res.json(favorites || []);
    } catch (error) {
      console.error('Error detallado al obtener favoritos:', error);
      res.status(500).json({ 
        message: "Error al obtener las películas favoritas",
        error: error.message 
      });
    }
  };

export const addFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.userId;

    const movie = await Movie.findOne({ id: Number(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    const existingFavorite = await Favorite.findOne({ 
      userId, 
      movieId: Number(movieId) 
    });
    
    if (existingFavorite) {
      return res.status(400).json({ message: "La película ya está en favoritos" });
    }

    const favorite = new Favorite({
      userId,
      movieId: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      overview: movie.overview,
      vote_average: movie.vote_average
    });

    await favorite.save();

    res.status(201).json({ 
      message: "Película añadida a favoritos",
      favorite 
    });
  } catch (error) {
    console.error('Error al añadir favorito:', error);
    res.status(500).json({ message: "Error al añadir la película a favoritos" });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.userId;

    const result = await Favorite.findOneAndDelete({ 
      userId, 
      movieId: Number(movieId) 
    });
    
    if (!result) {
      return res.status(404).json({ message: "Favorito no encontrado" });
    }

    res.json({ message: "Película eliminada de favoritos" });
  } catch (error) {
    console.error('Error al eliminar favorito:', error);
    res.status(500).json({ message: "Error al eliminar la película de favoritos" });
  }
};