import { Course } from '@prisma/client';
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { getAllAcademicYears } from '../lib/helper_functions';
import styles from './AdminCoursesContainer.module.css'
import CoursesTable from './CoursesTable';

export default function AdminCoursesContainer() {
    
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('');
    const [addedCourse, setAddedCourse] = useState<Course | null>(null);
    const [formClassName, setFormClassName] = useState(styles.closed);

    const getCourses = async () => {
        const res = await fetch(`./api/courses`);
        const courses = await res.json();
        setCourses(courses.sort(compareCourses));
    }

    useEffect(() => {
        getCourses();
    }, []);

    const compareCourses = (course1: Course, course2: Course) => {
        if (course1.year !== course2.year) return course1.year - course2.year;
        return course1.semester - course2.semester;
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement;

        const res = await fetch('../api/courses', {
            method: 'POST',
            body: JSON.stringify({
                name: targetElement.courseName.value,
                academicYear: targetElement.academicYear.value,
                year: targetElement.year.value,
                semester: targetElement.semester.value
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const addedCourse = await res.json();
        setAddedCourse(addedCourse);
        setCourses(courses.concat([addedCourse]).sort(compareCourses));
    }

    return (
        <div>
            <h2>Courses</h2>

            <select onChange={(event) => { setSelectedAcademicYear(event.target.value) }}>
                <option value=''>Choose an academic year</option>
                {/* map all unique academic years existing in courses to an option */}
                {getAllAcademicYears(courses).sort().reverse().map(academicYear => (
                    <option key={academicYear} value={academicYear}>{academicYear}</option>
                ))}
            </select>

            <CoursesTable courses={courses} selectedAcademicYear={selectedAcademicYear} />

            <div>
                <button onClick={() => {
                    setFormClassName(formClassName === styles.closed ? styles.open : styles.closed)
                }}>Add a course</button>
                <form onSubmit={handleSubmit} className={formClassName} >
                    <table className={styles.formTable}>
                        <tbody>
                            <tr>
                                <td><label htmlFor='name'>Name</label></td>
                                <td><input type='text' id='courseName' name='courseName' placeholder='Course name' required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor='academicYear'>Academic year</label></td>
                                <td><input type='text' id='academicYear' name='academicYear' placeholder='2021-2022' required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor='year'>Year</label></td>
                                <td><input type='number' id='year' name='year' placeholder='Course year' required /></td>
                            </tr>
                            <tr>
                                <td><label htmlFor='semester'>Semester</label></td>
                                <td><input type='number' id='semester' name='semester' placeholder='Course semester' required /></td>
                            </tr>
                            <tr>
                                <td colSpan={2}><input type='submit' value='Add course' className={styles.submitButton} /></td>
                            </tr>
                        </tbody>
                    </table>
                </form>

                {addedCourse && (
                    <div>
                        Successfully added course {addedCourse['name']}
                    </div>
                )}
            </div>
        </div>
    )
}