// Mutable using Maps
type ProjectId = string;
type TaskId = string;

type Task = {
  id: TaskId;
  title: string;
  description: string;
  dueDate: string;
  priority: "high" | "normal" | "low";
};

type Project = {
  id: ProjectId;
  name: string;
  tasks: Map<TaskId, Task>;
};

type State = Map<ProjectId, Project>;

const applicationsState: State = new Map();

// PROJECTS

// Factory function - use at call site and pass to upsert
export const createProject = (name: string): Project => {
  const id = crypto.randomUUID() as ProjectId;
  return {
    id,
    name,
    tasks: new Map(),
  };
};

// Handles created and update
export const upsertProject = (project: Project): void => {
  applicationsState.set(project.id, {
    ...project,
    tasks: new Map(project.tasks),
  });
};

export const listProjects = (): Project[] => {
  return Array.from(applicationsState.values());
};

export const getProject = (projectId: ProjectId): Project | undefined => {
  return applicationsState.get(projectId);
};

export const deleteProject = (projectId: ProjectId): boolean => {
  return applicationsState.delete(projectId);
};

// TASKS
export const getTask = (
  projectId: ProjectId,
  taskId: TaskId,
): Task | undefined => {
  return applicationsState.get(projectId)?.tasks.get(taskId);
};

// Factory function - use at call site and pass to upsert
export const createTask = (task: Omit<Task, "id">): Task => {
  const id = crypto.randomUUID() as TaskId;
  return {
    id,
    ...task,
  };
};

// Handles create and update
export const upsertTask = (projectId: ProjectId, task: Task): boolean => {
  const project = applicationsState.get(projectId);
  if (!project) return false;
  project.tasks.set(task.id, task);
  return true;
};

export const deleteTask = (projectId: ProjectId, taskId: TaskId): boolean => {
  return applicationsState.get(projectId)?.tasks.delete(taskId) ?? false;
};

export const listTasks = (projectId: ProjectId): Task[] => {
  const project = applicationsState.get(projectId);
  return project ? Array.from(project.tasks.values()) : [];
};
