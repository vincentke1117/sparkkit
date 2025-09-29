'use client';

import { getLegalContent, LegalVariant } from '@/lib/legal';

import { useLanguage } from './LanguageProvider';

export function LegalPage({ variant }: { variant: LegalVariant }) {
  const { locale } = useLanguage();
  const content = getLegalContent(locale, variant);

  return (
    <section className="relative mx-auto w-full max-w-3xl px-6 py-16 text-sm leading-7 text-white/80 md:px-0">
      <div className="space-y-3 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">SparkKit</p>
        <h1 className="text-3xl font-semibold text-white">{content.title}</h1>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">{content.updated}</p>
      </div>
      <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 text-left backdrop-blur">
        <p>{content.intro}</p>
        {content.sections.map((section) => (
          <article key={section.title} className="space-y-3">
            <h2 className="text-lg font-semibold text-white">{section.title}</h2>
            {section.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>
        ))}
      </div>
    </section>
  );
}
