import { NextApiRequest, NextApiResponse } from "next";
import  { getSession } from 'next-auth/react'
import prisma from "../../../../../lib/prisma";
import { CourseUserRole } from "@prisma/client";
import { SessionUser } from "../../../../../lib/types";

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
            const assignment = await prisma.assignment.create({
                data: {
                    courseId: req.query.courseId as string,
                    title: req.query.title as string,
                    description: req.query.title as string,
                    deadline: req.query.deadline as string  // TODO: MODIFICAAAAAAAA STRING
                }
            })
            return res.status(201).json(assignment);

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}