import { getMessages } from "next-intl/server";
import { LegalPage } from "@/components/legal/legal-page";

export default async function ConfidentialitePage() {
  const messages = await getMessages();
  const { title, updated, sections } = (messages as any).legal.conf;

  return <LegalPage title={title} updated={updated} sections={sections} />;
}
