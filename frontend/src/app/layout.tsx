import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";


const typewriter = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-typewriter",
});

export const metadata: Metadata = {
  title: "Job Assist",
  description: "AI assisted job guidance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${typewriter.variable}`}
    >
      <body className="min-h-full flex flex-col font-typewriter">
        {children}
      </body>
    </html>
  );
}