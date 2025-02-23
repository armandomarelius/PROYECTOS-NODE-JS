import Movie from '../models/Movie.js';


const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const PAGES_TO_CACHE = 20;

// Función de inicialización para cargar las películas en la BD
export const initializeMovieDatabase = async () => {
  try {
    // Limpiar la base de datos antes de inicializar
    await Movie.deleteMany({});
    console.log('Base de datos limpiada');
    
    // Cargar las primeras páginas para que no pete
    for (let page = 1; page <= PAGES_TO_CACHE; page++) {
      const response = await fetch(
        `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=es-ES&page=${page}`
      );
      const data = await response.json();

      const movies = data.results.map(movie => ({
        ...movie,
        release_date: new Date(movie.release_date)
      }));

      await Movie.insertMany(movies, { ordered: false })
        .catch(err => console.log(`Error en página ${page}:`, err.message));

      console.log(`Página ${page} cargada`);
    }

    const totalMovies = await Movie.countDocuments();
    console.log(`Base de datos inicializada con éxito. Total películas: ${totalMovies}`);
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
  }
};

// Controlador para obtener películas populares (solo lee de BD)
export const getPopularMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    
    // Obtener total de películas para calcular páginas
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / 20);

    // Obtener películas de la página solicitada
    const movies = await Movie.find()
      .sort({ popularity: -1 })
      .skip((page - 1) * 20)
      .limit(20);

    res.json({
      page,
      results: movies,
      total_pages: totalPages
    });
  } catch (error) {
    console.error('Error in getPopularMovies:', error);
    res.status(500).json({ message: "Error al obtener películas populares" });
  }
};

// Controlador para obtener película por ID (solo lee de BD)
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const movie = await Movie.findOne({ id: Number(id) });
    
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    res.json(movie);
  } catch (error) {
    console.error('Error en getMovieById:', error);
    res.status(500).json({ message: "Error al obtener los detalles de la película" });
  }
};