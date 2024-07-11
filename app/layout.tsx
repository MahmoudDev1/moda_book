import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
  title: "Modabook",
  description: "Modabook website is used to communicate with other people and share your knowledge together in varius fields.",
};

export default function RootLayout({ children, modal } : { children: React.ReactNode; modal: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="mx-auto max-w-screen-md px-4 mt-5">{children}</div>
        {modal}
        <Analytics />
      </body>
    </html>
  );
}
