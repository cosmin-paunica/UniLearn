import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../lib/prisma";
import fs from 'fs';
import { Assignment, AssignmentFileUpload } from "@prisma/client";
import archiver from 'archiver'

// GET: return all files uploaded by students as a zip archive 
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

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
            createArchive(archivePath, fileNames);
            
            const archiveReadStream = fs.createReadStream(archivePath);

            res.writeHead(200, {
                'Content-Type': 'application/zip',
                'Content-Disposition': `attachment; filename=${assignment.title}.zip`
            });

            archiveReadStream.pipe(res);
    }
}

const createArchive = (archivePath: string, fileNames: string[]) => {
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('zip');

    archive.pipe(output);
    
    fileNames.forEach((fileName: string) => {
        archive.file(`./resources/assignment_file_uploads/${fileName}`, { name: fileName })
    });

    archive.finalize();
    // await new Promise((resolve) => setTimeout(resolve, 5000));
}