import type { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import { getSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import { User, Course } from '@prisma/client';
import AddCourseForm from '../components/AddCourseForm';

export default function Admin({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {

    const [users, setUsers] = useState([]);
    const [courses, setCourses] = useState([]);

    const getUsers = async () => {
        const res = await fetch('./api/user');
        const users = await res.json();
        setUsers(users);
    }

    const getCourses = async () => {
        const res = await fetch('./api/course');
        const courses = await res.json();
        setCourses(courses);
    }

    useEffect(() => {
        getUsers();
        getCourses();
    }, []);

    const [addCourseFormClassName, setAddCourseFormClassName] = useState('closed');

    const switchAddCourseForm = () => {
        const newClassName: string = addCourseFormClassName === 'closed' ? 'open' : 'closed';
        setAddCourseFormClassName(newClassName);
    };

    return (
        <div>
            <Head>
                <title>Admin :: UniLearn</title>
                <meta name="description" content="E learning platform" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h2>Users</h2>
                <ul>
                    {users.map((user: User) => (
                        <li key={user.email}>{user.email}</li>
                    ))}
                </ul>

                <h2>Courses</h2>

                <div>
                    <button onClick={switchAddCourseForm}>Add a course</button>
                    <AddCourseForm className={addCourseFormClassName} />
                </div>

                <ul>
                    {courses.map((course: Course) => (
                        <li key={user.email}>{course.name}</li>
                    ))}
                </ul>
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
