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

// POST: upload a file from a student to an assignment
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    // if not authenticated, respond with 401 Unauthorized
    const session = await getSession({ req });
    if (!session) {
        return res.status(401).json({ error: 'Unauthenticated' });
    }

    const assignmentId = req.query.assignmentId as string;
    const studentId = req.query.studentId as string;

    switch(req.method) {
        case('POST'):

            // if logged in user id is not the same as the user id in the query, return 403 Forbidden
            // this way, we also ensure that the user in the query exists
            if ((session.user as SessionUser).id != studentId) {
                return res.status(403).json({ error: "Unauthorized" })
            }

            // select the assignment and the user role in the parent-course of the assignment
            const assignment = await prisma.assignment.findFirst({
                where: { id: assignmentId },
                include: {
                    course: {
                        include: {
                            users: {
                                where: { userId: studentId }
                            }
                        }
                    }
                }
            });
            if (!assignment) {
                return res.status(404).json({ error: "Not found" });
            }

            if (assignment.deadline < new Date(Date.now())) {
                return res.status(400).json({ error: "Deadline has passed" });
            }

            // if the user is not a student in the course of the assignment, return 403 Forbidden
            const userRoleInCourse = assignment!.course.users[0].userRole;
            if (userRoleInCourse != 'STUDENT') {
                return res.status(403).json({ error: "Unauthorized" })
            }

            const student = await prisma.user.findFirst({
                where: { id: studentId }
            });
            // will be needed to create a name for the uploaded file
            const studentName = student!.name;
            const assignmentTitle = assignment.title;

            const form = new formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                const file = files.file as formidable.File;
                
                const extension = file.originalFilename!.split('.').pop();
                const newFilename = `${assignmentTitle}-${assignmentId.substring(0, 6)}-${studentName}-${studentId.substring(0, 6)}.${extension}`;
                file.newFilename = newFilename;
                
                await saveFile(file);

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
                    },
                    include: {
                        fileUploads: {
                            where: { assignmentId, studentId }
                        }
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
    fs.writeFileSync(`./resources/assignment_file_uploads/${file.newFilename}`, data);
    await fs.unlinkSync(file.filepath);
    return;
}
