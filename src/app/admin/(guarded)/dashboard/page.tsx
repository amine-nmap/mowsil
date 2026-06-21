import { Shield, CheckCircle, Users, Car, Calendar } from "lucide-react";
import { requireAdmin } from "@/actions/admin-auth";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  return (
    <div className="min-h-screen bg-mowsil-gray p-6 font-sans">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-mowsil-navy">
              Tableau de bord
            </h1>
            <p className="text-sm text-mowsil-legend mt-1">
              Connecté en tant que {session.name ?? session.user.email}
            </p>
          </div>
          <form action="/api/admin-logout" method="post">
            <Button variant="secondary" size="sm">
              Déconnexion
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: "Agences", value: "—" },
            { icon: Car, label: "Véhicules", value: "—" },
            { icon: Calendar, label: "Réservations", value: "—" },
            { icon: Shield, label: "En attente", value: "—" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardBody className="p-4 text-center">
                <stat.icon size={20} className="mx-auto text-mowsil-green mb-2" />
                <p className="text-2xl font-bold text-mowsil-navy">{stat.value}</p>
                <p className="text-xs text-mowsil-legend">{stat.label}</p>
              </CardBody>
            </Card>
          ))}
        </div>

        <Card>
          <CardBody className="p-6">
            <h2 className="text-lg font-bold text-mowsil-navy mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-mowsil-green" />
              Prochaines étapes
            </h2>
            <ul className="space-y-3 text-sm text-mowsil-body">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-mowsil-green/10 text-mowsil-green text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                Valider les agences en statut <strong>pending</strong> depuis Supabase Dashboard
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-mowsil-green/10 text-mowsil-green text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                Configurer le cron d&apos;expiration des réservations (2h)
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-mowsil-green/10 text-mowsil-green text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                Brancher les emails transactionnels (Resend / SendGrid)
              </li>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
