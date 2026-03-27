import { API_URL } from "../app/(home)/page";


async function getVideos(id) {
    const response = await fetch(`${API_URL}/${id}/videos`, {
        next: { revalidate: 3600 } // 1시간동안 캐시 유지
    });
    return response.json();
}

export default async function MovieVideos({ id }) {
    const videos = await getVideos(id)
    return (
        <>
            {
                videos.map((video) => (
                    <iframe
                    className="w-full aspect-video my-6"
                    key={video.id}
                    src={`https://youtube.com/embed/${video.key}`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    />
                ))
            }
        </>
    )
}