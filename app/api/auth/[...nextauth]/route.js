import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import supabase from "@/app/lib/supabaseClient"; 

const adminEmail = 'lidamahamad7@gmail.com'

export const authOptions = {
    providers: [
      CredentialsProvider({
        async authorize(credentials) {
            if (!credentials) {
                console.log("No credentials provided");
                return null;
            }

            try {

              const { data , error: userError } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
              });
                if (userError) {
                    console.error("Database error:", userError);
                    throw new Error("Database error occurred");
                }
                
                if (data.user) {
                  return { id: data.user.id, email: data.user.email, name: data.user.user_metadata.full_name };
                }

            } catch (error) {
                console.error("Authorization failed:", error);
                throw new Error(error.message || "Authorization failed");
            }
        }
    }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
        })
    ],

    debug: true,
    callbacks: {
        async redirect({ url }) {
            return url.startsWith('/') ? url : '/';
        },

        async session({session, token}) {
          session.user.id = token.id;
          return session;
        },
   
        async jwt({ token, user }) {
          if(adminEmail.includes(token?.email)){
                return token;
              }else{
                return false
              }
        }
    },
    session: {
        strategy: 'jwt',
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }