type Section = { title: string; body: string };

type Props = {
  title: string;
  updated: string;
  sections: Section[];
};

export function LegalPage({ title, updated, sections }: Props) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-12 font-sans">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-[#0A2540] leading-tight">{title}</h1>
        <p className="text-sm text-[#4A5568]/60 mt-2">{updated}</p>
      </header>

      <div className="space-y-10">
        {sections.map((section, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-[#0A2540] mb-3">{section.title}</h2>
            <p className="text-[15px] leading-relaxed text-[#4A5568]">{section.body}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
