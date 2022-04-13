import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/prisma'
import  { getSession } from 'next-auth/react'

// GET: retrieves all users, only admins authorized
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // if not authenticated, respond with 401 Unauthorized
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    // @ts-ignore
    if (session!.user!.role.toLocaleUpperCase() != 'ADMIN') {
        return res.status(404).json({ error: 'Unauthorized' });
    }
    
    switch (req.method) {
        case 'GET':
            const courses = await prisma.course.findMany();
            return res.status(200).json(courses);

        case 'POST':
            const name = req.body.name;
            const user = await prisma.course.create({
                data: { name }
            })
            return res.status(201).json(user);

        default:
            res.status(405).json({ error: 'Method not allowed' })
    }
}