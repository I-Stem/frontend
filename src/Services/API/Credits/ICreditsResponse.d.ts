export interface ICreditTransaction {
  reason: string;
  credited: number;
  debited: number;
  createdAt: string;
}

export interface ICreditsData {
  totalCredits: number;
  transactions?: ICreditTransaction[];
}

export interface ICreditsResponse {
  flag: string;
  message: string;
  data?: ICreditsData;
  code: number;
  error?: string;
}

export interface FeedbackData{
  rating: number;
  feedbackFor: string | string[];
  purpose: string;
  likings: string;
  dislikings: string;
  creditsRequested: number;
}

export interface FeedbackResponse{
  flag: string;
  message: string;
  data?: FeedbackData;
  code: number;
  erroe?: string;
}

export interface FeedbackFlagsData{
  afcServiceUsed: boolean;
  vcServiceUsed: boolean;
  vcCustomModelServiceUsed: boolean;
  afcEscalated: boolean;
  vcEscalated: boolean;
  afcFeedbackProvided: number;
  vcStandardFeedbackProvided: number;
  afcEscalateFeedbackProvided: number;
  vcCustomFeedbackProvided: number;
  vcEscalateFeedbackProvided: number;
}

export interface FeedbackFlagsResponse {
  flag: string;
  message: string;
  data?: FeedbackFlagsData;
  code: number;
  error?: string;
}