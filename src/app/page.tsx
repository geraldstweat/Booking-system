"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

/** Simple theme toggle */
function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className="rounded-xl border px-3 py-2 text-sm transition hover:bg-neutral-100 dark:hover:bg-neutral-800"
      aria-label="Toggle theme"
    >
      {dark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

// -------------------- MAIN PAGE --------------------
export default function Home() {

  return (
    <main className="min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-3">
            <Image
              src="/next.svg"
              alt="logo"
              width={28}
              height={28}
              className="dark:invert"
            />
            <span className="font-semibold">Fantastic One</span>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
            <a href="#features" className="text-sm hover:opacity-80">Features</a>
            <a href="#gallery" className="text-sm hover:opacity-80">Gallery</a>
            <a href="#cta" className="text-sm hover:opacity-80">Get Started</a>

            {/* Login/Register links */}
            <Link href="/login" className="text-sm rounded-lg border px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Login
            </Link>
            <Link href="/register" className="text-sm rounded-lg border px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
              Register
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight"
          >
            Build something{" "}
            <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
              fantastic
            </span>{" "}
            with Next.js
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-300"
          >
            A single-page experience with animations, dark mode, optimized
            images, and blazing performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 flex gap-3"
          >
            <Link
              href="/register"
              className="rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-5 py-3 font-medium hover:opacity-90"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className="rounded-xl border px-5 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Login
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURES, GALLERY, TESTIMONIALS ... keep your existing code here */}

      {/* CTA */}
      <section id="cta" className="mx-auto max-w-6xl px-4 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 text-center bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950"
        >
          <h3 className="text-2xl md:text-3xl font-extrabold">
            Ready to join us?
          </h3>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Login if you already have an account, or register to get started.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              className="rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 px-6 py-3 font-medium hover:opacity-90"
              href="/register"
            >
              Register
            </Link>
            <Link
              className="rounded-xl border px-6 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
              href="/login"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm">
          <span>© {new Date().getFullYear()} Fantastic One</span>
          <a className="hover:underline" href="https://nextjs.org">
            Built with Next.js
          </a>
        </div>
      </footer>
    </main>
  );
}