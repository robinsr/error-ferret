export interface FeedbackItem {
  line: number;
  column: number;
  snippet: string;
  feedback: string;
}


export interface FeedbackResponse {
  feedbackItems: FeedbackItem[];
  language: string;
  focus: string;
  timestamp: string;
}

export interface LLMResponseItem {
  line: number;
  column: number;
  feedback: string;
}