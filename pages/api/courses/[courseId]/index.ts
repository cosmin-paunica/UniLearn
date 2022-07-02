import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import { SessionUser } from "../../../../lib/types";

// DELETE: delete course by id
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

    const courseId = req.query.courseId as string;

    switch(req.method) {
        case ('DELETE'):
            await prisma.course.delete({
                where: { id: courseId }
            });
            return res.status(200).json({ message: 'Deleted' })

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}