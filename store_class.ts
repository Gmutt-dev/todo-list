// Mutable in a more OOP style using classes
type ProjectId = string;
type TaskId = string;

type TaskData = {
  id: TaskId;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "normal" | "low";
};

class Task {
  constructor(
    public readonly id: TaskId,
    public title: string,
    public description: string,
    public dueDate: string,
    public priority: "high" | "normal" | "low",
  ) {}

  static create(data: Omit<TaskData, "id">): Task {
    const id = crypto.randomUUID() as TaskId;
    return new Task(
      id,
      data.title,
      data.description,
      data.dueDate,
      data.priority,
    );
  }
}

class Project {
  private tasks = new Map<TaskId, Task>();

  constructor(
    public readonly id: ProjectId,
    public name: string,
  ) {}

  static create(name: string): Project {
    const id = crypto.randomUUID() as ProjectId;
    return new Project(id, name);
  }

  upsertTask(task: Task): void {
    this.tasks.set(task.id, task);
  }

  getTask(taskId: TaskId): Task | undefined {
    return this.tasks.get(taskId);
  }

  deleteTask(taskId: TaskId): boolean {
    return this.tasks.delete(taskId);
  }

  listTasks(): Task[] {
    return Array.from(this.tasks.values());
  }
}

export class TodoStore {
  private projects = new Map<ProjectId, Project>();

  upsertProject(project: Project): void {
    this.projects.set(project.id, project);
  }

  getProject(projectId: ProjectId): Project | undefined {
    return this.projects.get(projectId);
  }

  deleteProject(projectId: ProjectId): boolean {
    return this.projects.delete(projectId);
  }

  listProjects(): Project[] {
    return Array.from(this.projects.values());
  }
}
