import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useSession, signIn, signOut } from 'next-auth/react'

const Home: NextPage = () => {
    const { data: session } = useSession();

    return (
        <div className={styles.container}>
            <Head>
                <title>UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {!session && (
                    <>
                        <div>Not signed in</div>
                        <button onClick={() => signIn()}>Sign in</button>
                    </>
                )}
                {session && (
                    <>
                        <div>Signed in as {session.user?.name}</div>
                        <button onClick={() => signOut()}>Sign out</button>
                    </>
                )}
            </main>
        </div>
    )
}

export default Home
