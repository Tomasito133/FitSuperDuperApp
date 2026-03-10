"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import Link from "next/link";

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
        <Link 
          href="/sign-in" 
          className="text-orange-500 font-medium text-base hover:text-orange-400 transition-colors"
        >
          Войти
        </Link>
      )}
    </>
  );
}

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  return (
    <>
      {isSignedIn ? children : (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4">
          <p className="text-gray-400 text-lg mb-6">
            <Link href="/sign-in" className="text-orange-500 hover:text-orange-400 transition-colors">
              Войди
            </Link>
            , чтобы сохранять тренировки
          </p>
          <Link 
            href="/sign-in"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            Войти или зарегистрироваться
          </Link>
        </div>
      )}
    </>
  );
}
