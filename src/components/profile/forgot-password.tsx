"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsSubmitted(true);
      toast.success("Password reset link sent to your email.");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setEmail("");
  };

  if (isSubmitted) {
    return (
      <Card className="border-0 shadow-md bg-white dark:bg-slate-900">
        <CardContent className="pt-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900 p-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Check Your Email
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We've sent a password reset link to{" "}
              <strong className="text-foreground">{email}</strong>. Click the
              link to create a new password.
            </p>
            <div className="pt-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            <div className="flex gap-3 pt-6">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 bg-transparent"
              >
                Try Another Email
              </Button>
              <Button className="flex-1" disabled>
                Back to Login
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md bg-white dark:bg-slate-900">
      <CardHeader>
        <CardTitle>Forgot Password?</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              We'll send you a secure link to reset your password.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => setEmail("")}
            >
              Clear
            </Button>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-4 rounded-lg bg-muted">
            <h4 className="font-semibold text-foreground mb-2">Not working?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Check that you're using the correct email address</li>
              <li>• Look in your spam or junk folder</li>
              <li>• Try again in a few minutes</li>
              <li>• Contact support if you continue to have issues</li>
            </ul>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
