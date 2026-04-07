import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Prose({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("prose-content", className)}
      {...props}
    >
      {children}
    </div>
  );
}
