import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import SignUpCard from "./_components/sign-up-card";

export default function SignUpPage() {
  return (
    <AuthPageShell tagline="建立帳號，開始編排值班表。">
      <SignUpCard />
    </AuthPageShell>
  );
}
