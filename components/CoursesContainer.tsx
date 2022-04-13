import { Course } from '@prisma/client';
import { useEffect, useState } from 'react';
import AddCourseForm from './AddCourseForm';
import styles from './CoursesContainer.module.css'

export default function CoursesContainer() {
    
    const [courses, setCourses] = useState([]);

    const getCourses = async () => {
        const res = await fetch('./api/course');
        const courses = await res.json();
        setCourses(courses);
    }

    useEffect(() => {
        getCourses();
    }, []);

    const [addCourseFormClassName, setAddCourseFormClassName] = useState('closed');

    const switchAddCourseForm = () => {
        const newClassName: string = addCourseFormClassName === 'closed' ? 'open' : 'closed';
        setAddCourseFormClassName(newClassName);
    };

    return (
        <div>
            <h2>Courses</h2>

            <div>
                <button onClick={switchAddCourseForm}>Add a course</button>
                <AddCourseForm className={addCourseFormClassName} />
            </div>

            <ul>
                {courses.map((course: Course) => (
                    <li>{course.name}</li>
                ))}
            </ul>
        </div>
    )
}