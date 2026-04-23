import { AuthPageLayout } from "@/features/users/components/AuthPageLayout";
import { LoginForm } from "@/features/users/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthPageLayout
      title="Bon retour a table"
      description="Connecte-toi pour retrouver tes collections, tes recommandations et les restaurants sauvegardes par ton cercle."
    >
      <LoginForm />
    </AuthPageLayout>
  );
}
