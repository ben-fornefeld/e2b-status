import "./globals.css";

import { GeistSans } from "geist/font/sans";
import ClientProviders from "../components/global/client-providers";
import Navbar from "../components/global/navbar";
import { ThemeProvider } from "next-themes";

import "./fonts";

const defaultUrl = process.env.NEXT_PUBLIC_BASE_URL!;

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
      {/* we have a gradient background, hence we fix body so that mac devices to not look weird when overscrolling */}
      <body className="fixed inset-0">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          forcedTheme="dark"
        >
          <ClientProviders>
            <main className="flex min-h-screen flex-col items-center">
              <div className="w-full flex-1 gap-20 pt-16">
                <Navbar />

                <div className="mx-auto max-w-4xl p-5">{children}</div>
              </div>

              {/* <Footer /> */}
            </main>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
