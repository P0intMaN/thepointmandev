import { cn } from "@/lib/utils";
import { Info, AlertTriangle, AlertCircle, Lightbulb } from "lucide-react";
import type { ReactNode } from "react";

type CalloutType = "info" | "warning" | "danger" | "tip";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: ReactNode;
}

const config: Record<CalloutType, { icon: typeof Info; borderColor: string; labelColor: string; shadow: string; label: string }> = {
  info: {
    icon: Info,
    borderColor: "border-[var(--color-info)]",
    labelColor: "text-[var(--color-info)]",
    shadow: "4px 4px 0 0 #004466",
    label: "NOTE",
  },
  warning: {
    icon: AlertTriangle,
    borderColor: "border-[var(--color-warning)]",
    labelColor: "text-[var(--color-warning)]",
    shadow: "4px 4px 0 0 #553d00",
    label: "WARNING",
  },
  danger: {
    icon: AlertCircle,
    borderColor: "border-[var(--color-danger)]",
    labelColor: "text-[var(--color-danger)]",
    shadow: "4px 4px 0 0 #550000",
    label: "DANGER",
  },
  tip: {
    icon: Lightbulb,
    borderColor: "border-[var(--color-tip)]",
    labelColor: "text-[var(--color-tip)]",
    shadow: "4px 4px 0 0 #330066",
    label: "TIP",
  },
};

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, borderColor, labelColor, shadow, label } = config[type];

  return (
    <div
      className={cn("my-6 border-2 bg-[var(--color-bg-elevated)] p-4", borderColor)}
      style={{ boxShadow: shadow }}
    >
      <div className={cn("mb-2 flex items-center gap-2 font-pixel text-[8px]", labelColor)}>
        <Icon size={11} />
        <span>{title ?? label}</span>
      </div>
      <div className="font-mono text-sm text-[var(--color-text-muted)] [&>p]:m-0">{children}</div>
    </div>
  );
}
