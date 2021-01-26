export const STATUS_INITIATED = 0;
export const STATUS_IN_PROGRESS = 1;
export const STATUS_COMPLETED = 2;
export const STATUS_FAILED = 3;
export const STATUS_ESCALATED = 4;
export const STATUS_ESCALATED_RESOLVED = 5;
export const STATUS_RETRIED = 6;

export const STATUS_MAP: { [index: number]: string } = {
  "0": "Initiated",
  "1": "In Progress",
  "2": "Completed",
  "3": "Failed",
  "4": "Escalated",
  "5": "Escalation Resolved",
  "6": "Retried",
};

export const STATUS_CLASS_MAP: { [index: string]: string } = {
  Initiated: "tag-bg",
  "In Progress": "tag-bg progress-tag",
  Completed: "tag-bg completed-tag",
  Failed: "tag-bg failed-tag",
  Escalated: "tag-bg escalated-tag",
  Retried: "tag-bg failed-tag",
};
