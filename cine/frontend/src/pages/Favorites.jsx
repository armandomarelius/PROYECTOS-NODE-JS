import { useState, useEffect } from 'react';
import { getFavoriteMovies } from '../services/tmdb';
import MovieCard from '../components/MovieCard';
import { SyncLoader } from 'react-spinners';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await getFavoriteMovies();
      setFavorites(data);
    } catch (err) {
      setError('Error al cargar favoritos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleFavoriteChange = (movieId, isFavorite) => {
    if (!isFavorite) {
      setFavorites(favorites.filter(movie => movie.movieId !== movieId));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <SyncLoader color="#00aeff" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-sky-950">Mis Películas Favoritas</h1>
      </header>

      <section>
        {favorites.length === 0 ? (
          <p className="text-center text-gray-600">No tienes películas favoritas aún.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.movieId}
                movie={{
                  id: movie.movieId,
                  title: movie.title,
                  poster_path: movie.poster_path,
                  vote_average: movie.vote_average,
                  release_date: new Date().toISOString()  // se me ha olvidado ponerlo de repsuesta en el back asi que creo nueva
                }}
                isFavorite={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Favorites;