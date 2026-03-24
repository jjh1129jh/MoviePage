import { API_URL } from "../app/(home)/page";


async function getVideos(id) {
    const reponse = await fetch(`${API_URL}/${id}/videos`);
    return reponse.json();
}

export default async function MovieVideos({ id }) {
    const videos = await getVideos(id)
    return (
        <div>
            {
                videos.map((video) => (
                    <iframe
                    key={video.id}
                    src={`https://youtube.com/embed/${video.key}`}
                    title={video.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    />
                ))
            }
        </div>
    )
}