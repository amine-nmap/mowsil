import { getAgencyBookings } from "@/actions/dashboard";
import { requireAgency } from "@/actions/auth";
import AgencyRequestsClient from "@/components/agence/requests-client";

export default async function AgencyRequestsPage() {
  await requireAgency();
  const bookings = await getAgencyBookings();

  return <AgencyRequestsClient bookings={bookings} />;
}
