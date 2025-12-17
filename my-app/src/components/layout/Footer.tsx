import Link from "next/link";

const footerLinks = [
  { href: "/about", label: "Giới thiệu" },
  { href: "/privacy", label: "Quyền riêng tư" },
  { href: "/terms", label: "Điều khoản" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  return (
    <footer className="mt-auto text-xs text-muted-foreground">
      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
        {footerLinks.map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
      </div>
      <p className="mt-4 text-center">© {new Date().getFullYear()} Social App Inc.</p>
    </footer>
  );
}