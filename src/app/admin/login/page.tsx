"use client";

import { useActionState } from "react";
import { Shield, AlertCircle } from "lucide-react";
import { adminLogin } from "@/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";

const initialState = { error: "" };

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(adminLogin, initialState);

  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-mowsil-navy flex items-center justify-center mx-auto mb-4">
            <Shield size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-mowsil-navy">
            Administration
          </h1>
          <p className="text-sm text-mowsil-legend mt-1">
            Accès réservé aux administrateurs MOWSIL
          </p>
        </div>

        <form
          action={formAction}
          className="bg-white rounded-xl border border-mowsil-card-border p-6 space-y-4"
        >
          {state?.error && (
            <Message variant="error" className="text-sm">
              <p>{state.error}</p>
            </Message>
          )}

          <Input
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="admin@mowsil.ma"
            required
          />
          <Input
            id="password"
            name="password"
            label="Mot de passe"
            type="password"
            required
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2"
            disabled={pending}
          >
            {pending ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
      </div>
    </div>
  );
}
