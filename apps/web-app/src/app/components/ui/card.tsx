import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

// ─── Variant definition ────────────────────────────────────────────────────────

const cardVariants = cva("bg-card border border-border rounded-2xl", {
  variants: {
    /**
     * default    — no shadow, faint border. The standard in-app card style.
     * elevated   — adds a subtle shadow for visual lift.
     * interactive — hover lift + accent border tint; use for clickable cards.
     * accent     — accent-tinted background; for callout or highlighted cards.
     * ghost      — dashed border on muted bg; for empty-state placeholders.
     */
    variant: {
      default: "",
      elevated: "shadow-sm",
      interactive:
        "transition-all cursor-pointer hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-sm",
      accent: "bg-accent/5 border-accent/20",
      ghost:
        "bg-muted/10 border-2 border-dashed border-muted-foreground/20 rounded-3xl",
    },
    /**
     * Padding shorthand. Use "none" for cards that contain full-bleed
     * content (tables, images, overflow-hidden panels).
     */
    padding: {
      none: "",
      sm: "p-4",
      default: "p-6",
      lg: "p-8",
      xl: "p-10 md:p-12",
    },
    /** Radius override for pages that need a tighter or looser rounding. */
    radius: {
      sm: "rounded-xl",
      default: "rounded-2xl",
      lg: "rounded-3xl",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "default",
    radius: "default",
  },
});

// ─── Card ──────────────────────────────────────────────────────────────────────

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({
  variant,
  padding,
  radius,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        cardVariants({ variant, padding, radius }),
        className,
        "p-6",
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── Sub-components (structural card decomposition) ───────────────────────────

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-between mb-6", className)}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "text-lg font-bold text-foreground tracking-tight",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between mt-6 pt-4 border-t border-border",
        className,
      )}
      {...props}
    />
  );
}
