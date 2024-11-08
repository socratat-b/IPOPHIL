"use client"

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import Link from "next/link";

export default function SignIn() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    router.push("/dashboard");
  };

  const handleGoogleSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Google sign in clicked");
    // Add your Google authentication logic here
    router.push("/dashboard");
  };

  const handleMicrosoftSignIn = async (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Microsoft sign in clicked");
    // Add your Microsoft authentication logic here
    router.push("/dashboard");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-slate-300 dark:bg-slate-800">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-sm text-muted-foreground">
          The Intellectual Property System related to rights and obligations, as well as privileges and incentives.
        </p>
      </div>

      <form className="my-8" onSubmit={handleSubmit}>

        <LabelInputContainer className="mb-4">

          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="user@gmail.com" type="email" />

        </LabelInputContainer>

        <LabelInputContainer className="mb-4">

          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />

        </LabelInputContainer>

        {/* remember me */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">

            <Checkbox id="remember" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="remember"
                className="text-sm ml-2"
              >
                Remember Me
              </label>
            </div>

          </div>
          <Link
            href="#"
            className="text-cyan-500 text-sm hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Sign in &rarr;
          <BottomGradient />
        </Button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full rounded-md h-10 font-medium shadow-input bg-gray-50 hover:bg-gray-900 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] transition-colors duration-200"
            type="button"
            onClick={handleGoogleSignIn}
          >
            <Icons.google className="h-4 w-4 text-neutral-800 group-hover/btn:text-white dark:text-neutral-300 transition-colors duration-200" />
            <span className="text-neutral-700 group-hover/btn:text-white dark:text-neutral-300 text-sm transition-colors duration-200">
              Sign in with Google
            </span>
            <BottomGradient />
          </Button>

          <Button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full rounded-md h-10 font-medium shadow-input bg-gray-50 hover:bg-gray-900 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] transition-colors duration-200"
            type="button"
            onClick={handleMicrosoftSignIn}
          >
            <Icons.microsoft className="h-4 w-4 text-neutral-800 group-hover/btn:text-white dark:text-neutral-300 transition-colors duration-200" />
            <span className="text-neutral-700 group-hover/btn:text-white dark:text-neutral-300 text-sm transition-colors duration-200">
              Sign in with Microsoft
            </span>
            <BottomGradient />
          </Button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};