import { GeistSans } from "geist/font/sans";
import ClientProviders from "../components/global/client-providers";
import Navbar from "../components/global/navbar";
import Footer from "../components/global/footer";

import "./globals.css";
import { ThemeProvider } from "next-themes";

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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange
        >
          <ClientProviders>
            <main className=" min-h-screen flex flex-col items-center">
              <div className="flex-1 w-full gap-20">
                <Navbar />

                <div className="max-w-4xl p-5 mx-auto">{children}</div>
              </div>

              <Footer />
            </main>
          </ClientProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
