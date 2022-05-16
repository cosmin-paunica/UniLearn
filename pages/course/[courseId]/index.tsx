import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { getProfessorNamesAsString } from "../../../lib/helper_functions";
import prisma from "../../../lib/prisma";

export default function Course({ course }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <>
            <Head>
                <title>{course.name} :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>{course.name}</h1>
                <div>{getProfessorNamesAsString(course)}</div>
                <div>Year {course.year}, semester {course.semester}</div>

                <h2>Assignments</h2>
                {console.log(course)}
                
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

    const id = context.params!.courseId as string;
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            users: {
                where: { userRole: 'PROFESSOR' },
                include: { user: true }
            },
            assignments: true
        }
    });

    return {
        props: { course }
    }
}