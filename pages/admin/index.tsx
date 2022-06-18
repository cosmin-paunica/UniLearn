import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import AdminUsersContainer from '../../components/AdminUsersContainer';
import AdminCoursesContainer from '../../components/AdminCoursesContainer';
import { SessionUser } from '../../lib/types';

export default function Admin({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <Head>
                <title>Admin :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>Admin</h1>
                <AdminCoursesContainer />
                <AdminUsersContainer />
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    // if user not signed in, redirect to /signin
    if (!session) {
        return {
            redirect: {
                destination: '/signin',
                permanent: false
            }
        };
    }

    // if user not ADMIN, redirect to /
    if ((session.user! as SessionUser).role.toLocaleUpperCase() != 'ADMIN') {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: {
            user: session.user
        }
    }
}
