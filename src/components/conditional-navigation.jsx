"use client"

import { usePathname } from "next/navigation";
import { Navigation } from "./navigation";

export function ConditionalNavigation() {
    const pathname = usePathname();

    // Hide navigation if path contains "dashboard"
    if (pathname.includes("dashboard") || pathname.includes("profile")) {
        return null;
    }

    return <Navigation />;
}
