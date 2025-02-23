import { useState } from "react";
import { toast } from "sonner";
import { getPopularMovies } from "../services/tmdb";
import MovieCard from "../components/MovieCard";
import { SyncLoader } from "react-spinners";  // Importa el spinner

const SearchMovies = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    setLoading(true);
    setMovies([]); // Limpiar los resultados previos

    try {
      let allMovies = [];
      const firstPageData = await getPopularMovies(1);
      const totalPages = firstPageData.total_pages;

      // Recorremos todas las páginas sin necesidad de una variable extra
      for (let page = 1; page <= totalPages; page++) {
        const data = await getPopularMovies(page);
        allMovies.push(...data.results); // Añadimos las películas directamente
      }

      // Filtrar las películas por el término de búsqueda
      const filteredMovies = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
      );

      setMovies(filteredMovies);
    } catch (error) {
      toast.error("Error al obtener películas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-950">Buscador de Pelis</h1>
      <form onSubmit={handleSearch} className="flex justify-center gap-2 my-4">
        <input
          type="text"
          placeholder="Busca tu peli ideal ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 rounded-lg text-black bg-white focus:outline-none border-1 focus:ring-1"
        />
        <button
          type="submit"
          className="bg-cyan-400 text-white px-4 py-3 rounded-lg shadow-lg hover:bg-cyan-700"
        >
          Buscar
        </button>
      </form>

      {loading && (
        <div className="flex justify-center my-8">
          <SyncLoader
            color="#00aeff"
            cssOverride={{}}
            margin={5}
            size={25}
          />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {!loading && movies.length === 0 && search.trim() !== "" && (
        <p className="text-center text-white">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default SearchMovies;
