import { API_URL } from "../app/(home)/page";
import css from "../styles/movie-info.module.css"

export async function getMovie(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json()
}

export default async function MovieInfo({ id }) {
    const movie = await getMovie(id)
    return (
        <div className={css.container}>
            <img className={css.poster} src={movie.poster_path} alt={movie.title} />
            <div className={css.info}>
                <h1 className={css.title}>{movie.title}</h1>
                <h3>⭐️{movie.vote_average.toFixed(1)}</h3>
                <p>{movie.overview}</p>
                <a href={movie.homepage} target={"_blank"}>Homepage</a>
            </div>
        </div>
    )
}