import { Assignment, AssignmentFileUpload } from "@prisma/client";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { localeDateToDate } from "../lib/helper_functions";
import { AssignmentWithFileUploads, SessionUser } from "../lib/types";
import styles from './AssignmentCard.module.css'
import fileDownload from 'js-file-download'

export default function AssignmentCard({ assignment, userId, userRole }: { assignment: AssignmentWithFileUploads, userId: string, userRole: string }) {

    const [file, setFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const deadlineHasPassed = (assignment.deadline) < (new Date(Date.now()));
    const deadlineClassName = (deadlineHasPassed && (assignment.fileUploads.length == 0) && userRole == "STUDENT"
        ? "errorMessage"
        : ""
    );

    const handleLocalUpload = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    }

    const handleFileSubmit = async (event: FormEvent) => {
        event.preventDefault();

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

    const handleDownload = async (event: any) => {
        axios.get(`/api/assignments/${assignment.id}/students`, {
            responseType: 'arraybuffer',
            headers: {
                'Content-Type': 'application/zip'
            }
        })
        .then((res) => {
            fileDownload(res.data, `${assignment.title}.zip`)
        });
    }

    return (
        <div className={styles.card}>
            <h3>{assignment.title}</h3>
            <div>{assignment.description}</div>
            <div className={deadlineClassName}>Deadline: {assignment.deadline.toLocaleString('ro-RO')}</div>
            
            {assignment.fileUploads.length > 0 && (
                <div>
                    <span className="successMessage">You have uploaded a file for this assignment.</span>
                    {!deadlineHasPassed && (
                        <span> You can replace it by uploading again.</span>
                    )}
                </div>
            )}

            {userRole == 'STUDENT' && !deadlineHasPassed && (
                <form onSubmit={handleFileSubmit}>
                    <input type="file" id="file" name="file" onChange={handleLocalUpload} />
                    <input type="submit" value="Upload" />
                </form>
            )}
            {uploadError && <div className="errorMessage">Error uploading file</div>}
            {uploadedFileName && <div className="successMessage">File uploaded successfully</div>}
        
            {userRole == 'PROFESSOR' && <button onClick={handleDownload}>Download student uploads</button>}
        </div>
    )
}