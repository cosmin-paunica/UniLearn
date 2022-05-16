import { CourseUserRole, User, UserInCourse } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from 'next-auth/react'
import Head from "next/head";
import { FormEvent, useState } from "react";
import prisma from "../../../lib/prisma";

export default function AdminCourse({ course }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    // @ts-ignore
    const [usersInCourse, setUsersInCourse] = useState(course.users);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement;
        
        const userEmail = targetElement.email.value;
        const userRes = await fetch(`../../api/users?email=${userEmail}`);
        const [{ id: userId }] = await userRes.json();
        
        const userRole = targetElement.role.value;
        const updatedCourseRes = await fetch(`../../api/courses/${course.id}/users/${userId}?userRole=${userRole}`, {
            method: 'PUT'
        });
        const updatedCourse = await updatedCourseRes.json();
    }

    return (
        <>
            <Head>
                <title>{course.name} {course.academicYear} Admin :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1>{course.name}, {course.academicYear} - Admin</h1>

                <button>Add a new user to this course</button>
                <form onSubmit={handleSubmit}>
                    <table>
                        <tbody>
                            <tr>
                                <td><label htmlFor='email'>Email</label></td>
                                <td><input type='text' id='email' name='email' placeholder='Searh' /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor='role'>Role</label></td>
                                <td>
                                    <select name='role'>
                                        <option value='student'>Student</option>
                                        <option value='professor'>Professor</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2}><input type='submit' /></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                
                <h2>Users</h2>

                <h3>Professors</h3>

                <ul>
                    {usersInCourse.filter((user: UserInCourse) => {
                        return user.userRole.toLocaleUpperCase() === CourseUserRole.PROFESSOR.toString();
                    // @ts-ignore
                    }).map((userInCourse: UserInCourse) => userInCourse.user).map((user: User) => (
                        <li key={user.email}>{user.name}</li>
                    ))}
                </ul>

                <h3>Students</h3>

                <ul>
                    {usersInCourse.filter((user: UserInCourse) => {
                        return user.userRole.toLocaleUpperCase() === CourseUserRole.STUDENT.toString();
                    // @ts-ignore
                    }).map((userInCourse: UserInCourse) => userInCourse.user).map((user: User) => (
                        <li>{user.name}</li>
                    ))}
                </ul>
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
        };
    }

    // @ts-ignore
    if (session.user!.role.toLocaleUpperCase() != 'ADMIN') {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    const id = context.query.courseId as string;
    const course = await prisma.course.findUnique({
        where: { id },
        include: {
            users: {
                include: {
                    user: true
                }
            }
        }
    })

    return {
        props: { course }
    }
}