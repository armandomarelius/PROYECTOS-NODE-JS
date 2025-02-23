import { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl, addToFavorites, removeFromFavorites } from "../services/tmdb";
import { FaHeart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const MovieCard = ({ movie, isFavorite = false, onFavoriteChange }) => {
  const [isInFavorites, setIsInFavorites] = useState(isFavorite);
  const { isAuthenticated } = useAuth();
  const rating = movie.vote_average.toFixed(1);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // para que link no me recarge
    try {
      if (isInFavorites) {
        await removeFromFavorites(movie.id);
      } else {
        await addToFavorites(movie.id);
      }
      setIsInFavorites(!isInFavorites);
      if (onFavoriteChange) {
        onFavoriteChange(movie.id, !isInFavorites);
      }
    } catch (error) {
      console.error('Error al gestionar favoritos:', error);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="bg-sky-800">
      <article className="card transform transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-[2/3]">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            className="object-cover w-full h-full rounded-lg shadow-lg"
          />
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded">
            ⭐ {rating}
          </div>
          {isAuthenticated && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-2 left-2 p-2 rounded-full ${
                isInFavorites ? 'text-red-500' : 'text-gray-300'
              }`}
            >
              <FaHeart size={20} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg line-clamp-2 text-white">{movie.title}</h3>
          <p className="text-sm text-gray-300 line-clamp-2">
            {movie.release_date.split(":")[0].split("T")[0]}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default MovieCard;