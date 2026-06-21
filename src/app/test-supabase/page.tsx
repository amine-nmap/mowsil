import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CheckCircle, XCircle, Database, AlertTriangle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function TestSupabasePage() {
  const supabase = await createServerSupabaseClient();

  const results: { label: string; ok: boolean; detail: string }[] = [];

  // 1. Test connexion de base
  const { data: healthCheck, error: healthError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  if (healthError) {
    results.push({
      label: "Connexion à la base",
      ok: false,
      detail: healthError.message,
    });
  } else {
    results.push({
      label: "Connexion à la base",
      ok: true,
      detail: `Table "profiles" accessible — ${healthCheck ?? 0} enregistrements`,
    });
  }

  // 2. Lister les tables système
  const { data: tables, error: tablesError } = await supabase
    .rpc("get_tables_info" as any)
    .maybeSingle();

  if (tablesError) {
    // Fallback : tenter SELECT sur chaque table connue
    for (const table of ["profiles", "agencies", "vehicles", "bookings"] as const) {
      const { error } = await supabase
        .from(table)
        .select("id", { count: "exact", head: true });
      results.push({
        label: `Table "${table}"`,
        ok: !error,
        detail: error
          ? error.message
          : "✔ Présente et accessible",
      });
    }
  }

  // 3. Test Auth
  const { data: authUser, error: authError } = await supabase.auth.getUser();
  results.push({
    label: "Supabase Auth",
    ok: !authError,
    detail: authError
      ? authError.message
      : authUser.user
        ? `Utilisateur connecté : ${authUser.user.email}`
        : "Aucun utilisateur connecté (anonyme)",
  });

  // 4. Test Storage bucket
  const { data: buckets, error: bucketsError } = await supabase
    .storage
    .listBuckets();

  if (bucketsError) {
    results.push({
      label: "Storage buckets",
      ok: false,
      detail: bucketsError.message,
    });
  } else {
    const hasFacades = buckets.some((b) => b.id === "agencies-facades");
    results.push({
      label: "Storage buckets",
      ok: true,
      detail: `${buckets.length} bucket(s) trouvé(s)${
        hasFacades ? ' — dont "agencies-facades" ✔' : ""
      }`,
    });
  }

  const allOk = results.every((r) => r.ok);

  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-mowsil-navy">
            Diagnostic Supabase
          </h1>
          <p
            className={`text-sm mt-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold ${
              allOk
                ? "bg-mowsil-green/10 text-mowsil-green"
                : "bg-red-50 text-red-600"
            }`}
          >
            {allOk ? (
              <>
                <CheckCircle size={16} />
                Connexion Supabase OK
              </>
            ) : (
              <>
                <XCircle size={16} />
                Problèmes détectés
              </>
            )}
          </p>
        </div>

        <div className="space-y-3">
          {results.map((r) => (
            <div
              key={r.label}
              className={`rounded-xl border p-4 flex items-start gap-3 ${
                r.ok
                  ? "bg-white border-mowsil-card-border"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {r.ok ? (
                <CheckCircle
                  size={20}
                  className="shrink-0 mt-0.5 text-mowsil-green"
                />
              ) : (
                <XCircle
                  size={20}
                  className="shrink-0 mt-0.5 text-red-500"
                />
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-bold ${
                    r.ok ? "text-mowsil-navy" : "text-red-700"
                  }`}
                >
                  {r.label}
                </p>
                <p
                  className={`text-xs mt-0.5 leading-relaxed ${
                    r.ok ? "text-mowsil-legend" : "text-red-600"
                  }`}
                >
                  {r.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[11px] text-mowsil-legend flex items-center justify-center gap-1">
            <Database size={12} />
            {process.env.NEXT_PUBLIC_SUPABASE_URL ?? "URL non définie"}
          </p>
        </div>
      </div>
    </div>
  );
}
