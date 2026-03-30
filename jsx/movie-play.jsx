"use client"

import { useState } from "react"

export default function ContentsPlay({ movie }) {
    const [playSwitch, setPlaySwitch] = useState(0)
    
    return (
        <>
            <div className="w-fit aspect-video relative">
            {
                playSwitch === 0
                ?   <>
                        <img src={movie.backdrop_path} alt={movie.title} />
                        <div className="absolute w-full h-full bg-black/20 opacity-0 transition-opacity duration-200 hover:opacity-100 top-0 left-0 flex items-center justify-center">
                            <img src="/img/playBtn.svg" alt="재생하기" className="w-[7%] cursor-pointer" onClick={()=>{setPlaySwitch(1)}}/>
                        </div>
                    </>
                :   <div>
                        <video 
                            className="w-full h-full"
                            controls      // 소리조절, 전체화면, 구간이동 등 기본 컨트롤 활성화
                            autoPlay      // 전환 시 바로 재생
                            preload="metadata"
                        >
                            <source src="/video/intro_sample.mp4" type="video/mp4" />
                        </video>
                    </div>
            }

            </div>
            <div>
                <h1 className="mt-6 text-3xl font-bold">{movie.title}</h1>
                <h3 className="mt-4 flex items-center"><Star/>{movie.vote_average.toFixed(1)} <Dot/> {movie.release_date.slice(0,4)}</h3>
                <button 
                className="mt-5 w-full h-12 rounded-[8px] bg-white text-black font-bold cursor-pointer"
                onClick={()=>{setPlaySwitch(1)}}
                >▶ 재생하기</button>
                <div className="mt-5 flex gap-2 w-full h-9 text-center">
                    <button className="rounded-[30px] w-[25%] md:w-[12.5%] h-full bg-gray-500/80 text-[14px] cursor-pointer">+ 찜하기</button>
                    <a className="rounded-[30px] w-[25%] md:w-[12.5%] h-full bg-gray-500/80 leading-9 text-[14px]" href={movie.homepage} target={"_blank"}>홈페이지</a>
                </div>
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