// src/app/upload/page.tsx
"use client";

import { useState } from "react";
import { processPdfFile } from "./action";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { FileText, Loader2, ShieldCheck, UploadCloud } from "lucide-react";

export default function PDFUpload() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const result = await processPdfFile(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "PDF processed successfully",
        });
        e.target.value = "";
      } else {
        setMessage({
          type: "error",
          text: result.error || "Failed to process PDF",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: `${err}An error occurred while processing the PDF`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="noir-surface noir-grid min-h-[calc(100vh-4rem)] px-4 py-8 text-[#fff4e8] sm:px-6 lg:py-14">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section>
          <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#778a71]/[0.35] bg-[#778a71]/[0.12] px-3 py-1.5 text-sm font-medium text-[#dce6d5] shadow-sm backdrop-blur">
            <ShieldCheck className="size-4" />
            Source library setup
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#fff4e8] sm:text-5xl">
            Add PDFs to sharpen every answer.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#d8c3b5]">
            Process a document once, then use chat to ask specific questions
            across your uploaded knowledge base.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {[
              "Upload a PDF",
              "Extract and chunk text",
              "Ask grounded questions",
            ].map((item, index) => (
              <div
                className="noir-glass flex items-center gap-3 rounded-md border p-3 text-sm font-medium text-[#fff4e8] shadow-sm"
                key={item}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-[#c9875f] text-xs font-bold text-[#160f12]">
                  {index + 1}
                </span>
                {item}
              </div>
            ))}
          </div>
        </section>

        <Card className="noir-vignette border-white/[0.12] bg-[#201318]/[0.88] backdrop-blur">
          <CardContent className="p-4 sm:p-6">
            <div className="rounded-md border border-white/10 bg-[#100a0d] p-5 text-[#fff4e8] sm:p-6">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">
                    PDF Upload
                  </h2>
                  <p className="mt-1 text-sm text-[#d8c3b5]">
                    Select a PDF file and let the backend prepare it for RAG.
                  </p>
                </div>
                <div className="flex size-11 shrink-0 items-center justify-center rounded-md bg-[#c9875f] text-[#160f12] shadow-lg shadow-[#c9875f]/20">
                  <UploadCloud className="size-5" />
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-lg border border-dashed border-[#c9875f]/[0.35] bg-[radial-gradient(circle_at_top,rgb(201_135_95_/_13%),transparent_18rem),#21161a] p-5 transition hover:border-[#c9875f] sm:p-8">
                  <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-md bg-[#fff4e8] text-[#160f12]">
                    <FileText className="size-7" />
                  </div>
                  <Label
                    className="block text-center text-base font-semibold text-[#fff4e8]"
                    htmlFor="pdf-upload"
                  >
                    Upload PDF File
                  </Label>
                  <p className="mx-auto mt-2 max-w-sm text-center text-sm text-[#d8c3b5]">
                    Choose a document from your device to process it into the
                    searchable source index.
                  </p>
                  <Input
                    id="pdf-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="mt-5 cursor-pointer border-white/[0.12] bg-[#fff4e8] text-[#160f12] file:mr-4 file:rounded-md file:border-0 file:bg-[#160f12] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-[#fff4e8]"
                  />
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2 rounded-md border border-[#c9875f]/25 bg-[#c9875f]/[0.12] p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span className="text-sm text-[#f1c39f]">
                      Processing PDF...
                    </span>
                  </div>
                )}

                {message && (
                  <Alert
                    className={
                      message.type === "error"
                        ? "border-red-500/40 bg-red-950/30 text-red-100"
                        : "border-[#778a71]/[0.45] bg-[#778a71]/20 text-[#dce6d5]"
                    }
                    variant={
                      message.type === "error" ? "destructive" : "default"
                    }
                  >
                    <AlertTitle>
                      {message.type === "error" ? "Upload failed" : "Processed"}
                    </AlertTitle>
                    <AlertDescription>{message.text}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
