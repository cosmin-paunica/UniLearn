import { FormEvent, useState } from "react"
import { validateAddAssignmentFormData } from "../lib/validations";

export default function AddAssignmentForm(props: { courseId: string }) {

    const [invalidData, setInvalidData] = useState(false);
    const [addedAssignmentTitle, setAddedAssignmentTitle] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement;

        try {
            const formData = {
                // @ts-ignore
                title: targetElement.title.value.trim(),
                description: targetElement.description.value.trim(),
                deadline: targetElement.deadline.value.trim()
            }
    
            if (!validateAddAssignmentFormData(formData)) {
                throw new Error('Invalid data');
            }
    
            const res = await fetch(`/api/courses/${props.courseId}/assignments`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            if (data.error) {
                throw new Error('Invalid data');
            }
            setAddedAssignmentTitle(data.title);
        } catch {
            setAddedAssignmentTitle(null);
            setInvalidData(true);
        }
        
    }
    
    return (
        <>
            <h3>Add an assignment</h3>
            <form id="addAssignmentForm" onSubmit={handleSubmit}>
                <table>
                    <tbody>
                        <tr>
                            <td><label htmlFor="atitle">Title</label></td>
                            <td><input type="text" id="title" name="title" /></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="description">Descripton</label></td>
                            <td><textarea id="description" name="description" form="addAssignmentForm"></textarea></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="deadline">Deadline</label></td>
                            <td><input type="datetime-local" step="1" id="deadline" name="deadline" /></td>
                        </tr>
                        <tr>
                            <td colSpan={2}><input type='submit' /></td>
                        </tr>
                    </tbody>
                </table>
            </form>
            {addedAssignmentTitle && <div className="successMessage">Successfully added assignment: {addedAssignmentTitle}</div>}
            {invalidData && <div className="errorMessage">Invalid data</div>}
        </>
    )
}