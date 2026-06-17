"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "", label: "Tổng quan" },
  { href: "/itinerary", label: "Lịch trình" },
  { href: "/places", label: "Địa điểm" },
  { href: "/expenses", label: "Chi tiêu" },
  { href: "/tasks", label: "Công việc" },
  { href: "/members", label: "Thành viên" },
];

export function TripTabs({ tripId }: { tripId: string }) {
  const pathname = usePathname();
  const base = `/trips/${tripId}`;

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border">
      {TABS.map((tab) => {
        const href = `${base}${tab.href}`;
        const active =
          tab.href === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={tab.href}
            href={href}
            className={`shrink-0 border-b-2 px-3.5 py-3 text-sm font-medium transition ${
              active
                ? "border-coral text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
