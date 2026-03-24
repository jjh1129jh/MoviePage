import Banner from "../../jsx/movie_banner";
import MovieSlider from "../../jsx/movieSlider";

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
        <main className="min-h-screen py-8overflow-x-hidden">
            <Banner movies={movies}></Banner>
            <MovieSlider movies={movies} title="지금 뜨는 콘텐츠" />
            <MovieSlider movies={movies.slice().reverse()} title="시청중인 콘텐츠"/>
            <MovieSlider movies={movies.slice(5, 15)} title="오늘의 TOP 10 영화" />
            <div className="h-64">항</div>
        </main>
    )
}