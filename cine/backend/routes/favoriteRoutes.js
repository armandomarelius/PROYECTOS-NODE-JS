import express from "express";
import { addFavorite, removeFavorite, getFavorites } from "../controllers/favoriteController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware); // Todas las rutas requieren autenticación

router.post('/favorites', addFavorite);
router.delete('/favorites/:movieId', removeFavorite);
router.get('/favorites', getFavorites);

export default router;