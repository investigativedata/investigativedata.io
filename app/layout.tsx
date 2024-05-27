import type { Metadata } from "next";
import ThemeRegistry from "./ThemeRegistry";
import "./globals.css";

export const metadata: Metadata = {
  title: "||)·|() investigativedata.io",
  description:
    "we do secure infrastructure and data engineering for investigative journalism and research organizations. Secure Research Hub, Managed Aleph",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry options={{ key: "joy" }}>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
