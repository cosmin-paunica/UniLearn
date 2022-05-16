import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ error: 'Unauthenticated' })
    // }

    const userId = req.query.userId as string;
    // @ts-ignore
    // if (session.user!.id !== userId && session.user!.role.toLocaleUpperCase() !== 'ADMIN') {
        // return res.status(403).json({ error: 'Unauthorized' })
    // }

    switch (req.method) {
        case 'GET':
            const data = await prisma.userInCourse.findMany({
                where: { userId },
                include: { course: true }
            });
            return res.status(200).json(data);

        default:
            return res.status(405).json({ error: 'Method not allowed' })
    }
}