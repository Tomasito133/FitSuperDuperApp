"use client";

import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButton() {
  const { isSignedIn } = useAuth();
  
  return (
    <>
      {isSignedIn ? (
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "w-8 h-8"
            }
          }}
        />
      ) : (
        <SignInButton mode="modal">
          <button className="text-orange-500 font-medium text-base hover:text-orange-400 transition-colors">
            Войти
          </button>
        </SignInButton>
      )}
    </>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return null;
  }
  
  return (
    <>
      {isSignedIn ? children : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-400 text-lg mb-4">Войди, чтобы сохранять тренировки</p>
        </div>
      )}
    </>
  );
}
