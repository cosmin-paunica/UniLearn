import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { signOut, getSession } from 'next-auth/react'

const Home: NextPage = ({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) => {

    return (
        <div>
            <Head>
                <title>UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <div>Signed in as {user.name}</div>
                <button onClick={() => signOut()}>Sign out</button>
            </main>
        </div>
    )
}

export default Home

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: session.user
        }
    }
}
