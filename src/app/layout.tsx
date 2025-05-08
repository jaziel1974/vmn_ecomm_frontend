import { Poppins } from "next/font/google";
import "./styles/globals.css";
import { ComponentType } from "react";
import Header from "@/components/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

interface RootLayoutProps {
  children: React.ReactNode;
  Component: ComponentType<any>;
  pageProps: any;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-poppins`}>
        <Header></Header>
        {children}
      </body>
    </html>
  );
}
