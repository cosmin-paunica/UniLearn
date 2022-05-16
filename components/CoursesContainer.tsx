import { Course, User, UserInCourse } from "@prisma/client";
import { useEffect, useState } from "react";
import { getAllAcademicYears } from "../lib/helper_functions";
import { CourseWithUsers } from "../lib/types";
import CourseCard from "./CourseCard";

interface CoursesByAcademicYear {
    academicYear: string,
    courses: (Course & { users: (UserInCourse & { user: User })[]})[]
}

export default function CoursesContainer({ courses }: {courses: CourseWithUsers[] }) {

    const [coursesByAcademicYear, setCoursesByAcademicYear] = useState<CoursesByAcademicYear[]>([]);

    useEffect(() => {
        const coursesByAcademicYear = getAllAcademicYears(courses).sort().reverse().map((academicYear: string) => {
            return {
                academicYear,
                courses: courses.filter((course: Course) => course.academicYear === academicYear)
            };
        })
        setCoursesByAcademicYear(coursesByAcademicYear);
    }, []);

    return (
        <div>
            {coursesByAcademicYear.map(({ academicYear, courses }: CoursesByAcademicYear) => (
                <div key={academicYear}>
                    <h2>{academicYear}</h2>
                    {courses.map((course: CourseWithUsers) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            ))}
        </div>
    )
}