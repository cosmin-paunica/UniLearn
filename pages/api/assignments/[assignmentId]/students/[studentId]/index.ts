import formidable from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import  { getSession } from 'next-auth/react'
import prisma from "../../../../../../lib/prisma";
import { SessionUser } from "../../../../../../lib/types";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // if not authenticated, respond with 401 Unauthorized
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    // if user is not PROFESSOR in this course, respond with 403 Forbidden
    // const userRoleInCourse = (await prisma.userInCourse.findFirst({
    //     where: {
    //         userId: (session!.user! as SessionUser).id,
    //         courseId: req.query.courseId as string
    //     },
    //     select: {
    //         userRole: true
    //     }
    // }))?.userRole;
    // if (userRoleInCourse != 'PROFESSOR') {
    //     return res.status(403).json({ error: 'Unauthorized' })
    // }

    switch(req.method) {
        case('POST'):
            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const file = files.file as formidable.File;
                
                const extension = file.originalFilename!.split('.').pop();
                const newFilename = `${req.query.assignmentId}-${req.query.studentId}.${extension}`;
                file.newFilename = newFilename;
                
                await saveFile(file);

                const assignment = await prisma.assignment.update({
                    data: {
                        fileUploads: {
                            create: [{
                                fileName: newFilename,
                                student: {
                                    connect: { id: req.query.studentId as string }
                                }
                            }]
                        }
                    },
                    where: {
                        id: req.query.assignmentId as string
                    }
                })

                return res.status(201).json(assignment);
            })
            
            break;
        
        default:
            return res.status(405).json({ error: 'Method not allowed' });
    }
}

const saveFile = async (file: formidable.File) => {
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/assignment_file_uploads/${file.newFilename}`, data);
    await fs.unlinkSync(file.filepath);
    return;
}