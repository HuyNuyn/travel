import { CalendarRange } from "lucide-react";
import { ComingSoonSection } from "@/components/ComingSoonSection";

export default function ItineraryPage() {
  return (
    <ComingSoonSection
      icon={CalendarRange}
      title="Lịch trình theo ngày"
      body="Sắp xếp các địa điểm đã lưu vào từng ngày của chuyến đi, kèm giờ giấc và khoảng cách di chuyển."
      bullets={[
        "Kéo - thả địa điểm vào từng ngày",
        "Tự tính thời gian di chuyển giữa các điểm (Google Directions)",
        "Xem toàn bộ hành trình trên một bản đồ",
      ]}
    />
  );
}
