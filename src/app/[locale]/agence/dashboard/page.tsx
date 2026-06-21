import { getDashboardData } from "@/actions/dashboard";
import { requireAgency } from "@/actions/auth";
import AgencyDashboardClient from "@/components/agence/dashboard-client";

export default async function AgencyDashboardPage() {
  const session = await requireAgency();
  const data = await getDashboardData();

  return <AgencyDashboardClient data={data} agency={session.agency} />;
}
