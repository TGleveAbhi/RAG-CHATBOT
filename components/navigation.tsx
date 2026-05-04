"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import { LogOut, MessageSquareText, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navigation = () => {
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const navLinks = [
    { href: "/chat", label: "Chat", icon: MessageSquareText },
    { href: "/upload", label: "Upload", icon: UploadCloud },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#120c0f]/[0.82] shadow-lg shadow-black/20 backdrop-blur-xl">
      <div className="container mx-auto flex min-h-16 flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <Link className="group flex items-center gap-3" href="/">
          <div className="relative flex size-10 items-center justify-center overflow-hidden rounded-md bg-[#fff4e8] text-sm font-bold text-[#160f12] shadow-lg shadow-[#c9875f]/20 transition-transform group-hover:scale-105">
            <span className="absolute inset-x-0 bottom-0 h-1.5 bg-[#c9875f]" />
            R
          </div>
          <div>
            <div className="text-base font-semibold tracking-tight text-[#fff4e8] sm:text-xl">
              RAG Chatbot
            </div>
            <div className="text-xs font-medium uppercase tracking-[0.22em] text-[#c9875f]">
              Oxblood Desk
            </div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {!isSignedIn ? (
            <>
              <SignInButton mode="modal">
                <Button
                  className="border border-white/10 bg-white/5 text-[#fff4e8] hover:bg-white/10"
                  variant="ghost"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="copper-button border-0 font-semibold">
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          ) : (
            <>
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link href={href} key={href}>
                  <Button
                    className={cn(
                      "cursor-pointer gap-2 border border-white/10 bg-white/[0.06] text-[#e8d8cc] hover:bg-white/[0.12]",
                      pathname === href &&
                        "border-[#c9875f]/[0.45] bg-[#c9875f]/[0.18] text-[#fff4e8] shadow-sm shadow-[#c9875f]/15"
                    )}
                    variant="secondary"
                  >
                    <Icon className="size-4" />
                    {label}
                  </Button>
                </Link>
              ))}
              <SignOutButton>
                <Button
                  className="cursor-pointer gap-2 border-white/10 bg-transparent text-[#d8c3b5] hover:border-[#7f3344]/50 hover:bg-[#7f3344]/25 hover:text-[#fff4e8]"
                  variant="outline"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </SignOutButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
