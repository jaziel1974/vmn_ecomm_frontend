'use client'

import { useRouter } from 'next/navigation';

export default function LogoImage() {
  const router = useRouter();

  return (
    <img
      src="/logo.png"
      alt="Logo"
      className="ml-2 mt-2 h10 w-10 md:h-16 md:w-16"
      onClick={() => router.push("/")}
    />
  );
}
