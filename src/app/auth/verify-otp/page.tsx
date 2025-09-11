"use client";

import { verifyOtp, resendOtp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components";
import { authCopy } from "@/lib/copy";
import { config } from "@/lib/config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useFormStatus } from "react-dom";

function VerifyButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
          {authCopy.verifyOtp.submitButton}
        </>
      ) : (
        authCopy.verifyOtp.submitButton
      )}
    </Button>
  );
}

function ResendButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-sm text-muted-foreground hover:text-foreground underline disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current inline-block mr-2" />
          Resending...
        </>
      ) : (
        authCopy.verifyOtp.resendLink
      )}
    </button>
  );
}

function VerifyOtpContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const resent = searchParams.get("resent") === "true";
  const [showMessage, setShowMessage] = useState(resent);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => setShowMessage(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="w-full max-w-sm space-y-6">
      {/* Title and Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">{authCopy.verifyOtp.title}</h1>
        <p className="text-muted-foreground">{authCopy.verifyOtp.subtitle}</p>
        {email && (
          <p className="text-sm text-muted-foreground font-medium">{email}</p>
        )}
      </div>

      {/* Success Message */}
      {showMessage && (
        <div className="bg-green-100/60 dark:bg-green-900/30 border border-green-300/60 dark:border-green-700/50 text-green-800 dark:text-green-300 px-4 py-3 rounded-md text-sm">
          Verification code resent successfully!
        </div>
      )}

      {/* Verification Form */}
      <form className="space-y-4" action={verifyOtp}>
        <input type="hidden" name="email" value={email} />
        <div className="space-y-2">
          <Label htmlFor="token" className="text-sm font-medium">
            {authCopy.verifyOtp.otpLabel}
          </Label>
          <Input
            id="token"
            name="token"
            type="text"
            placeholder={authCopy.verifyOtp.otpPlaceholder}
            required
            maxLength={6}
            pattern="[0-9]{6}"
            className="text-center text-lg tracking-widest"
          />
        </div>
        <VerifyButton />
      </form>

      {/* Resend Code Form */}
      <form className="text-center" action={resendOtp}>
        <input type="hidden" name="email" value={email} />
        <ResendButton />
      </form>

      {/* Back to Auth Link */}
      <div className="text-center">
        <Link
          href="/auth"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {authCopy.verifyOtp.backLink}
        </Link>
      </div>

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
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="p-6">
        <Logo />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6">
        <Suspense
          fallback={
            <div className="w-full max-w-sm space-y-6 text-center">
              <div className="animate-pulse space-y-4">
                <div className="h-8 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          }
        >
          <VerifyOtpContent />
        </Suspense>
      </main>
    </div>
  );
}
