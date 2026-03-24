"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobile } from "./useMobile";

export default function Navigation() {
    const path = usePathname();
    const isMobile = useMobile();
    return (
        <nav className="py-5">
            <ul className="flex items-center justify-between px-4">
                <li className="w-10">
                <Link href="/"><img src="/img/logo.png" alt="로고" /></Link>
                </li>
                <li className="w-10">
                    <Link href="/mypage"><img src="/img/user_icon.png" alt="유저" /></Link>
                </li>
            </ul>
        </nav>
    )
}