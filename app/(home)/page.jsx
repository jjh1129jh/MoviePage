import Movie from "../../jsx/movie";
import css from "../../styles/home.module.css"

export const metadata = {
    title: "HOME",
}

export const API_URL = "http://nomad-movies.nomadcoders.workers.dev/movies"

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getMovies() {
    const response = await fetch(API_URL);
    const json = await response.json();
    return json;
}

export default async function HomePage() {
    // await delay(500);
    const movies = await getMovies();
    return (
        <div className={css.container}>
        {
            movies.map((movie, id) => (
                <Movie key={movie.title} title={movie.title} id={movie.id} poster_path={movie.poster_path}></Movie>
            ))
        }
        </div>
    )
}