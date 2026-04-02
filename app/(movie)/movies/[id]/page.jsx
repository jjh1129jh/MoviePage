import { Suspense } from "react";
import MovieInfo, { getMovie, Overview } from "../../../../jsx/movie-info";
import Loading from "./loading";
import MovieAdditional from "../../../../jsx/movieAdditional";
import MovieVideos, { getVideos } from "../../../../jsx/movie-videos";

export async function generateMetadata({ params }) {//generateMetadata 넥스트에서 제공하는 메타데이터 함수
    const { id } = await params;
    const movie = await getMovie(id)
    return {
        title:movie.title
    }
}

// params = 주소 맨끝의 고유 id
export default async function MovieDetail({ params }) {
    const { id } = await params;
    const videoPromise = getVideos(id);
    return (
        <div className="flex flex-col md:flex-row md:gap-8 md:px-8">
            <Suspense fallback={<Loading />}>
                <MovieInfo id={id}/>
            </Suspense>
            <MovieAdditional id={id}
            children2={
                <Suspense>
                    <Overview id={id} />
                </Suspense>
            }>
                <Suspense>
                    <MovieVideos id={videoPromise} />
                </Suspense>
            </MovieAdditional>
            
        </div>
    )
}