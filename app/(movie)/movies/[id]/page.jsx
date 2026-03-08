import { Suspense } from "react";
import MovieVideos from "../../../../jsx/movie-videos";
import MovieInfo, { getMovie } from "../../../../jsx/movie-info";
import Loading from "./loading";

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

    return (
        <div>
            <Suspense>
                <MovieInfo id={id}/>
            </Suspense>
            <Suspense fallback={<Loading />}>
                <MovieVideos id={id} />
            </Suspense>
        </div>
    )
}