// routes/movieRoutes.js
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getPopularMovies, getMovieById } from "../controllers/movieController.js";
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite 
} from "../controllers/favoriteController.js";

const router = express.Router();

// Rutas públicas de películas
router.get('/movies', getPopularMovies);
router.get('/movie/:id', getMovieById);

// Rutas de favoritos (protegidas)
router.get('/movies/favorites', authMiddleware, getFavorites);
router.post('/movies/favorites', authMiddleware, addFavorite);
router.delete('/movies/favorites/:movieId', authMiddleware, removeFavorite);

export default router;