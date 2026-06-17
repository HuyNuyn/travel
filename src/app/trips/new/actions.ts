"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type CreateTripState = { error: string } | null;

export async function createTrip(
  _prevState: CreateTripState,
  formData: FormData
): Promise<CreateTripState> {
  const name = String(formData.get("name") ?? "").trim();
  const destination = String(formData.get("destination") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startDate = String(formData.get("start_date") ?? "") || null;
  const endDate = String(formData.get("end_date") ?? "") || null;
  const coverColor = String(formData.get("cover_color") ?? "#14213D");

  if (!name) {
    return { error: "Vui lòng đặt tên cho chuyến đi." };
  }
  if (startDate && endDate && startDate > endDate) {
    return { error: "Ngày kết thúc phải sau ngày khởi hành." };
  }

  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return { error: "Phiên đăng nhập đã hết hạn. Hãy đăng nhập lại." };
  }

  const { data: trip, error } = await supabase
    .from("trips")
    .insert({
      name,
      destination: destination || null,
      description: description || null,
      start_date: startDate,
      end_date: endDate,
      cover_color: coverColor,
      created_by: userData.user.id,
    })
    .select("id")
    .single();

  if (error || !trip) {
    return { error: error?.message ?? "Không tạo được chuyến đi." };
  }

  redirect(`/trips/${trip.id}`);
}
