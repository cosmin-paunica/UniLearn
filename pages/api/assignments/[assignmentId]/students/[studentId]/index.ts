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

    switch(req.method) {
        case('POST'):

            // if the user is not a student in the course of the assignment, return 403 Forbidden
            const assignment = await prisma.assignment.findFirst({
                where: { id: req.query.assignmentId as string },
                include: {
                    course: {
                        include: {
                            users: {
                                where: { userId: req.query.userId as string }
                            }
                        }
                    }
                }
            });
            const userRoleInCourse = assignment?.course.users[0].userRole;
            if (!userRoleInCourse || userRoleInCourse != 'STUDENT') {
                return res.status(403).json({ error: "Unauthorized" })
            }

            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const file = files.file as formidable.File;
                
                const extension = file.originalFilename!.split('.').pop();
                const newFilename = `${req.query.assignmentId}-${req.query.studentId}.${extension}`;
                file.newFilename = newFilename;
                
                await saveFile(file);

                const assignmentId = req.query.assignmentId as string;
                const studentId = req.query.studentId as string;
                const assignment = await prisma.assignment.update({
                    data: {
                        fileUploads: {
                            upsert: {
                                where: {
                                    assignmentId_studentId: { assignmentId, studentId }
                                },
                                create: {
                                    fileName: newFilename,
                                    student: {
                                        connect: { id: studentId }
                                    }
                                },
                                update: {
                                    fileName: newFilename
                                }
                            }
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