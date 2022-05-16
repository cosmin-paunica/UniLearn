import Link from "next/link";
import { getProfessorNamesAsString } from "../lib/helper_functions";
import { CourseWithUsers } from "../lib/types";
import styles from './CourseCard.module.css'

export default function CourseCard({ course }: { course: CourseWithUsers }) {
    return (
        <div className={styles.card}>
            <Link href={`/course/${course.id}`}>
                <a>
                    <h3>{course.name}</h3>
                    {course.users.length > 0 && (
                        <div>
                            {getProfessorNamesAsString(course)}
                        </div>
                    )}
                </a>
            </Link>
        </div>
    )
}