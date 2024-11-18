import type { Metadata } from "next";
import "./globals.css";
import MainProvider from "@/components/providers";
import { Sora, Roboto } from "next/font/google";
import { cookies } from "next/headers";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wisper",
  description: "Wisper your secrets securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publicKey = cookies().get("publicKey");

  return (
    <html lang="en">
      <body
        className={`${roboto.className} ${sora.className} antialiased`}
        suppressHydrationWarning
      >
        <MainProvider publicKey={publicKey?.value}>{children}</MainProvider>
      </body>
    </html>
  );
}
