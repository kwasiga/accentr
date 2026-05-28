import { LoginForm } from "@/components/login-form";

type Props = {
  searchParams: Promise<{ message?: string; error?: string }>;
};

export default async function SignInPage({ searchParams }: Props) {
  const { message, error } = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10" style={{ backgroundColor: "#f0ede8" }}>
      <div className="w-full max-w-sm flex flex-col gap-4">
        {message && (
          <p className="text-sm text-center rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-2">
            {message}
          </p>
        )}
        {error === "callback_error" && (
          <p className="text-sm text-center rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-2">
            Email confirmation failed. Please try signing up again.
          </p>
        )}
        <LoginForm />
      </div>
    </div>
  );
}
