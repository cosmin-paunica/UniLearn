import NextAuth from "next-auth";
import AzureADProvider from 'next-auth/providers/azure-ad'

const oneMonthInSeconds = 30 * 24 * 60 * 60;

export default NextAuth({
    providers: [
        AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_TENANT_ID
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: oneMonthInSeconds
    },
    jwt: {
        maxAge: oneMonthInSeconds 
    },
})