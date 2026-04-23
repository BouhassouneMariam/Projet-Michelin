"use client";

import { FormEvent, useMemo, useState } from "react";
import { Lock, UserRound } from "lucide-react";
import { AuthFormCard } from "@/features/users/components/AuthFormCard";
import { AuthInput } from "@/features/users/components/AuthInput";
import { useAuth } from "@/features/users/AuthProvider";
import { useAuthForm } from "@/features/users/components/useAuthForm";

type LoginFormValues = {
  username: string;
  password: string;
};

type LoginResponse = {
  user?: {
    id: string;
    name: string;
    username: string;
    role: "ADMIN" | "USER";
  };
  error?: string;
};

export function LoginForm() {
  const { setAuthenticated } = useAuth();
  const { values, register } = useAuthForm<LoginFormValues>({
    username: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(
    () => values.username.trim().length > 0 && values.password.length > 0 && !isLoading,
    [isLoading, values.password, values.username]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: values.username.trim(),
          password: values.password
        })
      });
      const data = (await response.json().catch(() => null)) as LoginResponse | null;

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Impossible de se connecter.");
        return;
      }

      setAuthenticated();
      if (data?.user?.role === "ADMIN") {
        window.location.assign("/admin");
      } else {
        window.location.assign("/");
      }
    } catch {
      setErrorMessage("Le serveur est injoignable pour le moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      onSubmit={handleSubmit}
      buttonLabel="Se connecter"
      errorMessage={errorMessage}
      isLoading={isLoading}
      loadingLabel="Connexion..."
      submitDisabled={!canSubmit}
      switchHref="/register"
      switchLabel="Creer un compte"
      switchText="Pas encore de compte ?"
    >
      <AuthInput
        {...register("username")}
        autoComplete="username"
        icon={<UserRound size={18} />}
        label="Nom d'utilisateur"
        placeholder="ethan"
        type="text"
      />

      <AuthInput
        {...register("password")}
        autoComplete="current-password"
        icon={<Lock size={18} />}
        label="Mot de passe"
        placeholder="password123"
        type="password"
      />
    </AuthFormCard>
  );
}
