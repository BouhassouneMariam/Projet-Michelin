import { AuthPageLayout } from "@/features/users/components/AuthPageLayout";
import { RegisterForm } from "@/features/users/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthPageLayout
      title="Cree ton carnet"
      description="Inscris-toi pour sauvegarder tes restaurants, composer tes collections et retrouver les meilleures tables pour chaque moment."
    >
      <RegisterForm />
    </AuthPageLayout>
  );
}
