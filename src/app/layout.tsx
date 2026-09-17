import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OceanShield AI | AI Maritime GPS/AIS Spoofing Investigation Platform",
  description:
    "Military & commercial maritime cybersecurity intelligence platform for investigating GPS/AIS spoofing, phantom ghost vessels, and GNSS denial across strategic choke points.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06121E] text-slate-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
