import { useState, useEffect } from 'react';

export const useMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 초기 로드 시 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint);
    };

    checkMobile();

    // 리사이즈 이벤트 등록
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
};