import Provider from "../components/SessionProvider";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider> {/* Wrap the app in SessionProvider */}
          <nav>
            <Link href="/">Home</Link> | <Link href="/blog">Blog</Link> | <Link href="/login">Login</Link>
          </nav>
          {children}
        </Provider>
      </body>
    </html>
  );
}
