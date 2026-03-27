import { API_URL } from "../app/(home)/page";

export async function getMovie(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json()
}

export default async function MovieInfo({ id }) {
    const movie = await getMovie(id)
    return (
        <div className="px-4 md:w-[70%] md:px-0">
            <img src={movie.backdrop_path} alt={movie.title} />
            <div>
                <h1 className="mt-6 text-3xl font-bold">{movie.title}</h1>
                <h3 className="mt-4 flex items-center"><Star/>{movie.vote_average.toFixed(1)} <Dot/> {movie.release_date.slice(0,4)}</h3>
                <p className="hidden md:block">{movie.overview}</p>
                <button className="mt-5 w-full h-12 rounded-[8px] bg-white text-black font-bold">▶ 재생하기</button>
                <div className="mt-5 flex gap-2 w-full h-9 text-center">
                    <button className="rounded-[30px] w-[25%] h-full bg-gray-500/80 text-[14px]">+ 찜하기</button>
                    <a className="rounded-[30px] w-[25%] h-full bg-gray-500/80 leading-9 text-[14px]" href={movie.homepage} target={"_blank"}>홈페이지</a>
                </div>
            </div>
            <div className="hidden md:block">
                <Overview id={id}/>
            </div>
            
        </div>
    )
}

export async function Overview({ id }) {
    const movie = await getMovie(id)
    return(
        <>
            <h3 className="mt-6 text-[18px] font-black">시놉시스</h3>
            <p className="mt-2 mb-6 text-[16px]">{movie.overview}</p>
            <div className="pt-4 border-t border-gray-700">
                <p className="font-black text-[18px]">언어</p>
                <p className="mt-2 text-[16px]">{movie.original_language.toUpperCase()}</p>
            </div>
        </>

    )
}

function Star() {
    return(<span className="translate-y-[-1px]">⭐️</span>)
}
function Dot() {
    return(<span className="w-[3px] h-[3px] bg-white inline-block rounded-1/2 mx-2"></span>)
}