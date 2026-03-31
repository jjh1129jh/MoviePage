"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useMobile } from "./useMobile"; // 기존에 만드신 커스텀 훅 경로 확인

const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

export default function MyContentList() {
  const [wishList, setWishList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile();

  useEffect(() => {
    const loadAndMatchData = async () => {
      try {
        const response = await fetch(API_URL);
        const allMovies = await response.json();

        const getIdsFromDB = (storeName) => {
          return new Promise((resolve) => {
            const request = indexedDB.open("MovieDB", 1);
            request.onsuccess = () => {
              const db = request.result;
              if (!db.objectStoreNames.contains(storeName)) return resolve([]);
              const transaction = db.transaction(storeName, "readonly");
              const store = transaction.objectStore(storeName);
              const getAll = store.getAll();
              getAll.onsuccess = () => resolve(getAll.result);
            };
            request.onerror = () => resolve([]);
          });
        };

        const storedWish = await getIdsFromDB("wish_list");
        const storedRecent = await getIdsFromDB("recent_vids");

        const matchData = (storedData) => {
          return storedData
            .sort((a, b) => b.timestamp - a.timestamp)
            .map(storedItem => {
              const movieInfo = allMovies.find(m => m.id === Number(storedItem.id));
              return movieInfo ? { ...movieInfo, timestamp: storedItem.timestamp } : null;
            })
            .filter(Boolean);
        };

        setWishList(matchData(storedWish));
        setRecentList(matchData(storedRecent));
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAndMatchData();
  }, []);

  if (loading) return <div className="py-20 text-center text-gray-500">기록을 불러오는 중...</div>;

  return (
    <div className="flex flex-col gap-12">
      <SliderSection title="최근 시청 기록" items={recentList} isMobile={isMobile} />
      <SliderSection title="내가 찜한 콘텐츠" items={wishList} isMobile={isMobile} />
    </div>
  );
}

// --- 공통 슬라이더 섹션 컴포넌트 ---
// --- 공통 슬라이더 섹션 컴포넌트 ---
function SliderSection({ title, items, isMobile }) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      // 여백(4%)을 고려하여 화살표 표시 로직 미세 조정
      setShowLeftArrow(scrollLeft > 30);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 30);
    }
  };

  const scrollTo = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    // 현재 보이는 너비의 80%만큼 이동
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ 
      left: direction === "left" ? -scrollAmount : scrollAmount, 
      behavior: "smooth" 
    });
  };

  if (items.length === 0) return null;

  return (
    <section className="relative group overflow-visible">
      {/* 타이틀 영역 여백 유지 */}
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white px-[5%] md:px-[4%]">
        {title}
      </h2>
      
      <div className="relative overflow-visible">
        {/* 왼쪽 화살표: 여백 안쪽에 배치 */}
        {showLeftArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("left")} 
            className="absolute left-[1.5%] top-[45%] -translate-y-1/2 w-10 h-10 z-50 cursor-pointer hover:scale-125 transition-all bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain rotate-270 brightness-90 hover:brightness-110"
          />
        )}

        <div 
          ref={sliderRef} 
          onScroll={handleScroll} 
          // no-scrollbar는 글로벌 CSS에 정의되어 있어야 합니다.
          className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory w-full no-scrollbar pb-10 pt-4"
        >
          {/* 💡 왼쪽 여백용 더미 div: x축 정렬의 핵심 */}
          <div className="flex-none w-[3%] shrink-0" />
          
          {items.map((movie) => (
            <div key={movie.id} className="flex-none snap-center w-[27%] sm:w-[30%] md:w-[22%] lg:w-[17.5%]">
              <Link href={`/movies/${movie.id}`} className="group relative block transition-transform duration-300">
                <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-[#181818]">
                  <img 
                    src={movie.poster_path} 
                    alt={movie.title} 
                    className="w-full h-full object-cover pointer-events-none" 
                  />
                  
                  {/* 정보 레이어 스타일 유지 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm truncate">{movie.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-400 text-[10px] font-bold">
                        ★ {movie.vote_average?.toFixed(1)}
                      </span>
                      <span className="text-gray-300 text-[10px]">
                        {movie.release_date?.split('-')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}

          {/* 💡 오른쪽 여백용 더미 div */}
          <div className="flex-none w-[3%] shrink-0" />
        </div>

        {/* 오른쪽 화살표: 여백 안쪽에 배치 */}
        {showRightArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("right")} 
            className="absolute right-[1.5%] top-[45%] -translate-y-1/2 w-10 h-10 z-50 cursor-pointer hover:scale-125 transition-all bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain rotate-90 brightness-90 hover:brightness-110"
          />
        )}
      </div>
    </section>
  );
}