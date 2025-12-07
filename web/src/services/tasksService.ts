import { 
  TaskListResponseDtoSchema, 
  TasksResponseDtoSchema, 
  type TaskListDto, 
  type TaskDto 
} from '../types/Task';

const API_BASE = '/api/Tasks';

export const getTaskLists = async (token: string) => {
  const response = await fetch(`${API_BASE}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch task lists');
  }

  const data = await response.json();
  return TaskListResponseDtoSchema.parse(data);
};

export const getTasksForLists = async (token: string, taskLists: TaskListDto[]) => {
  const results: Record<string, TaskDto[]> = {};

  await Promise.all(
    taskLists.map(async (list) => {
      if (!list.id) return;
      
      try {
        const response = await fetch(`${API_BASE}/lists/${list.id}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = TasksResponseDtoSchema.parse(data);
          if (parsed.items) {
            results[list.id] = parsed.items;
          }
        } else {
            console.error(`Failed to fetch tasks for list ${list.id}: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`Error fetching tasks for list ${list.id}:`, error);
      }
    })
  );

  return results;
};
