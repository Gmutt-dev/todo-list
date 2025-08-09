// Immutable example as a simple record
type ProjectId = string;
type TaskId = string;

type Task = {
  readonly id: TaskId;
  readonly title: string;
  readonly description: string;
  readonly dueDate: string;
  readonly priority: "high" | "normal" | "low";
};

type Project = {
  readonly id: ProjectId;
  readonly name: string;
  readonly tasks: readonly Task[];
};

type State = {
  readonly projects: readonly Project[];
};

// Use a function closure to make private state (similar to how a class does)
export const createTodoStore = (initialState: State = { projects: [] }) => {
  // Not techincally fully immutable because this value is mutated,
  // but any time this is changed it is fully replaced so the result is the same.
  //
  // Alternatively you could make the below functions pure (i.e. fully deterministic, no effects) by parameterising state,
  // but that just kicks the can up the road as that value will need to be passed from somewhere
  let state = initialState;

  const createTask = (data: Omit<Task, "id">): Task => ({
    id: crypto.randomUUID() as TaskId,
    ...data,
  });

  const createProject = (name: string): Project => ({
    id: crypto.randomUUID() as ProjectId,
    name,
    tasks: [],
  });

  const upsertProject = (project: Project): void => {
    const existingIndex = state.projects.findIndex((p) => p.id === project.id);
    state = {
      projects:
        existingIndex >= 0
          ? state.projects.map((p, i) => (i === existingIndex ? project : p))
          : [...state.projects, project],
    };
  };

  const getProject = (projectId: ProjectId): Project | undefined =>
    state.projects.find((p) => p.id === projectId);

  const deleteProject = (projectId: ProjectId): void => {
    state = {
      projects: state.projects.filter((p) => p.id !== projectId),
    };
  };

  const listProjects = (): readonly Project[] => state.projects;

  const upsertTask = (projectId: ProjectId, task: Task): void => {
    const project = getProject(projectId);
    if (!project) return;

    const existingIndex = project.tasks.findIndex((t) => t.id === task.id);
    const updatedTasks =
      existingIndex >= 0
        ? project.tasks.map((t, i) => (i === existingIndex ? task : t))
        : [...project.tasks, task];

    upsertProject({ ...project, tasks: updatedTasks });
  };

  const getTask = (projectId: ProjectId, taskId: TaskId): Task | undefined =>
    getProject(projectId)?.tasks.find((t) => t.id === taskId);

  const deleteTask = (projectId: ProjectId, taskId: TaskId): void => {
    const project = getProject(projectId);
    if (!project) return;

    upsertProject({
      ...project,
      tasks: project.tasks.filter((t) => t.id !== taskId),
    });
  };

  const listTasks = (projectId: ProjectId): readonly Task[] =>
    getProject(projectId)?.tasks ?? [];

  return {
    createTask,
    createProject,
    upsertProject,
    getProject,
    deleteProject,
    listProjects,
    upsertTask,
    getTask,
    deleteTask,
    listTasks,
  };
};
