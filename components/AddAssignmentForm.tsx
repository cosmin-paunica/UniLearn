import { FormEvent } from "react"

export default function AddAssignmentForm(props: { courseId: string }) {
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const targetElement = event.target as HTMLFormElement;

        const res = await fetch(`/api/courses/${props.courseId}/assignments`, {
            method: 'POST',
            body: JSON.stringify({
                // @ts-ignore
                title: targetElement.title.value,
                description: targetElement.description.value,
                deadline: targetElement.deadline.value
            }),
            headers: { 'Content-Type': 'application/json' }
        })
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
        </>
    )
}