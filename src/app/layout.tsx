import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wayfare — Lập kế hoạch du lịch nhóm",
  description:
    "Lên lịch trình, lưu địa điểm từ Google Maps, theo dõi chi tiêu và chia tiền cho cả nhóm trong một chuyến đi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans text-[15px]">
        {children}
      </body>
    </html>
  );
}
