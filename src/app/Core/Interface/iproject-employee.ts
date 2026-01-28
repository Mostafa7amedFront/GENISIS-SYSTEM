export interface IProjectEmployeeMini {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IMyProject {
  id: string;
  projectTitle: string;
  projectDescription: string;
  projectType: number;
  projectStatus: 0 | 1 | 2;
  projectDuration: number;
  createdAt: string;
  deadLine: string;
  clientId: string;
  clientName: string;
  clientImage: string;
  employees: IProjectEmployeeMini[];
}

export interface IMyProjectsValue {
  totalCompleted: number;
  totalInProgress: number;
  totalPaused: number;
  projects: IMyProject[];
}

export interface IApiResponse<T> {
  success: boolean;
  value: T;
}
