import { useParams } from "react-router-dom";
import { SyncLoader } from "react-spinners";
import { useFetch } from "../hooks/useFetch";
import { getImageUrl, getMovieDetails } from "../services/tmdb";

const MovieDetail = () => {
  const { id } = useParams();
  const { data, loading, error } = useFetch(
    () => getMovieDetails(Number(id)),
    [id]
  );

  if (error) {
    return (
      <div className="text-center p-10">
        <p className="text-red-600">Error al cargar la película</p>
      </div>
    );
  }

  if (loading) {
    return <SyncLoader color="#00aeff" cssOverride={{}} margin={5} size={25}></SyncLoader>
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="relative h-96 mb-8">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={getImageUrl(data?.backdrop_path, "original")}
          alt={data?.title}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 text-white p-6">
            <h1 className="text-4xl font-bold">{data?.title}</h1>
            <p className="text-lg">
              Fecha de estreno: <span className="ml-2">{data?.release_date.split(":")[0].split("T")[0]}</span>
            </p>
            <p>{data?.vote_average}⭐</p>
          </div>
        </div>
      </header>

      {/* la sinopsis */}
      <section className="px-6 mb-8">
        <h2 className="text-2xl font-semibold">Sinopsis</h2>
        <p className="mt-4 text-lg">{data?.overview}</p>
      </section>

      {/* Información adicional */}
      <section className="px-6 mb-8">
        <h3 className="text-xl font-semibold">Más información</h3>
        <ul className="mt-4">
          <li><strong>Título original:</strong> {data?.original_title}</li>
          <li><strong>Idioma original:</strong> {data?.original_language}</li>
          <li><strong>Popularidad:</strong> {data?.popularity}</li>
          <li><strong>Votos:</strong> {data?.vote_count}</li>
        </ul>
      </section>

      {/* imagen de la peli grande  */}
      <section className="px-6 mb-8">
        <img
          className="w-full h-auto rounded-lg"
          src={getImageUrl(data?.poster_path, "w400")}
          alt={data?.title}
        />
      </section>
    </article>
  );
};

export default MovieDetail;
