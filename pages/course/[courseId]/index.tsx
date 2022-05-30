import { Assignment } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import AddAssignmentForm from "../../../components/AddAssignmentForm";
import AssignmentCard from "../../../components/AssignmentCard";
import { getProfessorNamesAsString } from "../../../lib/helper_functions";
import prisma from "../../../lib/prisma";
import { SessionUser } from "../../../lib/types";

export default function Course({ course, userRole, assignmentsJSONable: assignments, userId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
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

                {assignments.map((assignment: Assignment) => <AssignmentCard key={assignment.id} assignment={assignment} userId={userId} />)}
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

    const assignments = await prisma.assignment.findMany({
        where: { courseId: id },
        orderBy: [{ deadline: 'desc' }]
    })

    const assignmentsJSONable = assignments.map(({
        id,
        courseId,
        title,
        description,
        dateAdded,
        deadline 
    }) => ({
        id,
        courseId,
        title,
        description,
        dateAdded: dateAdded.toLocaleString(),
        deadline: deadline.toLocaleString()
    }));

    const userRole = course?.users.find(user => user.userId == (session.user as SessionUser).id)?.userRole;

    return {
        props: { course, userRole, assignmentsJSONable, userId: (session.user as SessionUser).id }
    }
}