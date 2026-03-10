"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <SignIn 
        appearance={{
          elements: {
            rootBox: "w-full max-w-md",
            card: "bg-gray-900 border border-gray-800",
            headerTitle: "text-white",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
            formFieldLabel: "text-gray-300",
            formFieldInput: "bg-gray-800 border-gray-700 text-white",
            formButtonPrimary: "bg-orange-500 hover:bg-orange-600 text-white",
            footerActionLink: "text-orange-500 hover:text-orange-400",
          },
        }}
      />
    </div>
  );
}
