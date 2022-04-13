import { Course } from '@prisma/client';
import { FormEvent, useState } from 'react';
import styles from './AddCourseContainer.module.css';

export default function AddCourseForm({ className }: { className: string }) {

    const [addedCourse, setAddedCourse] = useState<Course | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        // @ts-ignore
        const name = event.target.name.value;
        const res = await fetch('../api/course', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: { 'Content-Type': 'application/json' }
        });
        const course = await res.json();
        setAddedCourse(course);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className={styles[className]}>
                <label htmlFor='name'>Name</label>
                <input type='text' id='name' name='name' placeholder='Course name' required />
                <input type='submit' />
            </form>
            {addedCourse && (
                <div>
                    Successfully added course {addedCourse['name']}
                </div>
            )}
        </>
    )
}
