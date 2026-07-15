"use client";

import { useMemo, useState } from "react";

const starterPrompts = [
  "A voice customer support starter with realtime session setup and support handoff design.",
  "Create a production-ready workflow with risks, data flow, and owner handoffs.",
  "Generate a sample user journey and API contract for this starter.",
  "Give me a launch checklist and extension roadmap for this template."
];
const metrics = [
  "Server route",
  "Responsive UI",
  "Env setup"
];
const steps = [
  "Capture input",
  "Run server route",
  "Return structured output"
];
const chips = [
  "Realtime voice",
  "Next.js",
  "OpenAI",
  "Mobile ready"
];
const endpoint = "/api/realtime-token";

export default function Home() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => {
    if (isRunning) return "Running";
    if (result?.demo) return "Local response";
    if (result) return "Completed";
    return "Ready";
  }, [isRunning, result]);

  async function submit(event) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template run failed.");
      setResult(data);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#ecfeff] text-[#05252b]">
      <section className="mx-auto grid min-h-screen max-w-[1380px] gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
        <aside className="rounded-xl border bg-white border-cyan-950/10 p-5"><p className="text-xs font-black uppercase opacity-50">Realtime voice</p><h1 className="mt-4 text-4xl font-black">OpenAI Voice Customer Support</h1><p className="mt-4 text-sm leading-7 opacity-65">A voice customer support starter with realtime session setup and support handoff design.</p><div className="mt-5 space-y-2">{metrics.map((m) => <div className="rounded-xl bg-cyan-100 p-3 font-bold" key={m}>{m}</div>)}</div></aside>
        <main className="space-y-5"><section className="rounded-xl border bg-white border-cyan-950/10 p-5"><form className="space-y-3" onSubmit={submit}>
              <textarea
                className="min-h-32 w-full resize-y border border-current/10 bg-white/70 px-4 py-3 text-sm leading-7 outline-none placeholder:opacity-40 focus:border-current/30"
                onChange={(event) => setPrompt(event.target.value)}
                value={prompt}
              />
              <button
                className="min-h-12 w-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 bg-cyan-700 text-white hover:bg-cyan-800"
                disabled={isRunning || !prompt.trim()}
                type="submit"
              >
                {isRunning ? "Running..." : "Prepare session"}
              </button>
            </form></section><section className="grid gap-5 lg:grid-cols-2"><div className="rounded-xl border bg-white border-cyan-950/10 p-5"><h2 className="font-black">Prompt library</h2><div className="mt-3 space-y-2">{starterPrompts.map((example) => (
                <button
                  key={example}
                  className="w-full border border-current/10 bg-white/45 px-3 py-3 text-left text-sm leading-6 opacity-80 transition hover:opacity-100"
                  onClick={() => setPrompt(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}</div></div><div className="rounded-xl border bg-white border-cyan-950/10 p-5">{error ? <div className="border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">{error}</div> : null}
            {result ? (
              <article className="border border-current/10 bg-white/60 p-4 text-sm leading-7 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>Result</strong>
                  <span className="border border-current/10 px-2 py-1 text-xs opacity-60">{result.model || "local"}</span>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap bg-black/5 p-4 text-sm leading-7">
                  {result.output || result.clientSecret || JSON.stringify(result, null, 2)}
                </pre>
              </article>
            ) : null}</div></section></main>
      </section>
    </main>
  );
}
