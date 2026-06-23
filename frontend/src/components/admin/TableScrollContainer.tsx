"use client";

import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function TableScrollContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations("Admin.common");

  return (
    <div className={cn("grid min-w-0 grid-cols-1", className)}>
      <div className="-mx-6 overflow-hidden rounded-none border-y md:mx-0 md:rounded-md md:border">
        {children}
      </div>
      <p className="mt-2 text-xs text-muted-foreground md:hidden">
        {t("scrollHint")}
      </p>
    </div>
  );
}
