"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import AnimePageHero from "@/components/ui/anime-page-hero";
import SocialFlipButton from "@/components/ui/social-flip-button";
import AnimatedButton from "@/components/ui/animated-button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { usePageEnter } from "@/lib/use-page-enter";

// ── Input / Textarea field ────────────────────────────────────────────────────
function Field({
  label,
  id,
  textarea,
  ...props
}: {
  label: string;
  id: string;
  textarea?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const base = cn(
    "w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3",
    "text-base text-white placeholder:text-white/40 font-sans font-semibold",
    "focus:outline-none focus:border-white/40 focus:bg-black/70",
    "transition-colors duration-150"
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium text-white uppercase tracking-wider">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={5}
          className={cn(base, "resize-none")}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={base}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
    </div>
  );
}

// ── Contact form ──────────────────────────────────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  useEffect(() => {
    if (!formRef.current) return;
    const els = formRef.current.querySelectorAll(".form-item");
    animate(els, {
      opacity: [0, 1],
      translateY: ["16px", "0px"],
      duration: 500,
      ease: "outExpo",
      delay: stagger(70, { start: 300 }),
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Message sent!", "We'll get back to you as soon as possible.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Failed to send", "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Network error", "Could not reach the server. Check your connection.");
    } finally {
      setSending(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="form-item grid grid-cols-1 sm:grid-cols-2 gap-5" style={{ opacity: 0 }}>
        <Field
          label="Name"
          id="name"
          name="name"
          type="text"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Field
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-item" style={{ opacity: 0 }}>
        <Field
          label="Subject"
          id="subject"
          name="subject"
          type="text"
          placeholder="What's this about?"
          value={form.subject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-item" style={{ opacity: 0 }}>
        <Field
          label="Message"
          id="message"
          name="message"
          textarea
          placeholder="Write your message here..."
          value={form.message}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-item flex items-center gap-4" style={{ opacity: 0 }}>
        <AnimatedButton
          type="submit"
          disabled={sending}
          className="min-w-[140px]"
        >
          {sending ? "Sending…" : "Send Message"}
        </AnimatedButton>
      </div>
    </form>
  );
}

// ── Info panel (right column) ─────────────────────────────────────────────────
function InfoPanel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll(".info-item");
    animate(els, {
      opacity: [0, 1],
      translateY: ["16px", "0px"],
      duration: 500,
      ease: "outExpo",
      delay: stagger(80, { start: 450 }),
    });
  }, []);

  return (
    <div ref={ref} className="flex flex-col gap-8">

      {/* Teacher in-charge */}
      <div className="info-item" style={{ opacity: 0 }}>
        <p className="text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
          Teacher In-Charge
        </p>
        <div className="rounded-xl glass-border bg-black/60 px-5 py-4">
          <p className="font-semibold text-white font-sans">Suvarna Aggarwal</p>
          <p className="text-xs text-neutral-300 mt-0.5 font-sans font-normal">Faculty Mentor, Robo Nexus</p>
        </div>
      </div>

      {/* Location map */}
      <div className="info-item" style={{ opacity: 0 }}>
        <p className="text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
          Location
        </p>
        <div className="rounded-xl overflow-hidden glass-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14326.41917660668!2d77.063067!3d28.434014!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1885ce7afcbf%3A0xc7f058e7154cd585!2sAMITY%20INTERNATIONAL%20SCHOOL-SECTOR%2046%2C%20Sector%2046%2C%20Gurugram%2C%20Haryana%20122003%2C%20India!5e1!3m2!1sen!2sus!4v1781498688298!5m2!1sen!2sus"
            width="100%"
            height="220"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Amity International School Sector 46 Gurugram"
          />
        </div>
        <p className="text-xs text-neutral-300 mt-2 font-sans font-normal">
          Amity International School, Sector 46, Gurugram, Haryana 122003
        </p>
      </div>

      {/* Socials */}
      <div className="info-item" style={{ opacity: 0 }}>
        <p className="text-xs font-medium text-neutral-300 uppercase tracking-wider mb-2">
          Find us online
        </p>
        <SocialFlipButton />
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Contact() {
  const { containerRef } = usePageEnter();

  return (
    <main ref={containerRef as React.RefObject<HTMLElement>} className="flex flex-col items-center flex-1 px-4 py-20 gap-14 relative">
      <div data-enter="page-title">
        <AnimePageHero title="Contact" />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
        {/* Left — form enters from left */}
        <section data-enter="content-l">
          <h2 className="text-base font-semibold text-white mb-6">Send a message</h2>
          <ContactForm />
        </section>

        {/* Right — info panel enters from right */}
        <section data-enter="content-r">
          <h2 className="text-base font-semibold text-white mb-6">About us</h2>
          <InfoPanel />
        </section>
      </div>
    </main>
  );
}
