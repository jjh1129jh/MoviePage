"use client"

import { useRef } from "react"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMobile } from "./useMobile";

export default function Movie({ title, id, backdrop_path, poster_path, onHoverShowModal }) {
    const router = useRouter();
    const hoverTimer = useRef(null);
    const isMobile = useMobile();

    const imgLink = () => {
        router.push(`/movies/${id}`);
    }

    const handleMouseEnter = (e) => {
        if (isMobile) return;

        const target = e.currentTarget;
        const position = {
            top: target.offsetTop,
            left: target.offsetLeft,
            width: target.offsetWidth,
            height: target.offsetHeight
        };

        hoverTimer.current = setTimeout(() => {
            // 💡 방어 코드: 함수가 전달되었을 때만 실행
            if (typeof onHoverShowModal === 'function') {
                onHoverShowModal(id, position);
            }
        }, 600);
    };

    const handleMouseLeave = () => {
        if (hoverTimer.current) {
            clearTimeout(hoverTimer.current);
            hoverTimer.current = null;
        }
    };

    return (
        <div 
            className="flex flex-col gap-1 md:gap-2 cursor-pointer group/item relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="overflow-hidden rounded-sm md:rounded-md bg-gray-900">
                {
                    isMobile
                    ? <img src={poster_path} alt={title || "movie poster"} onClick={imgLink} className="w-full h-full object-cover aspect-[2/3] transition-opacity group-hover/item:opacity-70"/>
                    : <img src={backdrop_path} alt={title || "movie poster"} onClick={imgLink} className="w-full h-full object-cover aspect-video transition-opacity group-hover/item:opacity-70"/>
                } 
            </div>
            
            <Link 
                href={`/movies/${id}`} 
                className="text-[10px] md:text-[15px] font-medium text-gray-400 truncate group-hover/item:text-white transition-colors indent-0.5"
            >
                {title}
            </Link>
        </div>
    )
}

export function GoMoviePage ({ id , title }) {
    const router = useRouter();
    return <h1 className="absolute top-[3%] left-[3%] text-2xl cursor-pointer z-10 opacity-0 group-hover:opacity-100" onClick={()=>{router.push(`/movies/${id}`);}}><strong>〈</strong>&ensp;{title}</h1>
}