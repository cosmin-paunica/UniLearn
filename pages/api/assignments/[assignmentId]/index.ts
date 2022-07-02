import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { SessionUser } from "../../../../lib/types";

// DELETE: delete an assignment by id
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

    const assignmentId = req.query.assignmentId as string;

    switch (req.method) {
        case('DELETE'):
            await prisma.assignment.delete({
                where: { id: assignmentId }
            });
            return res.status(200).json({ message: 'Deleted' });

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}