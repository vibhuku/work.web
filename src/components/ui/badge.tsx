import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#159028] text-white shadow hover:bg-[#159028]/90",
        secondary:
          "border-transparent bg-stone-100 text-stone-900 hover:bg-stone-200",
        destructive:
          "border-transparent bg-red-500 text-white shadow hover:bg-red-600",
        outline: "text-stone-950 border border-stone-200",
        bronze: "border-amber-300 bg-amber-50 text-amber-800",
        silver: "border-slate-300 bg-slate-100 text-slate-700",
        gold: "border-yellow-300 bg-yellow-50 text-yellow-800",
        platinum: "border-purple-300 bg-purple-50 text-purple-800",
        green: "border-emerald-200 bg-emerald-50 text-emerald-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
