import { Course } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import styles from './CoursesTable.module.css'

export default function CoursesTable({ courses, selectedAcademicYear }: { courses: Course[], selectedAcademicYear: string }) {
    const [deleteIdClicked, setDeleteIdClicked] = useState<string | null>(null);
    const [deletedId, setDeletedId] = useState<string | null>(null);
    
    const handleDelete = async (courseId: string) => {
        await fetch(`/api/courses/${courseId}`, {
            method: 'DELETE'
        });
        setDeletedId(courseId);
    }

    return (
        <>
            { selectedAcademicYear && (
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Course name</th>
                            <th>Year</th>
                            <th>Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.filter((course: Course) => course.academicYear === selectedAcademicYear).map((course: Course) => (
                            <tr key={course.name + course.academicYear}>
                                {course.id == deletedId && <td className="successMessage">Deleted</td>}
                                {course.id != deletedId && (
                                    <>
                                        <td>{course.name}</td>
                                        <td>{course.year}</td>
                                        <td>{course.semester}</td>
                                        <td>
                                            <Link href={`/admin/course/${course.id}`}>
                                                <a><img className={styles.rightArrow} src='/right_arrow.svg' /></a>
                                            </Link>
                                        </td>
                                        <td>
                                            <button onClick={(event: any) => setDeleteIdClicked(course.id)}>Delete</button>
                                        </td>
                                        {course.id == deleteIdClicked && (
                                            <td>
                                                <span className="errorMessage">Are you sure?</span>
                                                <button onClick={(event: any) => setDeleteIdClicked(null)}>No</button>
                                                <button onClick={(event: any) => handleDelete(course.id)}>Yes</button>
                                            </td>
                                        )}
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
        
    )
    
}