"use client";

import { Suspense, useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Logo } from "@/components/Logo";
import { signIn, type AuthFormState } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 inline-block">
          <Logo />
        </Link>

        <h1 className="font-display text-2xl font-bold text-ink">
          Chào mừng trở lại
        </h1>
        <p className="mt-1 text-sm text-muted">
          Đăng nhập để xem các chuyến đi của bạn.
        </p>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="mt-6 text-center text-sm text-muted">
          Chưa có tài khoản?{" "}
          <Link href="/signup" className="font-medium text-ink hover:underline">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/trips";
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    signIn,
    null
  );

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="next" value={next} />

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
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1.5 w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm outline-none focus:border-ink"
          placeholder="••••••••"
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
        className="w-full rounded-full bg-ink py-2.5 text-sm font-medium text-white transition hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
}

