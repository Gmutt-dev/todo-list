// Factory function to create a new task object
export default function createTask(project, title, description, dueDate, priority) {
    const id = crypto.randomUUID();
    const isDone = false;

    return {
        id,
        linkedProjectId: project.id,
        title,
        description,
        dueDate,
        priority,
        isDone
    };

}