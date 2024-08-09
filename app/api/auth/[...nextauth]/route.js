import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmail = ['lidamahamad7@gmail.com'];

export const authOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
      })
    ],
    callbacks: {
  
      async redirect({url}) {
        return url;
      },
  
      async session({session, token}) {
        session.user.id = token.id;
        return session;
      },
      
      async jwt({token}) {
        if(adminEmail.includes(token?.email)){
          return token;
        }else{
          return false
        }
        
      }
    },
    session: {
      jwt: true,
    },
  
}


const handler =  NextAuth(authOptions);


export { handler as GET, handler as POST }
