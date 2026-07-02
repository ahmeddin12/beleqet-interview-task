"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import { forgotPassword } from "@/lib/auth";
import { ROLE_LABELS, SIGNUP_ROLES, useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/lib/types/auth";

type Tab = "login" | "signup";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brandGreen focus:ring-2 focus:ring-brandGreen/15";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading: authLoading, login, register } = useAuth();

  const initialTab = searchParams.get("tab") === "signup" ? "signup" : "login";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "JOB_SEEKER" as UserRole,
  });
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/jobs");
    }
  }, [authLoading, user, router]);

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setSuccess(null);
    setShowForgot(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(loginForm);
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(signupForm);
      router.push("/jobs");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);
    try {
      const result = await forgotPassword(forgotEmail);
      setSuccess(result.message);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send reset email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brandGreen" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4rem)]">
        <div className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-primary via-primary2 to-darkGreen p-12 text-white">
          <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.25),transparent_40%),radial-gradient(circle_at_85%_75%,rgba(56,189,248,0.18),transparent_45%)]" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 text-success" />
              Ethiopia&apos;s trusted job platform
            </div>
            <h1 className="mt-8 text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              Your next career move starts{" "}
              <span className="text-success">here</span>.
            </h1>
            <p className="mt-4 max-w-md text-white/70 leading-relaxed">
              Join thousands of professionals and employers on Beleqet. Search verified jobs,
              apply faster, and get real-time alerts on Telegram.
            </p>
          </div>

          <div className="relative space-y-4">
            {[
              { icon: ShieldCheck, title: "Verified listings", desc: "Every job is reviewed for quality" },
              { icon: Briefcase, title: "Apply in seconds", desc: "One profile, unlimited applications" },
              { icon: Building2, title: "Hire top talent", desc: "Post jobs and reach qualified candidates" },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Icon className="h-5 w-5 text-success" />
                </span>
                <div>
                  <p className="font-semibold text-sm">{title}</p>
                  <p className="text-xs text-white/55">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden text-center">
              <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-lg text-primary">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brandGreen text-white text-sm">
                  B
                </span>
                Beleqet <span className="text-brandGreen">Job</span>
              </Link>
            </div>

            {showForgot ? (
              <div className="rounded-2xl border border-border bg-white p-7 shadow-card">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className="text-sm text-muted hover:text-brandGreen transition-colors"
                >
                  ← Back to login
                </button>
                <h2 className="mt-4 text-2xl font-extrabold text-ink">Reset password</h2>
                <p className="mt-2 text-sm text-muted">
                  Enter your email and we&apos;ll send you a reset link if an account exists.
                </p>

                <form onSubmit={handleForgotPassword} className="mt-6 space-y-4">
                  {error && <Alert type="error" message={error} />}
                  {success && <Alert type="success" message={success} />}

                  <div>
                    <label htmlFor="forgot-email" className="text-xs font-semibold text-ink">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
                      <input
                        id="forgot-email"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="you@example.com"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                  </div>

                  <SubmitButton loading={isSubmitting} label="Send reset link" />
                </form>
              </div>
            ) : (
              <>
                <div className="text-center lg:text-left">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-ink">
                    {tab === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {tab === "login"
                      ? "Sign in to access your saved jobs and applications."
                      : "Join Beleqet and start your journey today."}
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 rounded-xl bg-pageBg p-1 border border-border">
                  {(["login", "signup"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => switchTab(t)}
                      className={`rounded-lg py-2.5 text-sm font-semibold transition-all ${
                        tab === t
                          ? "bg-white text-brandGreen shadow-sm"
                          : "text-muted hover:text-ink"
                      }`}
                    >
                      {t === "login" ? "Log in" : "Sign up"}
                    </button>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-border bg-white p-7 shadow-card">
                  {error && <Alert type="error" message={error} />}

                  {tab === "login" ? (
                    <form onSubmit={handleLogin} className="space-y-4">
                      <Field
                        id="login-email"
                        label="Email address"
                        icon={Mail}
                        type="email"
                        value={loginForm.email}
                        onChange={(v) => setLoginForm((f) => ({ ...f, email: v }))}
                        placeholder="you@example.com"
                      />
                      <PasswordField
                        id="login-password"
                        label="Password"
                        value={loginForm.password}
                        onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))}
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                      />

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setShowForgot(true);
                            setError(null);
                            setForgotEmail(loginForm.email);
                          }}
                          className="text-xs font-medium text-brandGreen hover:text-darkGreen transition-colors"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <SubmitButton loading={isSubmitting} label="Log in" />
                    </form>
                  ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          id="signup-first"
                          label="First name"
                          icon={User}
                          value={signupForm.firstName}
                          onChange={(v) => setSignupForm((f) => ({ ...f, firstName: v }))}
                          placeholder="Abebe"
                        />
                        <Field
                          id="signup-last"
                          label="Last name"
                          icon={User}
                          value={signupForm.lastName}
                          onChange={(v) => setSignupForm((f) => ({ ...f, lastName: v }))}
                          placeholder="Kebede"
                        />
                      </div>

                      <Field
                        id="signup-email"
                        label="Email address"
                        icon={Mail}
                        type="email"
                        value={signupForm.email}
                        onChange={(v) => setSignupForm((f) => ({ ...f, email: v }))}
                        placeholder="you@example.com"
                      />

                      <PasswordField
                        id="signup-password"
                        label="Password"
                        value={signupForm.password}
                        onChange={(v) => setSignupForm((f) => ({ ...f, password: v }))}
                        show={showPassword}
                        onToggle={() => setShowPassword((s) => !s)}
                        hint="Minimum 8 characters"
                      />

                      <div>
                        <label className="text-xs font-semibold text-ink">I am a...</label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {SIGNUP_ROLES.map((role) => (
                            <button
                              key={role}
                              type="button"
                              onClick={() => setSignupForm((f) => ({ ...f, role }))}
                              className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition-all ${
                                signupForm.role === role
                                  ? "border-brandGreen bg-brandGreen/5 text-brandGreen"
                                  : "border-border text-muted hover:border-brandGreen/40"
                              }`}
                            >
                              {ROLE_LABELS[role]}
                            </button>
                          ))}
                        </div>
                      </div>

                      <SubmitButton loading={isSubmitting} label="Create account" />
                    </form>
                  )}
                </div>

                <p className="mt-6 text-center text-xs text-muted">
                  {tab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchTab(tab === "login" ? "signup" : "login")}
                    className="font-semibold text-brandGreen hover:text-darkGreen transition-colors"
                  >
                    {tab === "login" ? "Sign up for free" : "Log in"}
                  </button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Alert({ type, message }: { type: "error" | "success"; message: string }) {
  const styles =
    type === "error"
      ? "bg-redAccent/8 border-redAccent/20 text-redAccent"
      : "bg-success/8 border-success/20 text-brandGreen";

  return (
    <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${styles}`}>
      {message}
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          id={id}
          type={type}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pl-10`}
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold text-ink">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          id={id}
          type={show ? "text" : "password"}
          required
          minLength={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          className={`${inputClass} pl-10 pr-10`}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink transition-colors"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full inline-flex items-center justify-center gap-2 rounded-full bg-brandGreen px-6 py-3.5 text-sm font-semibold text-white hover:bg-darkGreen transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {label}
          <ArrowRight className="h-4 w-4" />
        </>
      )}
    </button>
  );
}
