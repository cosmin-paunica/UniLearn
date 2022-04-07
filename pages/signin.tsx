import { GetServerSideProps } from "next"
import { getSession, signIn } from "next-auth/react"
import Head from "next/head"

const SignIn = () => {
    return (
        <div>
            <Head>
                <title>Sign in :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <button onClick={() => signIn("azure-ad")}>Sign in with Microsoft account</button>
            </main>
        </div>
    )
}

export default SignIn

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)

    if (session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {}
    }
}