import { Assignment } from "@prisma/client";
import { getSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { AssignmentWithFileUploads, SessionUser } from "../lib/types";

export default function AssignmentCard({ assignment, userId, userRole }: { assignment: Assignment, userId: string, userRole: string }) {

    const [file, setFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const handleLocalUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    const handleFileSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement;

        const body = new FormData();
        body.append("file", file!, file?.name);
        const res = await fetch(`/api/assignments/${assignment.id}/students/${userId}`, {
            method: "POST",
            body
        });
        const data = await res.json();

        if (data.error) {
            setUploadedFileName(null);
            setUploadError(data.error);
        } else {
            setUploadError(null);
            setUploadedFileName((data as AssignmentWithFileUploads).fileUploads[0].fileName);
        }
    }

    return (
        <div>
            <h3>{assignment.title}</h3>
            <div>{assignment.description}</div>
            <div>Deadline: {assignment.deadline}</div>
            {userRole == 'STUDENT' && (
                <form onSubmit={handleFileSubmit}>
                    <input type="file" id="file" name="file" onChange={handleLocalUpload} />
                    <input type="submit" value="Upload" />
                </form>
            )}
            {uploadError && <div className="errorMessage">Error uploading file</div>}
            {uploadedFileName && <div className="successMessage">File uploaded successfully</div>}
        </div>
    )
}