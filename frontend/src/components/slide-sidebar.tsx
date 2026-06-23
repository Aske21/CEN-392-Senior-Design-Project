"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FiX } from "react-icons/fi";
import { useTranslations } from "next-intl";

export const SIDEBAR_NAV_LIST_CLASS = "space-y-2 text-sm";

export const SIDEBAR_NAV_LINK_CLASS =
  "block rounded-lg px-3 py-2 text-foreground transition hover:bg-accent hover:text-accent-foreground";

export const SIDEBAR_NAV_LINK_ACTIVE_CLASS =
  "bg-accent font-medium text-accent-foreground";

export function sidebarNavLinkClassName(active = false) {
  return active
    ? `${SIDEBAR_NAV_LINK_CLASS} ${SIDEBAR_NAV_LINK_ACTIVE_CLASS}`
    : SIDEBAR_NAV_LINK_CLASS;
}

interface SlideSidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  /** When true, sidebar stays visible on large screens (admin layout). */
  persistent?: boolean;
  side?: "left" | "right";
  /** Element to return focus to when the overlay sidebar closes. */
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}

function getSidebarClasses(
  open: boolean,
  persistent: boolean,
  side: "left" | "right"
) {
  const isRight = side === "right";

  if (persistent) {
    return open
      ? "translate-x-0 lg:relative lg:w-72 lg:transform-none"
      : "-translate-x-full lg:relative lg:w-72 lg:translate-x-0";
  }

  const hidden = "md:hidden";
  if (isRight) {
    return `${hidden} ${open ? "translate-x-0" : "translate-x-full"}`;
  }
  return `${hidden} ${open ? "translate-x-0" : "-translate-x-full"}`;
}

function getOverlayMediaQuery(persistent: boolean) {
  return persistent ? "(max-width: 1023px)" : "(max-width: 767px)";
}

function lockBodyScroll() {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollY}px`;
  document.body.style.width = "100%";
  document.body.style.overflow = "hidden";
  return scrollY;
}

function unlockBodyScroll(scrollY: number) {
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  document.body.style.overflow = "";
  window.scrollTo(0, scrollY);
}

export default function SlideSidebar({
  open,
  onClose,
  children,
  footer,
  header,
  persistent = false,
  side = "left",
  returnFocusRef,
}: SlideSidebarProps) {
  const t = useTranslations("Common");
  const overlayBreakpoint = persistent ? "lg:hidden" : "md:hidden";
  const isRight = side === "right";
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const savedScrollY = useRef(0);
  const isScrollLocked = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const positionClasses = isRight
    ? "right-0 left-auto border-l border-border"
    : "left-0 border-r border-border";

  useEffect(() => {
    if (!open) {
      return;
    }

    const mediaQuery = window.matchMedia(getOverlayMediaQuery(persistent));

    const releaseScrollLock = () => {
      if (!isScrollLocked.current) {
        return;
      }
      unlockBodyScroll(savedScrollY.current);
      isScrollLocked.current = false;
    };

    const applyScrollLock = () => {
      if (isScrollLocked.current) {
        closeButtonRef.current?.focus({ preventScroll: true });
        return;
      }
      savedScrollY.current = lockBodyScroll();
      isScrollLocked.current = true;
      closeButtonRef.current?.focus({ preventScroll: true });
    };

    if (mediaQuery.matches) {
      applyScrollLock();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
      }
    };

    const handleMediaChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        applyScrollLock();
      } else {
        releaseScrollLock();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      mediaQuery.removeEventListener("change", handleMediaChange);
      if (mediaQuery.matches) {
        releaseScrollLock();
        returnFocusRef?.current?.focus({ preventScroll: true });
      }
    };
  }, [open, returnFocusRef, persistent]);

  return (
    <>
      {open && (
        <div
          className={`fixed inset-0 z-50 bg-black/50 touch-none ${overlayBreakpoint}`}
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-nav"
        role={open ? "dialog" : undefined}
        aria-modal={open ? true : undefined}
        aria-hidden={!open && !persistent ? true : undefined}
        className={`fixed inset-y-0 z-[60] flex h-dvh max-h-dvh w-[min(18rem,85vw)] flex-col overflow-hidden overscroll-none bg-background p-6 shadow-sm transition-transform duration-300 ease-in-out ${positionClasses} ${getSidebarClasses(open, persistent, side)} ${!open ? (persistent ? "pointer-events-none lg:pointer-events-auto" : "pointer-events-none") : ""}`}
      >
        <div
          className={`mb-4 flex shrink-0 items-center gap-2 ${persistent ? "lg:hidden" : ""} ${header ? "justify-between" : "justify-end"}`}
        >
          {header}
          <Button
            ref={closeButtonRef}
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0"
            aria-label={t("closeMenu")}
          >
            <FiX className="h-5 w-5" />
          </Button>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </nav>

        {footer && (
          <div className="mt-6 shrink-0 border-t border-border pt-4">{footer}</div>
        )}
      </aside>
    </>
  );
}
