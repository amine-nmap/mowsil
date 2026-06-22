import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Search, CheckCircle, Smartphone, Shield } from "lucide-react";
import Hero from "@/components/home/hero";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <WhyMowsil />
      <CtaSection />
    </>
  );
}

function HowItWorks() {
  const t = useTranslations("home");

  const steps = [
    { icon: Search, title: t("step1Title"), desc: t("step1Desc") },
    { icon: Smartphone, title: t("step2Title"), desc: t("step2Desc") },
    { icon: CheckCircle, title: t("step3Title"), desc: t("step3Desc") },
  ];

  return (
    <section className="py-20 sm:py-28 bg-mowsil-gray">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-mowsil-navy">
            {t("howItWorks")}
          </h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <Card key={i} hover className="text-center">
              <CardBody className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-mowsil-green/10 flex items-center justify-center">
                  <step.icon size={22} className="text-mowsil-green" />
                </div>
                <div className="text-xs font-bold text-mowsil-legend uppercase tracking-widest">
                  0{i + 1}
                </div>
                <h3 className="font-bold text-mowsil-navy text-lg">{step.title}</h3>
                <p className="text-sm text-mowsil-body leading-relaxed">{step.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyMowsil() {
  const t = useTranslations("home");

  const reasons = [
    { icon: CheckCircle, title: t("whyTransparent"), desc: t("whyTransparentDesc") },
    { icon: Shield, title: t("whyTrusted"), desc: t("whyTrustedDesc") },
    { icon: Smartphone, title: t("whyLocal"), desc: t("whyLocalDesc") },
    { icon: Search, title: t("whySimple"), desc: t("whySimpleDesc") },
  ];

  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-mowsil-navy">
            {t("whyTitle")}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {reasons.map((reason, i) => (
            <Card key={i} hover className="text-center">
              <CardBody className="flex flex-col items-center gap-3 py-6">
                <div className="w-10 h-10 rounded-full bg-mowsil-navy/5 flex items-center justify-center">
                  <reason.icon size={20} className="text-mowsil-navy" />
                </div>
                <h3 className="font-bold text-mowsil-navy text-sm">{reason.title}</h3>
                <p className="text-xs text-mowsil-body leading-relaxed">{reason.desc}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  const t = useTranslations("home");

  return (
    <section className="py-20 sm:py-28 bg-mowsil-navy">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {t("ctaTitle")}
        </h2>
        <p className="text-white/60 max-w-md mx-auto mb-8 text-sm sm:text-base">
          {t("ctaDesc")}
        </p>
        <Button variant="primary" size="lg" className="text-base px-8">
          {t("ctaButton")}
        </Button>
      </div>
    </section>
  );
}
