"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { FaGithub, FaLinkedin, FaGlobe } from "react-icons/fa";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

export interface ModalMember {
  name: string;
  role: string;
  image: string;
  class?: number;
  batch?: string;
  contribution?: string;
  links: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
}

interface MemberModalProps {
  member: ModalMember;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Animate in
  useEffect(() => {
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [0, 1],
        duration: 220,
        ease: "outCubic",
      });
    }
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [0, 1],
        translateY: ["24px", "0px"],
        scale: [0.94, 1],
        duration: 320,
        ease: "outExpo",
      });
    }
  }, []);

  const handleClose = () => {
    // Animate out then call onClose
    const done = () => onClose();
    if (cardRef.current) {
      animate(cardRef.current, {
        opacity: [1, 0],
        translateY: ["0px", "16px"],
        scale: [1, 0.95],
        duration: 220,
        ease: "inCubic",
        onComplete: done,
      });
    } else {
      done();
    }
    if (backdropRef.current) {
      animate(backdropRef.current, {
        opacity: [1, 0],
        duration: 220,
        ease: "inCubic",
      });
    }
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      ref={backdropRef}
      style={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        ref={cardRef}
        style={{ opacity: 0 }}
        className={cn(
          "relative w-full max-w-sm rounded-2xl glass-border spotlight-nav-shadow",
          "bg-neutral-950 p-8 flex flex-col items-center gap-5 text-center"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-neutral-500 hover:text-white transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Avatar */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-2 ring-white/15">
          <Image src={member.image} alt={member.name} fill className="object-cover" sizes="112px" />
        </div>

        {/* Info */}
        <div>
          <p className="font-bold text-lg">{member.name}</p>
          <p className="text-sm text-neutral-400 mt-1">{member.role}</p>
          {member.class && (
            <p className="text-xs text-neutral-500 mt-0.5">Class {member.class}</p>
          )}
          {member.batch && (
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-400">
              Batch {member.batch}
            </span>
          )}
        </div>

        {member.contribution && (
          <p className="text-sm text-neutral-400 leading-relaxed">{member.contribution}</p>
        )}

        {/* Links */}
        <div className="flex gap-5">
          {member.links.github && (
            <a href={member.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="text-neutral-400 hover:text-white transition-colors">
              <FaGithub size={20} />
            </a>
          )}
          {member.links.linkedin && (
            <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-neutral-400 hover:text-white transition-colors">
              <FaLinkedin size={20} />
            </a>
          )}
          {member.links.website && (
            <a href={member.links.website} target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-neutral-400 hover:text-white transition-colors">
              <FaGlobe size={20} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
