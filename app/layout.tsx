import "./globals.css";
import { Manrope } from "next/font/google";
import NavigationWrapper from "@/components/Navigation";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-manrope",
});

export const metadata = {
  title: "Brother's Unity",
  description: "Strength in Unity",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${manrope.variable} bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased`}
      >
        <NavigationWrapper userRole={"admin"} />
        {/* Fixed: Changed from mr-72 to mr-80 to match sidebar width (w-80 = 20rem = 320px) */}
        <main className="lg:mr-80 min-h-screen transition-all duration-300">
          {children}
        </main>
      </body>
    </html>
  );
}