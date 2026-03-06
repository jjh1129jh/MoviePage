"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "../styles/navigation.module.css"

export default function Navigation() {
    const path = usePathname();
    return (
        <nav className={css.nav}>
            <ul>
                <li>
                    {
                        path === "/"
                        ? <Link href="/" className={css.on}>HOME</Link>
                        : <Link href="/">HOME</Link>
                    }
                </li>
                <li>
                    {
                        path === "/about-us"
                        ? <Link href="/about-us" className={css.on}>About Us</Link>
                        : <Link href="/about-us">About Us</Link>
                    }
                </li>
            </ul>
        </nav>
    )
}