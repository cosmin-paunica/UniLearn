import { Assignment, AssignmentFileUpload, Course, User, UserInCourse } from "@prisma/client";

export type CourseWithUsers = Course & { users: (UserInCourse & { user: User })[]};

export type CourseWithAssignments = Course & { assignments: Assignment[] }

export type CourseWithUsersAndAssignments = CourseWithUsers & CourseWithAssignments

export type SessionUser = User & { id: string }

export type AssignmentWithFileUploads = Assignment & { fileUploads: AssignmentFileUpload[] }