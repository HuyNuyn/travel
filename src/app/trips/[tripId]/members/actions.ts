"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type MemberFormState = { error?: string; success?: string } | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function inviteMember(
  _prevState: MemberFormState,
  formData: FormData
): Promise<MemberFormState> {
  const tripId = String(formData.get("tripId") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!EMAIL_RE.test(email)) {
    return { error: "Email không hợp lệ." };
  }

  const supabase = await createClient();

  const { data: existingUserId } = await supabase.rpc(
    "get_user_id_by_email",
    { p_email: email }
  );

  const insertPayload: {
    trip_id: string;
    user_id: string | null;
    invited_email: string | null;
    role: string;
    status: string;
  } = existingUserId
    ? {
        trip_id: tripId,
        user_id: existingUserId as string,
        invited_email: null,
        role: "member",
        status: "active",
      }
    : {
        trip_id: tripId,
        user_id: null,
        invited_email: email,
        role: "member",
        status: "invited",
      };

  const { error } = await supabase.from("trip_members").insert(insertPayload);

  if (error) {
    if (error.code === "23505") {
      return { error: "Người này đã ở trong chuyến đi hoặc đã được mời." };
    }
    return { error: "Không thêm được thành viên. Bạn cần là chủ chuyến đi." };
  }

  revalidatePath(`/trips/${tripId}/members`);
  return {
    success: existingUserId
      ? "Đã thêm thành viên vào chuyến đi."
      : "Đã gửi lời mời. Người này sẽ tự động tham gia khi đăng ký với email vừa nhập.",
  };
}

export async function removeMember(tripId: string, memberId: string) {
  const supabase = await createClient();
  await supabase.from("trip_members").delete().eq("id", memberId);
  revalidatePath(`/trips/${tripId}/members`);
}
