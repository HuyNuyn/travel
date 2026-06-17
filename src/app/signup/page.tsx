"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { signUp, type SignUpFormState } from "./actions";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState<
    SignUpFormState,
    FormData
  >(signUp, null);

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-block">
          <Logo />
        </Link>

        <h1 className="font-display text-2xl font-bold text-ink">
          Tạo tài khoản
        </h1>
        <p className="mt-1 text-sm text-muted">
          Miễn phí — bắt đầu lên kế hoạch cho chuyến đi đầu tiên.
        </p>

        {state?.message ? (
          <p className="mt-8 rounded-lg bg-teal-soft px-4 py-3 text-sm text-teal">
            {state.message}
          </p>
        ) : (
          <form action={formAction} className="mt-8 space-y-4">
            <div>
              <label
                htmlFor="fullName"
                className="text-sm font-medium text-ink"
              >
                Họ tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                autoComplete="name"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                placeholder="ban@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-ink"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-coral-soft px-3 py-2 text-sm text-coral">
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-full bg-coral py-2.5 text-sm font-medium text-white transition hover:bg-coral/90 disabled:opacity-60"
            >
              {pending ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-medium text-ink hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
