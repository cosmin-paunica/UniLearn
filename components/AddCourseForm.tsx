import { Course } from '@prisma/client';
import { FormEvent, useState } from 'react';
import styles from './AddCourseContainer.module.css';

export default function AddCourseForm({ className }: { className: string }) {

    const [addedCourse, setAddedCourse] = useState<Course | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement
        const res = await fetch('../api/course', {
            method: 'POST',
            body: JSON.stringify({
                name: targetElement.courseName.value,
                year: targetElement.year.value,
                semester: targetElement.semester.value
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        const course = await res.json();
        setAddedCourse(course);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles[className]}>
                <table className={styles.formTable}>
                    <tbody>
                        <tr>
                            <td><label htmlFor='name'>Name</label></td>
                            <td><input type='text' id='courseName' name='courseName' placeholder='Course name' required /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='year'>Year</label></td>
                            <td><input type='number' id='year' name='year' placeholder='Course year' required /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor='semester'>Name</label></td>
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
        </>
    )
}
