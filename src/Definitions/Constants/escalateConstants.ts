export const PER_PAGE_COST = 100;
export const PER_MINUTE_COST = 25;

export enum EscalationStatus {
  UNASSIGNED = "UNASSIGNED",
  RESOLVED = "RESOLVED",
  INPROGRESS = "IN_PROGRESS",
  ASSIGNED = "ASSIGNED",
}

export enum ServiceType {
  AFC = "AFC",
  VC = "VC",
}
