import { cn } from "@/utils/cn"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500",
        className
      )}
      {...props}
    />
  )
}
