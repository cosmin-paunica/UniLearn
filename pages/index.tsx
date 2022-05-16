import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import prisma from '../lib/prisma'
import CoursesContainer from '../components/CoursesContainer';

export default function Home({ taughtCourses, takenCourses }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    return (
        <>
            <Head>
                <title>UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                {taughtCourses.length > 0 && (
                    <>
                        <h1>Courses you teach</h1>
                        <CoursesContainer courses={taughtCourses} />
                    </>
                )}
                {takenCourses.length > 0 && (
                    <>
                        <h1>Courses you take</h1>
                        <CoursesContainer courses={takenCourses} />
                    </>
                )}
            </main>
        </>
    )
}

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

    const taughtCourses = await prisma.course.findMany({
        where: {
            users: {
                some: {
                    // @ts-ignore
                    userId: session.user!.id,
                    userRole: 'PROFESSOR'
                }
            }
        },
        include: {
            users: {
                where: { userRole: 'PROFESSOR' },
                include: { user: true }
            }
        }
    })

    const takenCourses = await prisma.course.findMany({
        where: {
            users: {
                some: {
                    // @ts-ignore
                    userId: session.user!.id,
                    userRole: 'STUDENT'
                }
            }
        },
        include: {
            users: {
                where: { userRole: 'PROFESSOR' },
                include: { user: true }
            }
        }
    })

    return {
        props: { taughtCourses, takenCourses }
    }
}
