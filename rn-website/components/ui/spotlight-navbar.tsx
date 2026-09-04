"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { animate } from "framer-motion";
import { animate as animeAnimate } from "animejs";
import { cn } from "@/lib/utils";
import { ANIMATION_CONFIG, getAnimationConfig } from "@/lib/animation-config";

export interface NavItem {
    label: string;
    href: string;
    dropdown?: { label: string; href: string }[];
}

export interface SpotlightNavbarProps {
    items?: NavItem[];
    className?: string;
    onItemClick?: (item: NavItem, index: number) => void;
    defaultActiveIndex?: number;
}

const defaultNavItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    {
        label: "Team", href: "/team",
        dropdown: [
            { label: "Alumni", href: "/alumni" },
        ],
    },
    { label: "Projects", href: "/projects" },
    { label: "Events", href: "/events" },
    { label: "Contact", href: "/contact" },
];

/** Small animated dropdown panel */
function DropdownMenu({
    items,
    pathname,
    onNavigate,
    onMouseEnter,
    onMouseLeave,
}: {
    items: { label: string; href: string }[];
    pathname: string;
    onNavigate: (href: string) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        const config = getAnimationConfig({ respectMotionPreference: true });
        animeAnimate(ref.current, {
            opacity: [0, 1],
            translateY: ["-6px", "0px"],
            scale: [0.92, 1],
            duration: config.duration.fast,
            ease: ANIMATION_CONFIG.easing.default,
        });
    }, []);

    return (
        <div
            className="absolute top-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-50"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                ref={ref}
                style={{ opacity: 0, transformOrigin: "top center" }}
                className="spotlight-nav-bg glass-border spotlight-nav-shadow rounded-lg overflow-hidden py-0.5 min-w-[90px]"
            >
                {items.map((child) => (
                    <a
                        key={child.href}
                        href={child.href}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavigate(child.href);
                        }}
                        className={cn(
                            "block px-3 py-1.5 text-xs font-medium text-center transition-colors duration-150",
                            pathname === child.href
                                ? "text-white"
                                : "text-neutral-400 hover:text-white"
                        )}
                    >
                        {child.label}
                    </a>
                ))}
            </div>
        </div>
    );
}

