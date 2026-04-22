"use client";

import { FormEvent, useMemo, useState } from "react";
import { Lock, UserRound } from "lucide-react";
import { AuthFormCard } from "@/features/users/components/AuthFormCard";
import { AuthInput } from "@/features/users/components/AuthInput";
import { useAuthForm } from "@/features/users/components/useAuthForm";

type RegisterFormValues = {
  name: string;
  username: string;
  password: string;
};

type RegisterResponse = {
  user?: {
    id: string;
    name: string;
    username: string;
  };
  error?: string;
};

export function RegisterForm() {
  const { values, register } = useAuthForm<RegisterFormValues>({
    name: "",
    username: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = useMemo(
    () =>
      values.name.trim().length > 0 &&
      values.username.trim().length >= 3 &&
      values.password.length >= 8 &&
      !isLoading,
    [isLoading, values.name, values.password, values.username]
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: values.name.trim(),
          username: values.username.trim(),
          password: values.password
        })
      });
      const data = (await response.json().catch(() => null)) as RegisterResponse | null;

      if (!response.ok) {
        setErrorMessage(data?.error ?? "Impossible de creer le compte.");
        return;
      }

      window.location.assign("/discover");
    } catch {
      setErrorMessage("Le serveur est injoignable pour le moment.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthFormCard
      onSubmit={handleSubmit}
      buttonLabel="Creer mon compte"
      errorMessage={errorMessage}
      isLoading={isLoading}
      loadingLabel="Creation..."
      submitDisabled={!canSubmit}
      switchHref="/login"
      switchLabel="Se connecter"
      switchText="Deja un compte ?"
    >
      <AuthInput
        {...register("name")}
        autoComplete="name"
        icon={<UserRound size={18} />}
        label="Nom"
        placeholder="Ethan"
        type="text"
      />

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
        autoComplete="new-password"
        icon={<Lock size={18} />}
        label="Mot de passe"
        placeholder="password123"
        type="password"
      />
    </AuthFormCard>
  );
}
