export type Feedback = {
  exerciseId: string;
  completed: boolean;
  sessionId?: string;
  host?: boolean;

  question: string;
  answer: boolean;
  comment?: string;
};
