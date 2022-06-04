import { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../../lib/prisma'
import  { getSession } from 'next-auth/react'
import { validateAddCourseFormData } from "../../../lib/validations";
import { SessionUser } from "../../../lib/types";

// GET:     retrieves all courses, only admins authorized
// POST:    creates a new course, only admins authorized
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
    
    switch (req.method) {
        case 'GET':
            const courses = await prisma.course.findMany();
            return res.status(200).json(courses);

        case 'POST':
            const data = {
                name: req.body.name,
                academicYear: req.body.academicYear,
                year: parseInt(req.body.year),
                semester: parseInt(req.body.semester)
            };
            if (!validateAddCourseFormData) return res.status(400).json({ error: 'Invalid data' });

            const course = await prisma.course.create({ data });
            return res.status(201).json(course);

        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}
