import { cn } from "@/lib/utils";
import { Info, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<
  CalloutType,
  { icon: typeof Info; borderColor: string; bgColor: string; labelColor: string; label: string }
> = {
  info: {
    icon: Info,
    borderColor: "border-l-[var(--color-info)]",
    bgColor: "bg-cyan-950/20",
    labelColor: "text-[var(--color-info)]",
    label: "NOTE",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-l-[var(--color-warning)]",
    bgColor: "bg-amber-950/20",
    labelColor: "text-[var(--color-warning)]",
    label: "WARNING",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-l-[var(--color-danger)]",
    bgColor: "bg-red-950/20",
    labelColor: "text-[var(--color-danger)]",
    label: "DANGER",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-l-[var(--color-accent)]",
    bgColor: "bg-green-950/20",
    labelColor: "text-[var(--color-accent)]",
    label: "TIP",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, borderColor, bgColor, labelColor, label } = config[type];

  return (
    <div
      className={cn(
        "my-6 border-l-[3px] py-3 pl-4 pr-4",
        borderColor,
        bgColor
      )}
    >
      <div className={cn("mb-1 flex items-center gap-2 font-mono text-xs font-semibold", labelColor)}>
        <Icon size={12} />
        <span>{title ?? label}</span>
      </div>
      <div className="text-sm text-[var(--color-text-muted)] [&>p]:m-0">{children}</div>
    </div>
  );
}
