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

    // if not ADMIN, respond with 403 Forbidden
    if ((session!.user! as SessionUser).role.toLocaleUpperCase() != 'ADMIN') {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    const { courseId, userId, userRole } = req.query as { courseId: string, userId: string, userRole: string };
    const userRoleEnum = userRole.toLocaleUpperCase() as CourseUserRole;

    switch(req.method) {
        case('PUT'):
            const course = await prisma.course.update({
                data: {
                    users: {
                        create: [{
                            userRole: userRoleEnum,
                            user: {
                                connect: { id: userId }
                            }
                        }]
                    }
                },
                include: {
                    users: true
                },
                where: {
                    id: courseId
                }
            });
            return res.status(200).json(course);

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}