/** Mobile menu overlay */
function MobileMenu({
    items,
    pathname,
    onNavigate,
    onClose,
}: {
    items: NavItem[];
    pathname: string;
    onNavigate: (href: string) => void;
    onClose: () => void;
}) {
    const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

    // Close on backdrop click
    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            {/* Drawer */}
            <div
                className="fixed top-0 right-0 z-[70] h-full w-[75vw] max-w-xs flex flex-col"
                style={{
                    background: "rgb(8, 8, 8)",
                    borderLeft: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/10">
                    <span
                        className="text-white text-base font-semibold tracking-wide"
                        style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                    >
                        Menu
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto py-3">
                    {items.map((item, idx) => {
                        const isActive =
                            pathname === item.href ||
                            item.dropdown?.some((d) => d.href === pathname);
                        const hasDropdown = !!item.dropdown?.length;
                        const isExpanded = expandedIdx === idx;

                        return (
                            <div key={idx}>
                                <div
                                    className={cn(
                                        "flex items-center mx-3 rounded-xl overflow-hidden transition-colors duration-150",
                                        isActive
                                            ? "bg-white/10 text-white"
                                            : "text-neutral-400"
                                    )}
                                    style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                                >
                                    {/* Label — always navigates to the page */}
                                    <button
                                        className={cn(
                                            "flex-1 text-left px-4 py-3 text-sm font-medium hover:text-white transition-colors duration-150",
                                        )}
                                        onClick={() => onNavigate(item.href)}
                                    >
                                        {item.label}
                                    </button>

                                    {/* Chevron — only toggles dropdown, separate tap target */}
                                    {hasDropdown && (
                                        <button
                                            aria-label={`Expand ${item.label} submenu`}
                                            className="px-3 py-3 hover:text-white transition-colors duration-150 border-l border-white/10"
                                            onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                                        >
                                            <svg
                                                width="14"
                                                height="14"
                                                viewBox="0 0 14 14"
                                                fill="none"
                                                className={cn("transition-transform duration-200", isExpanded ? "rotate-180" : "")}
                                            >
                                                <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Dropdown children */}
                                {hasDropdown && isExpanded && (
                                    <div className="mx-3 mb-1 ml-8 space-y-0.5">
                                        {item.dropdown!.map((child) => (
                                            <div
                                                key={child.href}
                                                className={cn(
                                                    "px-4 py-2.5 rounded-lg cursor-pointer text-sm transition-colors duration-150",
                                                    pathname === child.href
                                                        ? "text-white bg-white/10"
                                                        : "text-neutral-400 hover:text-white hover:bg-white/5"
                                                )}
                                                style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
                                                onClick={() => onNavigate(child.href)}
                                            >
                                                {child.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </>
    );
}

export function SpotlightNavbar({
    items = defaultNavItems,
    className,
    onItemClick,
    defaultActiveIndex = 0,
}: SpotlightNavbarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const navRef = useRef<HTMLDivElement>(null);
    const [hoverX, setHoverX] = useState<number | null>(null);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Treat /alumni as active on Team item
    const activeIndex = items.findIndex(
        (item) =>
            item.href === pathname ||
            item.dropdown?.some((d) => d.href === pathname)
    ) ?? defaultActiveIndex;

    const spotlightX = useRef(0);
    const ambienceX = useRef(0);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = nav.getBoundingClientRect();
            const x = e.clientX - rect.left;
            setHoverX(x);
            spotlightX.current = x;
            nav.style.setProperty("--spotlight-x", `${x}px`);
        };

        const handleMouseLeave = () => {
            setHoverX(null);
            const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
            if (activeItem) {
                const navRect = nav.getBoundingClientRect();
                const itemRect = activeItem.getBoundingClientRect();
                const targetX = itemRect.left - navRect.left + itemRect.width / 2;

                animate(spotlightX.current, targetX, {
                    type: "spring",
                    ...ANIMATION_CONFIG.spring.smooth,
                    onUpdate: (v) => {
                        spotlightX.current = v;
                        nav.style.setProperty("--spotlight-x", `${v}px`);
                    },
                });
            }
        };

        nav.addEventListener("mousemove", handleMouseMove);
        nav.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            nav.removeEventListener("mousemove", handleMouseMove);
            nav.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, [activeIndex]);

    useEffect(() => {
        if (!navRef.current) return;
        const nav = navRef.current;
        const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

        if (activeItem) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const targetX = itemRect.left - navRect.left + itemRect.width / 2;

            if (ambienceX.current === 0) {
                ambienceX.current = targetX;
                nav.style.setProperty("--ambience-x", `${targetX}px`);
                return;
            }

            animate(ambienceX.current, targetX, {
                type: "spring",
                ...ANIMATION_CONFIG.spring.smooth,
                onUpdate: (v) => {
                    ambienceX.current = v;
                    nav.style.setProperty("--ambience-x", `${v}px`);
                },
            });
        }
    }, [activeIndex]);

    const handleItemClick = (item: NavItem, index: number) => {
        onItemClick?.(item, index);
        router.push(item.href);
    };

    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setOpenDropdown(null), 120);
    };

    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };

    return (
        <>
            {/* ── Desktop Navbar ── */}
            <div data-enter="nav" className={cn("relative hidden md:flex justify-center pt-4", className)}>
                <nav
                    ref={navRef}
                    className={cn(
                        "spotlight-nav spotlight-nav-bg glass-border spotlight-nav-shadow",
                        "relative h-11 rounded-full transition-all duration-300 overflow-visible"
                    )}
                >
                    {/* Content */}
                    <ul className="relative flex items-center h-full px-2 gap-0 z-[10]">
                        {items.map((item, idx) => (
                            <li
                                key={idx}
                                className="relative h-full flex items-center justify-center"
                                onMouseEnter={() => {
                                    cancelClose();
                                    if (item.dropdown) setOpenDropdown(idx);
                                }}
                                onMouseLeave={() => {
                                    if (item.dropdown) scheduleClose();
                                }}
                            >
                                <a
                                    href={item.href}
                                    data-index={idx}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleItemClick(item, idx);
                                    }}
                                    className={cn(
                                        "px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full",
                                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 dark:focus-visible:ring-white/30",
                                        activeIndex === idx
                                            ? "text-black dark:text-white"
                                            : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                                    )}
                                >
                                    {item.label}
                                </a>

                                {/* Dropdown */}
                                {item.dropdown && openDropdown === idx && (
                                    <DropdownMenu
                                        items={item.dropdown}
                                        pathname={pathname}
                                        onNavigate={(href) => {
                                            setOpenDropdown(null);
                                            router.push(href);
                                        }}
                                        onMouseEnter={cancelClose}
                                        onMouseLeave={scheduleClose}
                                    />
                                )}
                            </li>
                        ))}
                    </ul>

                    {/* 1. Moving Spotlight */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
                        style={{
                            opacity: hoverX !== null ? 1 : 0,
                            background: `radial-gradient(120px circle at var(--spotlight-x) 100%, var(--spotlight-color, rgba(0,0,0,0.1)) 0%, transparent 50%)`,
                        }}
                    />

                    {/* 2. Active Ambience */}
                    <div
                        className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] z-[2]"
                        style={{
                            background: `radial-gradient(60px circle at var(--ambience-x) 0%, var(--ambience-color, rgba(0,0,0,1)) 0%, transparent 100%)`,
                        }}
                    />
                </nav>

                <style jsx>{`
        nav {
          --spotlight-color: rgba(0,0,0,0.08);
          --ambience-color: rgba(0,0,0,0.8);
        }
        :global(.dark) nav {
          --spotlight-color: rgba(255,255,255,0.15);
          --ambience-color: rgba(255,255,255,1);
        }
      `}</style>
            </div>

            {/* ── Mobile Topbar ── */}
            <div
                data-enter="nav"
                className={cn(
                    "md:hidden fixed top-0 left-0 right-0 z-50",
                    "flex items-center justify-between px-4 h-14",
                    "spotlight-nav-bg glass-border spotlight-nav-shadow",
                    className
                )}
                style={{ borderLeft: "none", borderRight: "none", borderTop: "none", borderRadius: 0 }}
            >
                {/* Logo / brand */}
                <a
                    href="/"
                    onClick={(e) => { e.preventDefault(); router.push("/"); }}
                    className="text-white font-bold text-base tracking-widest uppercase"
                    style={{ fontFamily: "var(--font-geist-sans), sans-serif", letterSpacing: "0.15em" }}
                >
                    Robo Nexus
                </a>

                {/* Hamburger button */}
                <button
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    aria-label="Open navigation menu"
                    aria-expanded={mobileMenuOpen}
                    className="w-10 h-10 flex items-center justify-center rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                        <path
                            d="M3 6H19M3 11H19M3 16H19"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            </div>

            {/* Mobile page offset so content isn't hidden under the topbar */}
            <div className="md:hidden h-14" aria-hidden="true" />

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <MobileMenu
                    items={items}
                    pathname={pathname}
                    onNavigate={(href) => {
                        setMobileMenuOpen(false);
                        router.push(href);
                    }}
                    onClose={() => setMobileMenuOpen(false)}
                />
            )}
        </>
    );
}
