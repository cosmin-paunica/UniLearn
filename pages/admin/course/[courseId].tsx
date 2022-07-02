import { CourseUserRole, User, UserInCourse } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next"
import { getSession } from 'next-auth/react'
import Head from "next/head";
import { FormEvent, useState } from "react";
import prisma from "../../../lib/prisma";
import { CourseWithUsers, UserInCourseWithUser } from "../../../lib/types";
import { validateEmail } from '../../../lib/validations';

export default function AdminCourse({ course }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [usersInCourse, setUsersInCourse] = useState(course.users);

    const [addedUser, setAddedUser] = useState(false);
    const [errorAddingUser, setErrorAddingUser] = useState("");

    const [removeUserIdClicked, setRemoveUserIdClicked] = useState<string | null>('null');
    const [removedUserId, setRemovedUserId] = useState<string | null>('null');

    const handleSubmit = async (event: FormEvent) => {

        event.preventDefault();
        const targetElement = event.target as HTMLFormElement;

        try {
            const userEmail = targetElement.email.value;
            if (!validateEmail(userEmail)) {
                throw new Error("Invalid email");
            }

            const userRes = await fetch(`../../api/users?email=${userEmail}`);
            const users: User[] = await userRes.json();
            if (!users || users.length == 0) {
                throw new Error("User not found");
            }
            const { id: userId } = users[0];
            
            const userRole = targetElement.role.value;
            const updatedCourseRes = await fetch(`../../api/courses/${course.id}/users/${userId}?userRole=${userRole}`, {
                method: 'PUT'
            });
            const updatedCourse: CourseWithUsers = await updatedCourseRes.json();
            const addedUserInCourse = updatedCourse.users.filter((userInCourse: UserInCourseWithUser) => userInCourse.userId == userId)[0];

            setErrorAddingUser("");
            setAddedUser(true);
            setUsersInCourse([...usersInCourse, addedUserInCourse]);
        } catch(err: any) {
            setAddedUser(false);
            setErrorAddingUser(err.message);
        }
    }

    const handleRemoveUser = async (userId: string) => {
        const res = await fetch(`/api/courses/${course.id}/users/${userId}`, {
            method: 'DELETE'
        });
        const resData = await res.json();

        if (resData && resData.message == 'Removed') {
            setRemovedUserId(userId);
        }
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

                <h2>Add a new user to this course</h2>
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
                {errorAddingUser && <div className="errorMessage">{errorAddingUser}</div>}
                {addedUser && <div className="successMessage">User added successfully</div>}
                
                <h2>Users</h2>

                <h3>Professors</h3>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersInCourse.filter((user: UserInCourse) => {
                            return user.userRole.toLocaleUpperCase() === CourseUserRole.PROFESSOR.toString();
                        // @ts-ignore
                        }).map((userInCourse: UserInCourse) => userInCourse.user).map((user: User) => (
                            <tr key={user.email}>
                                {user.id == removedUserId && <td className="successMessage">Removed</td>}
                                {user.id != removedUserId && (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button onClick={(event: any) => setRemoveUserIdClicked(user.id)}>Remove</button>
                                        </td>
                                        {user.id == removeUserIdClicked && (
                                            <td>
                                                <span className="errorMessage">Are you sure?</span>
                                                <button onClick={(event: any) => setRemoveUserIdClicked(null)}>No</button>
                                                <button onClick={(event: any) => handleRemoveUser(user.id)}>Yes</button>
                                            </td>
                                        )}
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h3>Students</h3>

                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersInCourse.filter((user: UserInCourse) => {
                            return user.userRole.toLocaleUpperCase() === CourseUserRole.STUDENT.toString();
                        // @ts-ignore
                        }).map((userInCourse: UserInCourse) => userInCourse.user).map((user: User) => (
                            <tr key={user.email}>
                                {user.id == removedUserId && <td className="successMessage">Removed</td>}
                                {user.id != removedUserId && (
                                    <>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button onClick={(event: any) => setRemoveUserIdClicked(user.id)}>Remove</button>
                                        </td>
                                        {user.id == removeUserIdClicked && (
                                            <td>
                                                <span className="errorMessage">Are you sure?</span>
                                                <button onClick={(event: any) => setRemoveUserIdClicked(null)}>No</button>
                                                <button onClick={(event: any) => handleRemoveUser(user.id)}>Yes</button>
                                            </td>
                                        )}
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
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

    if (!course) { return { notFound: true } }

    return {
        props: { course }
    }
}