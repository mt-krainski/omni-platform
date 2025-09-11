"use client";

import { sendOtp } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components";
import { authCopy } from "@/lib/copy";
import { config } from "@/lib/config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          {authCopy.auth.submitButton}
        </>
      ) : (
        authCopy.auth.submitButton
      )}
    </Button>
  );
}

function AuthContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const isInviteOnly = error === "invite-only";

  return (
    <>
      {/* Title and Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{authCopy.auth.title}</h1>
        <p className="text-muted-foreground">{authCopy.auth.subtitle}</p>
      </div>

      {isInviteOnly && (
        <div className="rounded-md border text-sm px-3 py-2 bg-destructive/10 border-destructive/20 text-destructive">
          This application is invite-only. If you need access, contact the
          administrator.
        </div>
      )}

      {/* Form */}
      <form className="space-y-4" action={sendOtp}>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {authCopy.auth.emailLabel}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={authCopy.auth.emailPlaceholder}
            required
            className="focus:border-primary focus:ring-primary"
          />
        </div>
        <SubmitButton />
      </form>

      {/* Legal Disclosure */}
      <div className="text-center text-xs text-muted-foreground">
        <p>
          {authCopy.legal.termsText}{" "}
          <Link href={config.urls.terms} className="underline">
            {authCopy.legal.termsLink}
          </Link>{" "}
          {authCopy.legal.andText}{" "}
          <Link href={config.urls.privacy} className="underline">
            {authCopy.legal.privacyLink}
          </Link>
        </p>
      </div>
    </>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
          <Suspense fallback={null}>
            <AuthContent />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
