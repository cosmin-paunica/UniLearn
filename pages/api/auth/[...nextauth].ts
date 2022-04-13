import NextAuth from "next-auth";
import AzureADProvider from 'next-auth/providers/azure-ad';
import  { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "../../../lib/prisma";

const oneMonthInSeconds = 30 * 24 * 60 * 60;

export default NextAuth({
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID
        })
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: oneMonthInSeconds
    },
    jwt: {
        maxAge: oneMonthInSeconds 
    },
    callbacks: {
        // @ts-ignore
        session: async ({ session }) => {
            if (!session) return;
            const user = await prisma.user.findUnique({
                where: {
                    email: session.user?.email!
                }
            })
            return {
                user: {
                    email: user?.email,
                    name: user?.name,
                    image: user?.image,
                    id: user?.id,
                    role: user?.role
                },
                expires: session.expires
            };
        }
    }
})