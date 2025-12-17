import { cn } from "@/utils/cn"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition",
        className
      )}
      {...props}
    />
  )
}
