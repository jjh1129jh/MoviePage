"use client"

import { useEffect, useState } from "react";
import { useMobile } from "./useMobile"

export default function MovieAdditional({id , children , children2}) {
    const isMobile = useMobile();
    const [tabToggle, setTabToggle] = useState(0);
    const [comments, setComments] = useState([]); //리뷰 저장 할 공간
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("") //댓글

    const fetchComments = async () => {
        setLoading(true);
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/comments?_limit=8");
          const data = await response.json();
          setComments(data);
        } catch (error) {
          console.error("데이터를 가져오는데 실패했습니다.", error);
        } finally {
          setLoading(false);
        }
      };

    useEffect(() => {
      if (tabToggle === 0) {fetchComments();}
    }, []);

    const handlePost = async () => {
        if (inputValue.trim() === "") return; //빈칸 방지

        try {
            const response = await fetch("https://jsonplaceholder.typicode.com/comments", {
                method: "POST", // 생성
                body: JSON.stringify({
                    body: inputValue,
                    email: "JEONG JIHWAN@gmail.com",
                    userId: 1,
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const newAddedData = await response.json();

            const fakeUniqueData = {
            ...newAddedData,
            id: Date.now() // 현재 시간(ms)을 id로 써서 중복 방지!
            };

            setComments([fakeUniqueData, ...comments]);
            setInputValue("") //입력창 초기화
        }
        catch (error) {
            console.log("등록 실패", error)
        }
    }

    const profile = (name) => {
        if (!name || name.length === 0) return 'bg-black'

        const lowerChar = name.toLowerCase();
        if (lowerChar < 'a' || lowerChar > 'z') return 'bg-black'; // if문이 작동하는 이유? a와 z를 아스키코드로 생각하면 이해하기 쉬움

        const index = lowerChar.charCodeAt(0) - 'a'.charCodeAt(0); //charCodeAt(0) 고유번호 가져오기 0말고는 들어가면 안됨
        if(index <= 5) {return 'bg-red-500'}
        if(index <= 10) {return 'bg-orange-500'}
        if(index <= 15) {return 'bg-blue-500'}
        if(index <= 20) {return 'bg-green-500'}
        if(index <= 25) {return 'bg-purple-500'}
    }

    const tabOn = (e) => {
        if(isMobile)  {return tabToggle === e && 'border-b-[2px]'}
        else {return tabToggle === e && 'md:border-white'}
    }
    return (
        <div className="mt-6 px-4 md:mt-0 md:px-0 bg-[#202020] md:w-[30%] md:relative">
            <ul className="mt-6 flex gap-4 md:gap-0">
                <li onClick={()=>{setTabToggle(0)}} className={`pb-1 cursor-pointer border-white ${tabOn(0)} md:w-1/2 md:text-center md:border-b-[2px] md:border-gray-500`}>리뷰</li>
                <li onClick={()=>{setTabToggle(1)}} className={`pb-1 cursor-pointer border-white ${tabOn(1)} md:w-1/2 md:text-center md:border-b-[2px] md:border-gray-500`}>관련영상</li>
                <li onClick={()=>{setTabToggle(2)}} className={`pb-1 cursor-pointer border-white ${tabOn(2)} md:hidden`}>상세정보</li>
            </ul>
            {/* 리뷰 */}
            <div className={`pb-8 ${tabToggle === 0 ? "block" : "hidden"}`}>
                {
                    loading
                    ? <p>loading...</p>
                    : (
                        <ul className="mt-6 mx-1 md:px-4 md:pb-6">
                            {comments.map((comment) => {
                                return(
                                    <li key={comment.id} className="border-b border-gray-700 pb-2">
                                        <div className="mt-3 flex items-center gap-2">
                                            <div className={`${profile(comment.email.slice(0)[0])} w-10 h-10 aspect-[1/1] rounded-full relative`}>
                                                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-mono text-2xl text-white">{comment.email.slice(0)[0]}</p>
                                                <div className="absolute w-full h-full rounded-full shadow-[inset_-10px_-10px_0_-7.5px_rgba(0,0,0,0.3)]"></div>
                                            </div>
                                            <p className="text-[17px]">{comment.email.split('@')[0]}</p>
                                        </div>
                                        <p className="mt-2 mb-4 keep-all">{comment.body.length > 100 ? comment.body.slice(0, 200) + "..." : comment.body}</p>
                                    </li>
                                )

                            })}
                        </ul>
                    )
                }
                <div className="fixed md:absolute bottom-0 left-0 w-full p-2 bg-gray-950 border-t-1 border-gray-100/80 mt-4 flex gap-2 z-1000">
                    <input 
                        type="text" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="리뷰를 입력해주세요..."
                        className="flex-1 outline-none rounded-2xl bg-gray-800 py-2 indent-3 text-white"
                    />
                    <button 
                        onClick={handlePost}
                        className="text-black px-4 bg-gray-600 py-2 rounded-2xl text-sm font-bold transition-transform text-white/70"
                    >
                        등록
                    </button>
                </div>
            </div>
            {/* 관련영상 */}
            <div className={`pb-8 md:px-4 ${tabToggle === 1 ? "block" : "hidden"}`}>{children}</div>
            {/* 상세정보 */}
            <div className={`pb-8 ${tabToggle === 2 && isMobile ? "block" : "hidden"}`}>{children2}</div>
        </div>
    )
}