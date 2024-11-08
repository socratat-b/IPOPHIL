import { Metadata } from "next"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { ThemeChange } from "@/components/custom/theme/theme-change"
import SignIn from "@/components/custom/auth/sign-in"

export const metadata: Metadata = {
  title: "DMS | Login",
  description: "IPOPHIL Login",
}

export default function AuthenticationPage() {
  return (
    <div className="min-h-screen">
      <div className="container relative min-h-[800px] flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

        <div className={cn("absolute right-4 top-4 md:right-8 md:top-8")}>
          <ThemeChange />
        </div>

        {/* Left side - Logo and Illustration */}
        <div className="relative hidden h-full flex-col p-10 text-white lg:flex">

          {
            /** Logo and Title Container 
              * mar-note: kindly adjust the text-color for dark mode because it is kind of hard or saturated when looked at.
              */
          }
          <div className="absolute top-10 left-10 flex items-center space-x-4 text-[#ff6b00]">
            <Image src={"/logo.svg"} alt="Logo" width={32} height={32} />
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl font-bold font-sans">
                Intellectual Property Office of The Philippines
              </h1>
              <h2 className="text-lg md:text-xl font-semibold font-sans">
                Document Management System
              </h2>
            </div>
          </div>

          {/* Illustration Container */}
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              <Image

                /**
                 * mar-note: kindly remove the illustration image background.
                 */

                src={"/images/illustration.png"}
                width={300}
                height={300}
                alt="Illustration"
                className="object-contain"
              />
            </div>
          </div>

        </div>

        {/* Right side - Sign In Form */}
        <div className="lg:p-8 flex items-center justify-center">
          <SignIn />
        </div>

      </div>
    </div>
  )
}