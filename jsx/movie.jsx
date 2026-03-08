"use client"

import Link from "next/link";
import css from "../styles/movie.module.css";
import { useRouter } from "next/navigation";


export default function Movie({title, id, poster_path}) {
    const router = useRouter();
    const imgLink = () => {
        router.push(`/movies/${id}`);
    }
    return (
        <div className={css.movie} key={id}>
            <img src={poster_path} alt={title} onClick={imgLink} />
            <Link href={`/movies/${id}`}>{title}</Link>
        </div>
    )
}