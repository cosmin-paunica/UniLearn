import { Assignment } from "@prisma/client";
import { getSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { SessionUser } from "../lib/types";

export default function AssignmentCard({ assignment, userId, userRole }: { assignment: Assignment, userId: string, userRole: string }) {

    const [file, setFile] = useState<File | null>(null);

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
            
        </div>
    )
}