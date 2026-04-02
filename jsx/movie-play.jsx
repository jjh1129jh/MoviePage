"use client"

import { useEffect, useState, useRef } from "react"

const DB_NAME = "MovieDB";
const DB_VERSION = 1;

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            // 최근시청기록
            if (!db.objectStoreNames.contains("recent_vids")) {
                db.createObjectStore("recent_vids", { keyPath: "id" });
            }
            // 찜하기목록
            if (!db.objectStoreNames.contains("wish_list")) {
                db.createObjectStore("wish_list", { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("IndexedDB 로드 실패");
    });
};

const saveData = async (storeName, data) => {
    try {
        const db = await initDB();
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        
        store.put({
            ...data,
            timestamp: new Date().getTime()
        });
    } catch (err) {
        console.error("데이터 저장 중 오류 발생:", err);
    }
};

const deleteData = async (storeName, id) => {
    try {
        const db = await initDB();
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        store.delete(id);
    } catch (err) {
        console.error("데이터 삭제 중 오류 발생:", err);
    }
};

const checkIsWished = async (id) => {
    try {
        const db = await initDB();
        return new Promise((resolve) => {
            const transaction = db.transaction("wish_list", "readonly");
            const store = transaction.objectStore("wish_list");
            const request = store.get(id); // ID로 조회
            request.onsuccess = () => resolve(!!request.result); // 데이터가 있으면 true, 없으면 false
            request.onerror = () => resolve(false);
        });
    } catch {
        return false;
    }
};

export default function ContentsPlay({ movie }) {
    const [playSwitch, setPlaySwitch] = useState(0);
    const [isWished, setIsWished] = useState(false); // 찜 상태 관리
    const videoRef = useRef(null);
    useEffect(() => {
        const initWishStatus = async () => {
            const status = await checkIsWished(movie.id);
            setIsWished(status);
        };
        initWishStatus();
    }, [movie.id]);

    // 💡 재생 안되면 강제 재생
    useEffect(() => {
        let timer;
        if (playSwitch === 1 && videoRef.current) {
            timer = setTimeout(() => {
                const video = videoRef.current;
                if (video && (video.paused || video.ended)) {
                    video.play().catch((err) => {
                        console.log("재생 실패", err);
                    });
                }
            }, 2000);
        }
        return () => clearTimeout(timer); // 언마운트 시 타이머 정리
    }, [playSwitch]);

    const handlePlay = () => {
        setPlaySwitch(1);
        saveData("recent_vids", {id: movie.id,});
    };

    const handleWish = async () => {
        if (isWished) {
            await deleteData("wish_list", movie.id);
            setIsWished(false);
        } else {
            await saveData("wish_list", { id: movie.id });
            setIsWished(true);
        }
    };
    
    return (
        <>
            <div className="w-full aspect-video relative">
                <div className="w-full h-full">
                {
                    playSwitch === 0
                    ?   <>
                            <img src={movie.backdrop_path} alt={movie.title} />
                            <div className={`absolute w-full h-full bg-black/20
                            top-0 left-0 flex items-center justify-center
                            2xl:opacity-0 2xl:transition-opacity 2xl:duration-200 2xl:hover:opacity-100
                            `}>
                                <img src="/img/playBtn.svg" alt="재생하기" className="w-[12%] md:w-[7%] cursor-pointer" onClick={handlePlay}/>
                            </div>
                        </>
                    :   
                    <video 
                        className="w-full h-full"
                        controls      // 소리조절, 전체화면, 구간이동 등 기본 컨트롤 활성화
                        autoPlay      // 전환 시 바로 재생
                        preload="metadata"
                    >
                        <source src="/video/intro_sample.mp4" type="video/mp4" />
                    </video>
                }
                </div>
            </div>
            <div>
                <h1 className="mt-6 text-3xl font-bold">{movie.title}</h1>
                <h3 className="mt-4 flex items-center"><Star/>{movie.vote_average.toFixed(1)} <Dot/> {movie.release_date.slice(0,4)}</h3>
                {
                    playSwitch
                    ?   <button 
                        className="mt-5 w-full h-12 rounded-[8px] bg-gray-500/80 text-white font-bold cursor-pointer"
                        onClick={()=>{setPlaySwitch(0)}}
                        >■ 종료
                        </button>
                    :   <button 
                        className="mt-5 w-full h-12 rounded-[8px] bg-white text-black font-bold cursor-pointer"
                        onClick={handlePlay}
                        >▶ 재생하기
                        </button>
                }

                <div className="mt-5 flex gap-2 w-full h-9 text-center">
                    <button 
                        className={`rounded-[30px] w-[25%] md:w-[12.5%] h-full text-[14px] cursor-pointer transition-colors ${
                            isWished ? 'bg-orange-500 text-white' : 'bg-gray-500/80 text-white'
                        }`} 
                        onClick={handleWish}
                    >{isWished ? "- 찜해제" : "+ 찜하기"}
                    </button>
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