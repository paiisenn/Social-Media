import Link from "next/link";
import { useEffect, useState } from "react";

const footerLinks = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/privacy", label: "Quyền riêng tư" },
  { href: "/terms", label: "Điều khoản" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    // This code runs only on the client, after the component has mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t pt-4 text-xs border-gray-400 mr-4 mt-2">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group relative transition-colors duration-200 hover:text-foreground hover:text-orange-600"
          >
            <span className="relative z-10">{link.label}</span>
            <span
              className="absolute inset-x-0 -bottom-0.5 h-px scale-x-0 bg-current transition-transform duration-200 group-hover:scale-x-100"
            />
          </Link>
        ))}
      </div>

      {currentYear && (
        <p className="mt-4 text-center text-[11px] opacity-80">© {currentYear} Social App Inc.</p>
      )}
    </footer>
  );
}
