"use client"

import { useEffect, useRef, useState } from "react"
import Movie from "./movie"
import { useMobile } from "./useMobile";

export default function MovieSlider({ movies, title }) {
  const sliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [modalPos, setModalPos] = useState(null); 
  const [isClosing, setIsClosing] = useState(false);
  const isMobile = useMobile();

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setShowLeftArrow(scrollLeft > 50);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const handleShowModal = (id, pos) => {
    setIsClosing(false);
    setSelectedMovieId(id);
    setModalPos(pos);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedMovieId(null);
      setModalPos(null);
      setIsClosing(false);
    }, 300); 
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [movies]);

  const scrollTo = (direction) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = container.offsetWidth * 0.8;
    container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  const selectedMovie = movies.find(m => m.id === selectedMovieId);

  const getModalStyle = () => {
    if (!modalPos || !sliderRef.current) return null;
    
    // 💡 너비를 이미지 크기의 2배로 설정
    const modalWidth = modalPos.width * 1.4; 
    const scrollOffset = sliderRef.current.scrollLeft;

    const itemVisualLeft = modalPos.left - scrollOffset;
    const itemVisualRight = itemVisualLeft + modalPos.width;

    const threshold = 10; 
    if (itemVisualLeft < threshold || itemVisualRight > window.innerWidth - threshold) {
      return null; 
    }

    // 💡 높이는 h-auto이므로 top 위치는 중앙 정렬을 위해 적절한 offset 유지
    // 모달이 위로 솟아오르는 느낌을 주기 위해 top 좌표를 이미지 상단 부근으로 잡습니다.
    let top = modalPos.top - 70; 
    let left = (modalPos.left - scrollOffset) + (modalPos.width / 2) - (modalWidth / 2);

    const padding = 20;
    const maxLeft = sliderRef.current.offsetWidth - modalWidth + (padding * 2);
    const safeLeft = Math.max(padding, Math.min(left, maxLeft));

    return {
      top: `${top}px`,
      left: `${safeLeft}px`,
      width: `${modalWidth}px`, // 💡 계산된 너비 적용
    };
  };

  const modalStyle = getModalStyle();

  const truncatedOverview = selectedMovie?.overview
  ? selectedMovie.overview.length > 200
    ? selectedMovie.overview.slice(0, 200) + "..."
    : selectedMovie.overview
  : "상세 정보가 없습니다.";

  return (
    <section className="md:mb-16 relative group">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-[4%] text-white">{title}</h2>
      
      <div className="relative overflow-visible">
        {showLeftArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("left")} 
            className="absolute bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain left-[2%] top-[37%] -translate-y-1/2 w-10 h-10 rotate-270 z-50 cursor-pointer hover:brightness-125 transition-all"
          />
        )}

        <div 
          ref={sliderRef} 
          onScroll={handleScroll} 
          className="flex gap-3 md:gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide w-full mb-6 no-scrollbar pb-8"
          style={{ overflowY: 'visible' }}
        >
          <div className="flex-none w-[3%] shrink-0" />
          {movies.map((movie) => (
            <div key={movie.id} className="flex-none snap-center w-[27%] sm:w-[45%] md:w-[30%] lg:w-[17.5%]">
              <Movie {...movie} onHoverShowModal={handleShowModal} />
            </div>
          ))}
          <div className="flex-none w-[3%] shrink-0" />
        </div>

        {showRightArrow && !isMobile && (
          <button 
            onClick={() => scrollTo("right")} 
            className="absolute bg-[url('/img/slider_arrow.svg')] bg-no-repeat bg-contain right-[2%] top-[37%] -translate-y-1/2 w-10 h-10 rotate-90 z-50 cursor-pointer hover:brightness-125 transition-all"
          />
        )}
        {!isMobile && selectedMovieId && modalStyle && (
          <div 
            className={`absolute bg-[#181818] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] z-[100] pointer-events-auto
              ${isClosing ? 'animate-fadeOut scale-95 opacity-0' : 'animate-radialIn'} transition-all duration-300`}
            style={modalStyle} // width와 left, top이 포함됨
            onMouseLeave={handleCloseModal}
          >
            <div className="w-full h-full flex flex-col">
              <div className="w-full aspect-video relative">
                <img src={selectedMovie?.backdrop_path} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent" />
              </div>
              <div className="p-6 md:p-8 flex-1">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedMovie?.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {truncatedOverview}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}