import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Squoosh Photo | Professional Image Compression Tool",
  description: "Fast client-side image compressor and converter. Export to WebP, JPEG, PNG with zoom and visual compare.",
  keywords: ["image compression", "image optimization", "webp", "squoosh clone", "image converter"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className="antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}