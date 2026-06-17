"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { translateAuthError } from "@/lib/authErrors";

export type SignUpFormState = { error?: string; message?: string } | null;

export async function signUp(
  _prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Vui lòng điền đầy đủ thông tin." };
  }
  if (password.length < 6) {
    return { error: "Mật khẩu cần tối thiểu 6 ký tự." };
  }

  const origin =
    (await headers()).get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${origin}/auth/callback?next=/trips`,
    },
  });

  if (error) {
    return { error: translateAuthError(error.message) };
  }

  // Nếu project Supabase đã tắt "Confirm email", session sẽ có ngay.
  if (data.session) {
    redirect("/trips");
  }

  return {
    message:
      "Đã gửi email xác nhận. Hãy mở email và bấm vào liên kết để hoàn tất đăng ký.",
  };
}
