import { Clock } from "lucide-react";

export default function RequestsLoading() {
  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="text-center space-y-4">
        <Clock size={32} className="text-mowsil-green animate-spin mx-auto" />
        <p className="text-sm text-mowsil-legend">Chargement...</p>
      </div>
    </div>
  );
}
