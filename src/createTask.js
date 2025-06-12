// Factory function to create a new task object
export default function createTask(linkedProject, title, description, dueDate, priority) {
    const id = crypto.randomUUID();
    const isDone = false;

    return {
        id,
        linkedProjectId: linkedProject.id,
        title,
        description,
        dueDate,
        priority,
        isDone
    };

}