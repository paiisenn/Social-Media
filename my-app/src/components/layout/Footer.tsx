import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/privacy", label: "Quyền riêng tư" },
  { href: "/terms", label: "Điều khoản" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  return (
    <footer className="border-t pt-4 text-xs border-gray-400 mr-4 mt-2">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="
              relative
              transition-colors duration-200
              hover:text-foreground
              hover:underline
              hover:text-orange-600
            "
          >
            <span className="relative z-10">{link.label}</span>
            <span
              className="
                absolute inset-x-0 -bottom-0.5 h-px
                scale-x-0 bg-current
                transition-transform duration-200
                group-hover:scale-x-100
              "
            />
          </Link>
        ))}
      </div>

      <p className="mt-4 text-center text-[11px] opacity-80">
        © {new Date().getFullYear()} Social App Inc.
      </p>
    </footer>
  );
}
