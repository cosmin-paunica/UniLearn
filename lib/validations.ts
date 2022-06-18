import { removeDiacritics } from "./helper_functions";

export const validateAddAssignmentFormData = ({ title, description, deadline }: { title: string, description: string, deadline: string }) => {
    return (
        validateCourseOrAssignmentName(title) &&
        validateAssignmentDescription(description) &&
        (new Date(deadline)).toString() != 'Invalid date' &&
        (new Date(deadline)) > (new Date())
    )
}

const validateAcademicYear = (academicYear: string ) => {
    // check that academicYear is like "20xy-20zt"
    return /^20\d\d-20\d\d$/.test(academicYear);
}

const validateCourseOrAssignmentName = (name: string) => {
    // check that name contains only letters, digits, spaces, ".", ":", "-"
    name = removeDiacritics(name.trim());
    return /^[a-zA-Z0-9 .:-]+$/.test(name);
}

const validateAssignmentDescription = (description: string) => {
    return /^[a-zA-Z0-9 .:;-]+$/.test(description);
}

export const validateAddCourseFormData = ({ name, academicYear, year, semester }: { name: string, academicYear: string, year: number, semester: number}) => {
    return (
        validateCourseOrAssignmentName(name) &&
        validateAcademicYear(academicYear) &&
        Number.isInteger(year) &&
        year >= 0 && year <= 6 &&
        (semester == 1 || semester == 2)
    );
}

export const validateEmail = (email: string) => {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}