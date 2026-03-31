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
    const topRatedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average).slice(0, 10);
    const latestMovies = [...movies].sort((a, b) => {
        return new Date(b.release_date) - new Date(a.release_date);
    });

    return (
        <main className="min-h-screen py-8overflow-x-hidden">
            <Banner movies={movies}></Banner>
            <MovieSlider movies={topRatedMovies} title="오늘의 TOP 10"/>
            <MovieSlider movies={movies} title="지금 뜨는 콘텐츠" />
            <MovieSlider movies={latestMovies} title="최신 콘텐츠" />
        </main>
    )
}