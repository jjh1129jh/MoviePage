import { GoMoviePage } from "../../../../jsx/movie";
import { getMovie } from "../../../../jsx/movie-info";

export default async function DirectContents({ params }) {
    const { id } = await params;
    const movie = await getMovie(id);
    return (
        <div className="w-[100dvw] h-[100dvh] relative overflow-hidden group">
            <GoMoviePage id={movie.id} title={movie.title}/>

            <h3 className="hidden 2xl:block text-3xl absolute bottom-[4%] right-[10%] opacity-15">SAMPLE 영상입니다.</h3>
            <video 
                className="w-full h-full"
                controls      // 소리조절, 전체화면, 구간이동 등 기본 컨트롤 활성화
                autoPlay      // 전환 시 바로 재생
                preload="metadata"
            >
                <source src="/video/intro_sample.mp4" type="video/mp4" />
            </video>
        </div>
    )
}
