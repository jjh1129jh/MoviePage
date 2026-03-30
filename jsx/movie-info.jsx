import { API_URL } from "../app/(home)/page";
import ContentsPlay from "./movie-play";

export async function getMovie(id) {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json()
}

export default async function MovieInfo({ id }) {
    const movie = await getMovie(id)
    return (
        <div className="px-4 md:w-[67%] md:px-0 md:h-fit md:pb-12">
            <ContentsPlay movie={movie} />
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