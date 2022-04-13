import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { Course } from '@prisma/client';
import AddCourseForm from '../components/AddCourseForm';
import UsersContainer from '../components/UsersContainer';
import CoursesContainer from '../components/CoursesContainer';

export default function Admin({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <div>
            <Head>
                <title>Admin :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <UsersContainer />
                <CoursesContainer />
            </main>
        </div>
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
    // @ts-ignore
    if (session.user!.role.toLocaleUpperCase() != 'ADMIN') {
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
