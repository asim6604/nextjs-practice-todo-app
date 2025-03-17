import NextAuth, { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define your authentication options
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set in your .env file
  session: {
    strategy: "jwt", // Use JWT for session management
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Mock user for demonstration purposes
        const mockUser = {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        };

        // Check if credentials are provided and match the mock user
        if (
          credentials?.email === "test@example.com" &&
          credentials?.password === "password"
        ) {
          return mockUser;
        }

        // Return null if credentials are invalid
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // Add user ID to the token
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID to the session object
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId || "", // Ensure `id` is added to the session
        },
      };
    },
  },
};

// Export the NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler for all HTTP methods
export { handler as GET, handler as POST };