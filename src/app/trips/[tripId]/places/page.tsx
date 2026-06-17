import { MapPin } from "lucide-react";
import { ComingSoonSection } from "@/components/ComingSoonSection";

export default function PlacesPage() {
  return (
    <ComingSoonSection
      icon={MapPin}
      title="Địa điểm từ Google Maps"
      body="Tìm quán ăn, điểm tham quan, chỗ nghỉ ngay trên bản đồ và lưu vào chuyến đi để cả nhóm cùng xem."
      bullets={[
        "Tìm kiếm địa điểm bằng Google Places",
        "Xem đánh giá, ảnh, giờ mở cửa của từng nơi",
        "Mọi thành viên có thể đề xuất thêm địa điểm",
      ]}
    />
  );
}
