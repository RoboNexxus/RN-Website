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

    // Treat /alumni as active on Team item
    const activeIndex = items.findIndex(
        (item) =>
            item.href === pathname ||
            item.dropdown?.some((d) => d.href === pathname)
    ) ?? defaultActiveIndex;

    const spotlightX = useRef(0);
    const ambienceX = useRef(0);

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
        <div className={cn("relative flex justify-center pt-4", className)}>
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
    );
}
