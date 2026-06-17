import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-coral-soft text-coral">
        <Compass size={24} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-ink">
        Không tìm thấy trang này
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Trang bạn tìm có thể đã bị xóa, hoặc bạn chưa được thêm vào chuyến đi
        này.
      </p>
      <Link
        href="/trips"
        className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink-soft"
      >
        Về danh sách chuyến đi
      </Link>
    </div>
  );
}
