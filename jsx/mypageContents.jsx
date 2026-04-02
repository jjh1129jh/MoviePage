"use client"

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useMobile } from "./useMobile"; 

const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies";

export default function MyContentList() {
  const [wishList, setWishList] = useState([]);
  const [recentList, setRecentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMobile();

  const handleResetDB = () => {
    if (!confirm("모든 시청 기록과 찜한 콘텐츠를 삭제하시겠습니까?")) return;

    const request = indexedDB.open("MovieDB", 1);
    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction(["wish_list", "recent_vids"], "readwrite");

      transaction.objectStore("wish_list").clear();
      transaction.objectStore("recent_vids").clear();

      transaction.oncomplete = () => {
        alert("모든 기록이 초기화되었습니다.");
        setWishList([]);
        setRecentList([]);
      };
    };
  };

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
    <div className="flex flex-col gap-4 mt-4 md:mt-0 md:gap-12">
      <SliderSection 
        title="최근 시청 기록" 
        items={recentList} 
        isMobile={isMobile} 
        emptyMessage="첫번째 콘텐츠를 즐겨보세요." 
      />
      <SliderSection 
        title="내가 찜한 콘텐츠" 
        items={wishList} 
        isMobile={isMobile} 
        emptyMessage="마음에 드는 콘텐츠를 찜해보세요." 
      />
      
      <div className="px-4 mt-3 flex justify-end md:justify-center">
        <button
          onClick={handleResetDB}
          className="w-full md:w-1/2 cursor-pointer py-5 border border-gray-600 text-gray-400 text-sm rounded-md hover:bg-white hover:text-black hover:border-white transition-all active:scale-95"
        >
          목록 전체 초기화
        </button>
      </div>
    </div>
  );
}

function SliderSection({ title, items, isMobile, emptyMessage }) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkArrows = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(checkArrows, 100);
    
    window.addEventListener("resize", checkArrows);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkArrows);
    };
  }, [items, checkArrows]);

  const scrollTo = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ 
      left: direction === "left" ? -scrollAmount : scrollAmount, 
      behavior: "smooth" 
    });
  };

  return (
    <section className="relative group overflow-visible">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-white px-[5%] md:px-[4%]">
        {title}
      </h2>
      
      <div className="relative overflow-visible">
        {items.length > 0 && showLeftArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("left")} 
            className="absolute left-[1.5%] top-[45%] -translate-y-1/2 w-10 h-10 z-50 cursor-pointer hover:scale-125 transition-all bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain rotate-270 brightness-90 hover:brightness-110"
          />
        )}

        <div 
          ref={sliderRef} 
          onScroll={checkArrows} 
          className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory w-full no-scrollbar pb-10 pt-4"
        >
          <div className="flex-none w-[3%] shrink-0" />
          
          {items.length > 0 ? (
            items.map((movie) => (
              <div key={movie.id} className="flex-none snap-center w-[27%] sm:w-[30%] md:w-[22%] lg:w-[17.5%]">
                <Link href={`/movies/${movie.id}`} className="group relative block transition-transform duration-300 hover:scale-105">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg shadow-lg bg-[#181818]">
                    <img 
                      src={movie.poster_path} 
                      alt={movie.title} 
                      className="w-full h-full object-cover pointer-events-none" 
                    />
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
            ))
          ) : (
            /* 비어있을 때 */
            <div className="flex-none w-[27%] sm:w-[30%] md:w-[22%] lg:w-[17.5%]">
              <div className="relative aspect-[2/3] flex items-center justify-center bg-[#181818]/30 rounded-xl border border-dashed border-gray-800 p-4 text-center">
                <p className="text-gray-500 text-xs md:text-sm leading-relaxed break-keep">
                  {emptyMessage}
                </p>
              </div>
            </div>
          )}

          <div className="flex-none w-[3%] shrink-0" />
        </div>

        {items.length > 0 && showRightArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("right")} 
            className="absolute right-[1.5%] top-[45%] -translate-y-1/2 w-10 h-10 z-50 cursor-pointer hover:scale-125 transition-all bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain rotate-90 brightness-90 hover:brightness-110"
          />
        )}
      </div>
    </section>
  );
}