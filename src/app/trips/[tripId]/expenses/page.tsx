import { Wallet } from "lucide-react";
import { ComingSoonSection } from "@/components/ComingSoonSection";

export default function ExpensesPage() {
  return (
    <ComingSoonSection
      icon={Wallet}
      title="Chi tiêu & chia tiền"
      body="Ghi lại từng khoản chi của chuyến đi, chia cho các thành viên liên quan và tự động tổng kết ai cần trả ai."
      bullets={[
        "Thêm khoản chi: ai trả, chia cho ai, bao nhiêu",
        "Tổng hợp theo từng người và theo hạng mục",
        "Bảng tổng kết cuối chuyến: ai nợ ai bao nhiêu",
      ]}
    />
  );
}
