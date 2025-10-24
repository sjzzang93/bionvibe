"use client";

import { useState } from "react";
import Link from "next/link";
import { getBrowserSupabase } from "@/lib/supabase";

type FormState = "idle" | "submitting" | "done";

export default function RewardEventPage() {
  const supabase = getBrowserSupabase();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formState, setFormState] = useState<FormState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState === "submitting") return;

    if (!name.trim() || !email.trim()) {
      setMessage("이름과 이메일을 입력해 주세요.");
      return;
    }

    if (!file) {
      setMessage("룰렛 당첨 화면을 캡처한 이미지를 업로드해 주세요.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage("이미지 용량은 5MB 이하로 업로드해 주세요.");
      return;
    }

    setFormState("submitting");
    setMessage(null);

    try {
      const fileExt = file.name.split(".").pop();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.\-]/g, "_");
      const filePath = `proofs/${Date.now()}-${Math.random().toString(36).slice(2)}-${sanitizedName}`;

      const { error: uploadError } = await supabase.storage
        .from("nonsense-escape-proofs")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || `image/${fileExt ?? "png"}`
        });

      if (uploadError) {
        throw new Error(uploadError.message);
      }

      const { data } = supabase.storage.from("nonsense-escape-proofs").getPublicUrl(filePath);
      const screenshotUrl = data.publicUrl;

      const response = await fetch("/api/nonsense-escape/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, screenshotUrl })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.message ?? "신청이 정상적으로 접수되지 않았어요.");
      }

      setFormState("done");
      setMessage("신청이 접수되었습니다! 이메일로 지급 안내를 보내드릴게요.");
    } catch (error: any) {
      console.error("[nonsense-escape][reward]", error);
      setFormState("idle");
      setMessage(error?.message ?? "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12 sm:px-8">
        <header className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Bionvive Roulette Reward</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">이벤트 당첨 신청</h1>
          <p className="mt-4 text-slate-300">
            룰렛에서 구글 기프트카드에 당첨되셨나요? 축하드립니다!<br className="hidden sm:block" />
            아래 정보를 입력하고 당첨 화면을 캡처한 이미지를 업로드해 주세요.
          </p>
        </header>

        <div className="rounded-3xl border border-slate-700/60 bg-slate-900/70 p-8 shadow-2xl backdrop-blur">
          <div className="mb-6 rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
            <p className="font-semibold text-amber-200">필수 안내</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>화면 전체가 보이도록 캡처해 주세요. (룰렛 결과 + 안내문이 보이면 좋아요!)</li>
              <li>신청 후 안내 메일이 발송되면 24시간 이내에 지급이 진행됩니다.</li>
              <li>잘못된 정보가 입력되면 지급이 지연될 수 있습니다.</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-200">이름</label>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="예) 홍길동"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">이메일</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="example@bionvibe.com"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-200">당첨 화면 캡처 이미지</label>
              <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-dashed border-slate-600 bg-slate-900/40 px-4 py-5 text-sm text-slate-300">
                <div>
                  <p className="font-semibold text-slate-100">이미지 파일 업로드</p>
                  <p className="mt-1 text-xs text-slate-400">PNG, JPG 형식 / 최대 5MB</p>
                  {file && <p className="mt-2 text-xs text-cyan-200">선택한 파일: {file.name}</p>}
                </div>
                <label className="cursor-pointer rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 px-4 py-2 font-semibold text-slate-900 shadow-lg transition-transform duration-200 hover:scale-105">
                  파일 선택
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const targetFile = event.target.files?.[0] ?? null;
                      setFile(targetFile);
                    }}
                  />
                </label>
              </div>
            </div>

            {message && (
              <p className={`text-sm ${formState === "done" ? "text-emerald-300" : "text-amber-200"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={formState === "submitting"}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-4 text-lg font-bold text-slate-900 shadow-[0_20px_60px_-20px_rgba(251,191,36,0.7)] transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {formState === "submitting" ? "신청 접수 중..." : formState === "done" ? "신청 완료" : "이벤트 신청하기"}
            </button>
          </form>
        </div>

        <footer className="mt-8 text-center text-sm text-slate-500">
          <p>
            신청이 잘 완료되었나요? 궁금한 사항이 있다면
            <Link href="/contact" className="text-cyan-300 hover:text-cyan-100"> 문의 페이지 </Link>
            로 언제든 알려주세요.
          </p>
        </footer>
      </div>
    </div>
  );
}
