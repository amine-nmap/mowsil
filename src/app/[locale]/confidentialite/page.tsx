import { getMessages, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Card, CardBody } from "@/components/ui/card";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return { title: `${t("conf.title")} | MOWSIL` };
}

export default async function ConfidentialitePage({ params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages.legal as any;

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-mowsil-navy mb-2">{t.conf.title}</h1>
        <p className="text-sm text-mowsil-legend mb-8">{t.conf.updated}</p>

        <div className="space-y-6">
          {t.conf.sections.map((section: { title: string; body: string }, i: number) => (
            <Card key={i}>
              <CardBody className="p-6">
                <h2 className="font-bold text-mowsil-navy text-lg mb-3">{section.title}</h2>
                <p className="text-sm text-mowsil-body leading-relaxed">{section.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href="mailto:support@mowsil.ma?subject=Droit%20%C3%A0%20l%27oubli"
            className="text-sm font-semibold text-mowsil-green hover:underline"
          >
            {t.footerConf} — support@mowsil.ma
          </a>
        </div>
      </div>
    </div>
  );
}
