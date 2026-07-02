import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brandGreen border-t-transparent" />
        </div>
      }
    >
      <LoginPage />
    </Suspense>
  );
}
