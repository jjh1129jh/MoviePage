export const metadata = {
    title: "HOME",
}

export const API_URL = "http://nomad-movies.nomadcoders.workers.dev/movies"

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function HomePage() {
    // await delay(500);
    return (
        <h1>Home!</h1>
    )
}