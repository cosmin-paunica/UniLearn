export const validateAddAssignmentFormData = ({ title, description, deadline }: { title: string, description: string, deadline: string }) => {
    return title.length > 0 &&
        description.length > 0 &&
        (new Date(deadline)) > (new Date())
}

const validateAcademicYear = (academicYear: string ) => {
    // check that academicYear is like "20xy-20zt"
    return /^20\d\d-20\d\d$/.test(academicYear)
}

export const validateAddCourseFormData = ({ name, academicYear, year, semester }: { name: string, academicYear: string, year: number, semester: number}) => {
    return name.length > 0 &&
        validateAcademicYear(academicYear) &&
        Number.isInteger(year) &&
        year >= 0 && year <= 6 &&
        (semester == 1 || semester == 2);
}