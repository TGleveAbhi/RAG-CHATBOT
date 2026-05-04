import Link from "next/link";
import {
  ArrowRight,
  FileText,
  MessageSquareText,
  Search,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  return (
    <main className="noir-surface noir-grid min-h-[calc(100vh-4rem)] overflow-hidden text-[#fff4e8]">
      <section className="container mx-auto grid min-h-[calc(100vh-4rem)] items-center gap-10 px-4 py-10 md:grid-cols-[1.05fr_0.95fr] md:py-14">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#c9875f]/30 bg-[#c9875f]/[0.12] px-3 py-1.5 text-sm font-medium text-[#f1c39f] shadow-sm backdrop-blur">
            <Search className="size-4" />
            Private document intelligence
          </div>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-[#fff4e8] sm:text-5xl lg:text-7xl">
            Read, retrieve, and answer from your documents.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#d8c3b5] sm:text-lg">
            A polished RAG workspace for uploading PDFs and asking grounded
            questions with a calm, cinematic interface.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              className="copper-button inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition"
              href="/chat"
            >
              Start Chatting
              <ArrowRight className="size-4" />
            </Link>
            <Link
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.08] px-5 text-sm font-semibold text-[#fff4e8] backdrop-blur transition hover:bg-white/[0.14]"
              href="/upload"
            >
              Upload PDF
              <FileText className="size-4" />
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              ["Oxblood", "#7f3344"],
              ["Copper", "#c9875f"],
              ["Sage", "#778a71"],
            ].map(([label, color]) => (
              <div
                className="noir-glass rounded-md border p-3 shadow-sm"
                key={label}
              >
                <div
                  className="mb-3 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <p className="text-sm font-semibold text-[#fff4e8]">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -right-8 -top-8 hidden size-32 rounded-full border border-[#c9875f]/25 md:block" />
          <div className="absolute -bottom-7 left-10 hidden h-20 w-36 rounded-md bg-[#778a71]/20 blur-2xl md:block" />

          <div className="noir-vignette rounded-lg border border-white/[0.12] bg-[#201318]/[0.88] p-3 backdrop-blur">
            <div className="rounded-md border border-white/10 bg-[#100a0d] p-4">
              <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-[#fff4e8]">
                    Document Session
                  </p>
                  <p className="text-xs text-[#c9875f]">Sources indexed</p>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-[#c9875f]/[0.14] px-3 py-2 text-[#f1c39f]">
                  <ShieldCheck className="size-4" />
                  <span className="text-xs font-semibold">Ready</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="mr-8 rounded-md border border-white/10 bg-white/[0.06] p-4">
                  <p className="text-sm text-[#e8d8cc]">
                    Summarize the strongest evidence from this PDF.
                  </p>
                </div>
                <div className="ml-8 rounded-md bg-[#fff4e8] p-4 text-[#160f12] shadow-lg shadow-[#c9875f]/10">
                  <p className="text-sm">
                    The answer is grounded in the uploaded text, with the most
                    relevant passages prioritized for retrieval.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {[
                    ["#160f12", "Ink"],
                    ["#7f3344", "Oxblood"],
                    ["#c9875f", "Copper"],
                  ].map(([color, label]) => (
                    <div
                      className="rounded-md border border-white/10 p-3"
                      key={label}
                      style={{ backgroundColor: color }}
                    >
                      <p className="text-xs font-semibold text-white/[0.85]">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 rounded-md border border-[#778a71]/30 bg-[#778a71]/[0.12] p-3 text-sm text-[#dce6d5]">
                  <MessageSquareText className="size-4" />
                  Clean chat, upload, and retrieval flow.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
