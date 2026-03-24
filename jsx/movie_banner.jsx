"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation";
import { useMobile } from "./useMobile";

const API_URL = "https://nomad-movies.nomadcoders.workers.dev/movies"; 

export default function BannerM({ movies, title }) {
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const [hoveredMovieId, setHoveredMovieId] = useState(null);
  // --- 추가된 상태: 비디오 키 저장용 ---
  const [videoKeys, setVideoKeys] = useState({}); 

  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isDragged, setIsDragged] = useState(false);

  const router = useRouter();
  const isMobile = useMobile();

  // --- 추가된 함수: 비디오 키 가져오기 ---
  const fetchVideoKey = async (id) => {
    if (videoKeys[id]) return; // 이미 있으면 다시 호출 안 함
    try {
      const response = await fetch(`${API_URL}/${id}/videos`);
      const data = await response.json();
    if (data && data.length >= 4) {
        // 4번째 값(인덱스 3)을 가져옴
        setVideoKeys(prev => ({ ...prev, [id]: data[3].key }));
      } else if (data && data.length > 0) {
        // 만약 4번째 값이 없다면, 가장 첫 번째 값이라도 가져오도록 예외 처리 (선택 사항)
        setVideoKeys(prev => ({ ...prev, [id]: data[0].key }));
      }
    } catch (error) {
      console.error("Failed to fetch video:", error);
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 50);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handleMouseEnter = (id) => {
    if (isMobile) return;
    // 마우스를 올리면 미리 비디오 데이터를 가져옴
    fetchVideoKey(id); 
    
    timerRef.current = setTimeout(() => {
      setHoveredMovieId(id);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setHoveredMovieId(null);
  };

  const onMouseDown = (e) => {
    if (isMobile) return;
    setIsDown(true);
    setIsDragged(false);
    handleMouseLeave(); // 드래그 시작 시 호버 초기화
    
    sliderRef.current.style.scrollBehavior = "auto";
    sliderRef.current.style.scrollSnapType = "none";
    
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const onMouseUp = () => {
    if (!isDown) return;
    setIsDown(false);
    sliderRef.current.style.scrollBehavior = "smooth";
    sliderRef.current.style.scrollSnapType = "x mandatory";
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    
    if (Math.abs(x - startX) > 5) {
      setIsDragged(true);
      handleMouseLeave(); // 움직이는 동안에는 타이머 작동 안 함
      e.preventDefault();
      sliderRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleItemClick = (e, movieId) => {
    if (isDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    router.push(`/movies/${movieId}`);
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('resize', handleScroll);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [movies]);

  return (
    <section className="mb-8 md:mb-16 relative group overflow-hidden">
      <div className="relative">
        <div
          ref={sliderRef}
          onScroll={handleScroll}
          onMouseDown={onMouseDown}
          onMouseLeave={() => {
            onMouseUp();
            handleMouseLeave();
          }}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide w-full no-scrollbar select-none ${
            isDown ? "cursor-grabbing" : "cursor-grab"
          }`}
        >
          <div className="flex-none w-[12.5%] md:w-[7.5%] shrink-0" />

          {[...movies].filter((_, index) => [2, 9, 10, 12, 17].includes(index)).map((movie) => (
            <div 
              key={movie.id} 
              className="flex-none snap-center transition-transform duration-300 w-[75%] md:w-[85%] border-1 md:border-0 border-gray-400/50 rounded-2xl overflow-hidden shadow-xl"
              onClick={(e) => handleItemClick(e, movie.id)}
              onMouseEnter={() => handleMouseEnter(movie.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex flex-col gap-1 md:gap-2 cursor-pointer group/item relative pb-[40px] md:pb-0">
                <div className="overflow-hidden rounded-sm md:rounded-md bg-gray-900">
                  {
                    isMobile
                    ? <img src={movie.poster_path} alt={movie.title} className="w-full h-full object-cover transition-opacity duration-500 pointer-events-none aspect-[2/3]"/>
                    : hoveredMovieId === movie.id
                      ? <iframe 
                          className="w-full h-full object-cover transition-opacity duration-500 pointer-events-none aspect-[2/1] object-top scale-[1.4]"
                          src={`https://www.youtube.com/embed/${videoKeys[movie.id]}?autoplay=1&mute=1&loop=1&playlist=${videoKeys[movie.id]}&controls=0&modestbranding=1`}
                          title="YouTube video player" 
                          frameBorder="0" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                          allowFullScreen // 'S' 대문자 확인 (React 기준)
                        ></iframe>
                        
                      : <img src={movie.backdrop_path} alt={movie.title} className="w-full h-full object-cover transition-opacity duration-500 pointer-events-none aspect-[2/1] object-top"/>
                  }

                  
                </div>
                
                <div className="absolute bottom-0 md:top-0 left-0 w-full flex flex-col-reverse h-[80px] md:h-full bg-[linear-gradient(0deg,rgba(0,0,0,0.7)0%,rgba(0,0,0,0.4)60%,transparent 100%)] md:bg-[linear-gradient(90deg,rgba(0,0,0,0.7)0%,rgba(255,255,255,0)100%)] px-5 pb-5 md:px-0 md:pl-[5%] md:pb-[17.5%]">
                  <div className="flex items-center justify-between w-full md:w-1/4 gap-3">
                    <button 
                      className="w-full h-10 md:h-14 rounded-[6px] bg-white text-[#1e1e1e] font-bold hover:bg-gray-200 transition-colors"
                      onClick={(e) => isDragged && e.stopPropagation()}
                    >
                      ▶ 재생하기
                    </button>
                    <button 
                      className="w-full h-10 md:h-14 rounded-[6px] bg-gray-400/30 backdrop-blur-md text-white border border-gray-500/50"
                      onClick={(e) => isDragged && e.stopPropagation()}
                    >
                      + 찜하기
                    </button>
                  </div>
                  {!isMobile && (
                    <>
                      <span className="text-[20px] mb-6">⭐{movie.vote_average.toFixed(1)} <strong>·</strong> {movie.release_date}</span>
                      <h4 className="text-5xl mb-6">{movie.title}</h4>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="flex-none w-[12.5%] md:w-[7.5%] shrink-0" />
        </div>
      </div>
    </section>
  );
}