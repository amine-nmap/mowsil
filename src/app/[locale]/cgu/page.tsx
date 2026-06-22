import { getMessages } from "next-intl/server";
import { Card, CardBody } from "@/components/ui/card";

type Props = { params: Promise<{ locale: string }> };

export default async function CguPage({ params }: Props) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages.legal as any;

  return (
    <div className="min-h-screen bg-mowsil-gray">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-mowsil-navy mb-2">{t.cgu.title}</h1>
        <p className="text-sm text-mowsil-legend mb-8">{t.cgu.updated}</p>

        <div className="space-y-6">
          {t.cgu.sections.map((section: { title: string; body: string }, i: number) => (
            <Card key={i}>
              <CardBody className="p-6">
                <h2 className="font-bold text-mowsil-navy text-lg mb-3">{section.title}</h2>
                <p className="text-sm text-mowsil-body leading-relaxed">{section.body}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
