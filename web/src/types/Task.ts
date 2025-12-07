import { z } from 'zod';

export const TaskDtoSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  due: z.string().optional(),
  completed: z.string().optional(),
  deleted: z.boolean().optional(),
  hidden: z.boolean().optional(),
  parent: z.string().optional(),
  position: z.string().optional(),
  updated: z.string().optional(),
  selfLink: z.string().optional(),
  kind: z.string().optional(),
  etag: z.string().optional(),
});

export type TaskDto = z.infer<typeof TaskDtoSchema>;

export const TaskListDtoSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  updated: z.string().optional(),
  selfLink: z.string().optional(),
  kind: z.string().optional(),
  etag: z.string().optional(),
});

export type TaskListDto = z.infer<typeof TaskListDtoSchema>;

export const TaskListResponseDtoSchema = z.object({
  kind: z.string().optional(),
  etag: z.string().optional(),
  nextPageToken: z.string().optional(),
  items: z.array(TaskListDtoSchema).optional(),
});

export type TaskListResponseDto = z.infer<typeof TaskListResponseDtoSchema>;

export const TasksResponseDtoSchema = z.object({
  kind: z.string().optional(),
  etag: z.string().optional(),
  nextPageToken: z.string().optional(),
  items: z.array(TaskDtoSchema).optional(),
});

export type TasksResponseDto = z.infer<typeof TasksResponseDtoSchema>;
