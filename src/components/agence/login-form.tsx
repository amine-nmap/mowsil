"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { LogIn, AlertCircle } from "lucide-react";
import { login } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@/components/ui/message";

const initialState = { error: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const t = useTranslations("common");
  const n = useTranslations("navigation");

  return (
    <div className="min-h-screen bg-mowsil-gray flex items-center justify-center">
      <div className="mx-auto w-full max-w-sm px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-mowsil-navy">
            {n("login")}
          </h1>
          <p className="text-sm text-mowsil-legend mt-1">
            {n("loginSubtitle")}
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
            label={t("email")}
            type="email"
            placeholder="contact@agence.ma"
            required
          />
          <Input
            id="password"
            name="password"
            label={t("password")}
            type="password"
            required
          />

          <Button
            variant="primary"
            size="lg"
            className="w-full gap-2"
            disabled={pending}
          >
            <LogIn size={18} />
            {pending ? t("loading") : n("login")}
          </Button>
        </form>
      </div>
    </div>
  );
}
