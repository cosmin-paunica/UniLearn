import { Course } from "@prisma/client";
import Link from "next/link";
import styles from './CoursesTable.module.css'

export default function CoursesTable({ courses, selectedAcademicYear }: { courses: Course[], selectedAcademicYear: string }) {
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
                                        <td>{course.name}</td>
                                        <td>{course.year}</td>
                                        <td>{course.semester}</td>
                                        <td>
                                            <Link href={`/admin/course/${course.id}`}>
                                                <a><img className={styles.rightArrow} src='/right_arrow.svg' /></a>
                                            </Link>
                                        </td>
                                    </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </>
        
    )
    
}