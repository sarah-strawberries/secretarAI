export const JobContext = {
  LegaleseSummarization: 1,
  CalendarManagement: 2,
  TaskManagement: 3,
  ScheduleGeneration: 4,
  NoteManagement: 5,
  EmailManagement: 6,
} as const;

export type JobContext = typeof JobContext[keyof typeof JobContext];
