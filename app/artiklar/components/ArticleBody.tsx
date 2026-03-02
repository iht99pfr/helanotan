export default function ArticleBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        max-w-prose mx-auto
        text-[var(--foreground)] text-base sm:text-lg leading-relaxed
        [&>h2]:text-[var(--foreground)] [&>h2]:text-xl [&>h2]:sm:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-4
        [&>h3]:text-[var(--foreground)] [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-3
        [&>p]:mb-5 [&>p]:text-[var(--muted)]
        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-5 [&>ul]:space-y-1 [&>ul]:text-[var(--muted)]
        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-5 [&>ol]:space-y-1 [&>ol]:text-[var(--muted)]
        [&>blockquote]:border-l-4 [&>blockquote]:border-[var(--border)] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:my-6 [&>blockquote]:text-[var(--muted)]
      "
    >
      {children}
    </div>
  );
}
