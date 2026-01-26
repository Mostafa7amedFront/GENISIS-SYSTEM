export interface IEmployee {
  id: number;
  name: string;
  jobTitle: string;
  salary: number;
  createdAt: string;
  employeeBadge: number;
  imageUrl: string;
  email: string;
  userName: string;
  phoneNumber: number | null;
  feedback: IFeedback | null;
  projectsStats: IProjectsStats;
  bonus: number;
  deductions: number;
  totalSalary: number;
}
export interface IProjectsStats {
  totalProjectsCompleted: number;
  projectsSuccessRate: number;
}
export interface IFeedback {
  feedback: string;
  feedbackRate: number;
  createdAt: string;
}


export interface AddFeedback {
  feedback: string;
  overallPerformance: number;
  attentionToDetails: number;
}