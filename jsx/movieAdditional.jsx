"use client"

import { useState } from "react";
import { useMobile } from "./useMobile"

export default function MovieAdditiona({id , children , children2}) {
    const isMobile = useMobile();
    console.log(id)
    return (
        <div className="mt-6 px-4 bg-[#202020]">
            {
                !isMobile
                ? <AdditionaPC children={children}/>
                : <AdditionaM children={children} children2={children2}/>
            }
        </div>
    )
}

function AdditionaPC({children}) {
    return (
        <>
            <div>항 PC!!!</div>
            <p>관련영상</p>
            {children}        
        </>
    )
}

function AdditionaM({children, children2}) {
    const [tapToggle, setTapToggle] = useState(1)
    return (
        <>
            <ul className="mt-6 flex gap-3">
                <li onClick={()=>{setTapToggle(1)}}>관련영상</li>
                <li onClick={()=>{setTapToggle(0)}}>상세정보</li>
            </ul>
            {
                tapToggle == 1
                ?   <div className="pb-8">
                        {children}
                    </div>
                :   <div className="pb-8">
                        {children2}
                    </div>
            }
        </>
    )
}