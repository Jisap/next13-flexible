import { getServerSession } from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import jsonwebtoken from 'jsonwebtoken'
import { JWT } from "next-auth/jwt";
import { SessionInterface, UserProfile } from "@/common.types";
import { createUser, getUser } from './action';

export const authOptions: NextAuthOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        })
    ],
    jwt: {
        encode: ({ secret, token }) => {
            const encodedToken = jsonwebtoken.sign(
                {
                    ...token,
                    iss: "grafbase",
                    exp: Math.floor(Date.now() / 1000) + 60 * 60,
                },
                secret
            );

            return encodedToken;
        },
        decode: async ({ secret, token }) => {
            const decodedToken = jsonwebtoken.verify(token!, secret);
            return decodedToken as JWT;
        },
    },
    theme:{
        colorScheme: 'light',
        logo: '/logo.svg'
    },
    callbacks: {
        async session({ session }){
            const email = session?.user?.email as string;
            
            try {
                const data = await getUser(email) as { user?: UserProfile };
                const newSession = {
                    ...session,
                    user:{
                        ...session.user,
                        ...data?.user
                    }
                }
                return newSession;

            } catch (error:any) {
                console.error("Error retrieving user data: ", error.message);
                console.log(error)
                return session;
            }
        },
        async signIn({ user }: { user: AdapterUser | User }){
            try {
                //get the user uf they exits
                const userExists = await getUser(user?.email as string) as { user?: UserProfile }
                //if they dont exist create them
                if(!userExists.user){
                    await createUser(
                        user.name as string,
                        user.email as string,
                        user.image as string,    
                    )
                }
                //return true if they exis or were created
                return true  
            } catch (error:any) {
                console.log(error)
                return false
            } 
        }// Si el return es true el flujo continua y se ejecuta el cb session -> crea session con info actualizada

    }
}

export async function getCurrentUser() {
    const session = await getServerSession(authOptions) as SessionInterface; // Actualizada la session esta func del
    return session;                                                          // Navbar se invoca       
}