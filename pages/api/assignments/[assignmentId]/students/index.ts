import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import fs from 'fs';
import { Assignment, AssignmentFileUpload } from "@prisma/client";
import archiver from 'archiver'
import { getSession } from "next-auth/react";
import { SessionUser } from "../../../../../lib/types";

// GET: return all files uploaded by students as a zip archive 
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
    
    const assignment = await prisma.assignment.findUnique({
        where: { id: assignmentId },
        include: {
            fileUploads: true
        }
    })

    if (!assignment) {
        return res.status(404).json({ error: 'Not found '});
    }

    switch(req.method) {
        case('GET'):

            const fileNames = assignment.fileUploads.map((fileUpload: AssignmentFileUpload) => fileUpload.fileName);

            const archivePath = `./resources/assignment_archives/${assignmentId}.zip`;
            const archiveOutput = await createArchive(archivePath, fileNames);
            
            archiveOutput.on('close', () => {
                const archiveReadStream = fs.createReadStream(archivePath);

                res.writeHead(200, {
                    'Content-Type': 'application/zip',
                    'Content-Disposition': `attachment; filename=${assignment.title}.zip`
                });
    
                archiveReadStream.pipe(res);
            })
            
    }
}

const createArchive = async (archivePath: string, fileNames: string[]) => {
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip');

    archive.pipe(output);
    
    fileNames.forEach((fileName: string) => {
        archive.file(`./resources/assignment_file_uploads/${fileName}`, { name: fileName })
    });

    archive.finalize();

    return output;
}
