import { Assignment } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import AddAssignmentForm from "../../../components/AddAssignmentForm";
import AssignmentCard from "../../../components/AssignmentCard";
import { getProfessorNamesAsString } from "../../../lib/helper_functions";
import prisma from "../../../lib/prisma";
import { AssignmentWithFileUploads, SessionUser } from "../../../lib/types";
import superjson from 'superjson'

export default function Course({ course, userRole, assignmentsJSON, userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const assignments: AssignmentWithFileUploads[] = superjson.parse(assignmentsJSON);
    
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

                {userRole == 'PROFESSOR' && <AddAssignmentForm courseId={course.id} />}

                {assignments.map((assignment: AssignmentWithFileUploads) => <AssignmentCard key={assignment.id} assignment={assignment} userId={userId} userRole={userRole} />)}
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
            }
        }
    });

    if (!course) { return { notFound: true } }

    const assignments = await prisma.assignment.findMany({
        where: { courseId: id },
        include: {
            fileUploads: {
                where: { studentId: (session.user as SessionUser).id }
            }
        },
        orderBy: [{ deadline: 'desc' }]
    })

    const assignmentsJSON = superjson.stringify(assignments);

    const userRole = (await prisma.userInCourse.findFirst({
        where: {
            courseId: id,
            userId: (session.user as SessionUser).id
        },
        select: { userRole: true }
    }))?.userRole;

    return {
        props: { course, userRole, assignmentsJSON, userId: (session.user as SessionUser).id }
    }
}