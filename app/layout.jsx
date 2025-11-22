import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers"; // Client wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Library App",
  description: "Sistem perpustakaan modern berbasis Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Pindahkan SessionProvider ke Client Component */}
        <Providers>
          {children}
        </Providers>

        {/* Toaster untuk notifikasi global */}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
