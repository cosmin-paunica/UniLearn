import { Course, User, UserInCourse } from "@prisma/client";

export function removeDiacritics(str: string) {
    return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export function getAllAcademicYears(courses: Course[]) {
    return Array.from(new Set(courses.map((course: Course) => course.academicYear)));
}

export function getProfessorNamesAsString(course: Course & {users: (UserInCourse & { user: User })[]}) {
    const names = course.users
        .filter((userInCourse: UserInCourse) => userInCourse.userRole === 'PROFESSOR')
        .map((userInCourse: UserInCourse & { user: User }) => userInCourse.user.name)
    const namesString = names.join(', ');
    const profString = names.length > 1 ? 'Profesori' : 'Profesor';
    return `${profString}: ${namesString}`
}

export function localeDateToDate(dateString: string) {
    return new Date(dateString.substring(0, 10).split('.').reverse().join('.') + dateString.substring(12));
}

export function capitalize(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}