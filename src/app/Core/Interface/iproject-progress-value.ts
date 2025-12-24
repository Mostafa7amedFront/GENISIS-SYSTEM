export interface EmployeeResponse {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IProjectProgressValue {
  projectId: string;
  projectProgress: number;
  employeeResponse: EmployeeResponse[];
}