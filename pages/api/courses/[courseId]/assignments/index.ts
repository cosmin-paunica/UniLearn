import { NextApiRequest, NextApiResponse } from "next";
import  { getSession } from 'next-auth/react'
import prisma from "../../../../../lib/prisma";
import { SessionUser } from "../../../../../lib/types";
import { validateAddAssignmentFormData } from "../../../../../lib/validations";

// GET: returns all assignments for a course
// POST: create a new assignment for a course
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // if not authenticated, respond with 401 Unauthorized
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    // if user is not PROFESSOR in this course, respond with 403 Forbidden
    const userRoleInCourse = (await prisma.userInCourse.findFirst({
        where: {
            userId: (session!.user! as SessionUser).id,
            courseId: req.query.courseId as string
        },
        select: {
            userRole: true
        }
    }))?.userRole;
    if (userRoleInCourse != 'PROFESSOR') {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    switch(req.method) {
        case('GET'):
            const assignments = await prisma.assignment.findMany();
            return res.status(200).json(assignments);

        case('POST'):
            const dataToValidate = {
                title: req.body.title as string,
                description: req.body.description as string,
                deadline: req.body.deadline as string
            }

            if (!validateAddAssignmentFormData(dataToValidate)) {
                return res.status(400).json({ error: 'Invalid data' })
            }

            const assignment = await prisma.assignment.create({
                data: {
                    courseId: req.query.courseId as string,
                    title: req.body.title as string,
                    description: req.body.description as string,
                    deadline: new Date(req.body.deadline as string)
                }
            })
            return res.status(201).json(assignment);

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}