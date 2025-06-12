// Factory function to create a new task object
export default function createTask(projectId = "default", title, description, dueDate, priority) {
    const id = crypto.randomUUID();
    const isDone = false;

    return {
        id,
        linkedProjectId: projectId,
        title,
        description,
        dueDate,
        priority,
        isDone
    };

}