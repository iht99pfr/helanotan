import Link from "next/link";

export default function BackLink({
  href = "/artiklar",
  label = "Alla artiklar",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition"
    >
      &larr; {label}
    </Link>
  );
}
