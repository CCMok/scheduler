import AuthPageShell from "@/components/_general/auth/auth-page-shell";
import SignUpCard from "./_components/sign-up-card";

export default function SignUpPage() {
  return (
    <AuthPageShell title="建立帳號" description="開始編排值班表。">
      <SignUpCard />
    </AuthPageShell>
  );
}
