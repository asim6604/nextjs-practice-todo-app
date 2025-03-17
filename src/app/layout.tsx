import Provider from "../components/SessionProvider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider> {/* Wrap the app in SessionProvider */}
          <nav>
            <a href="/">Home</a> | <a href="/blog">Blog</a> | <a href="/login">Login</a>
          </nav>
          {children}
        </Provider>
      </body>
    </html>
  );
}
