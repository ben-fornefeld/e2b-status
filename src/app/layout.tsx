import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import ClientProviders from "../components/global/client-providers";
import Navbar from "../components/global/navbar";
import Footer from "../components/global/footer";

import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "E2B Status",
  description: "Health-Monitors E2Bs Sandbox creation status",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ClientProviders>
            <main className="min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <Navbar />

                <div className="flex flex-col gap-20 max-w-5xl p-5">
                  {children}
                </div>
              </div>

              <Footer />
            </main>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
