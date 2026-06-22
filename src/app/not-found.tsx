import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="text-center px-4 max-w-md">
        <h1 className="text-6xl font-bold text-mowsil-navy mb-4">404</h1>
        <p className="text-lg text-mowsil-body mb-8">
          Page introuvable
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-mowsil-navy text-white font-semibold rounded-lg hover:bg-mowsil-navy/90 transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}