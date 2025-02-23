import { useState, useEffect } from "react";
import { getPopularMovies } from "../services/tmdb.js";
import MovieCard from "../components/MovieCard.jsx";
import { toast } from "sonner";
import { SyncLoader } from "react-spinners";

const MovieList = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      // las pelis mas popus ya vienen en la 1º pag 
      const popularData = await getPopularMovies(1);
      setPopularMovies(popularData.results.slice(0, 5));

      // Para el resto, obtenemos todas las páginas
      let allMovies = [];
      const totalPages = popularData.total_pages;

      for (let page = 1; page <= totalPages; page++) {
        const data = await getPopularMovies(page);
        allMovies = [...allMovies, ...data.results];
      }

      const sortedByDate = [...allMovies].sort(
        (a, b) => new Date(b.release_date) - new Date(a.release_date)
      );

      const sortedByRating = [...allMovies].sort(
        (a, b) => b.vote_average - a.vote_average
      );

      setRecentMovies(sortedByDate.slice(0, 5));
      setTopRatedMovies(sortedByRating.slice(0, 5));
      
    } catch (error) {
      toast.error("Error al cargar las películas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <SyncLoader
          color="#00aeff"
          cssOverride={{}}
          margin={5}
          size={25}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      {/* Películas Populares */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-bold mb-4">
          Lista de las películas más populares
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {popularMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Películas Recientes */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-bold mb-4">
          Lista de las películas más recientes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Películas Mejor Valoradas */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-bold mb-4">
          Lista de las películas más votadas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {topRatedMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default MovieList;