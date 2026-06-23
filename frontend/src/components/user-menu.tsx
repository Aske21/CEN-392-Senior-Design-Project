"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  selectAuthUser,
  selectIsAuthenticated,
} from "@/lib/features/auth/authSelectors";
import { logout } from "@/lib/features/auth/authSlice";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function getUserColor(user: { username?: string; email?: string } | null) {
  if (!user) return "#6366f1";

  const seed = user.username || user.email || "user";
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 60 + (Math.abs(hash) % 20);
  const lightness = 45 + (Math.abs(hash) % 15);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getTextColor(bgColor: string) {
  const match = bgColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (match) {
    const lightness = parseInt(match[3]);
    return lightness < 50 ? "#ffffff" : "#000000";
  }
  return "#ffffff";
}

interface UserMenuProps {
  showProfileLink?: boolean;
  showName?: boolean;
}

export default function UserMenu({
  showProfileLink = true,
  showName = false,
}: UserMenuProps) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/logout");
  };

  const userColor = getUserColor(user);
  const textColor = getTextColor(userColor);

  if (!isAuthenticated) {
    return (
      <NextLink href="/login" locale={locale}>
        <Button variant="ghost" size="icon">
          <FaUser />
        </Button>
      </NextLink>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {showName && (
        <span className="text-sm font-medium text-foreground truncate">
          {user?.username || t("userFallback")}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-10 w-10 rounded-full p-0 border-0 shrink-0"
            style={{ backgroundColor: userColor, color: textColor }}
          >
            <span className="text-sm font-medium">
              {user?.username?.[0]?.toUpperCase() || "U"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className={cn("w-56", showName && "z-[70]")}
          align="end"
          side={showName ? "top" : "bottom"}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user?.username || t("userFallback")}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {showProfileLink && (
            <DropdownMenuItem asChild>
              <NextLink href="/profile" locale={locale}>
                {t("profile")}
              </NextLink>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleLogout}>
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
