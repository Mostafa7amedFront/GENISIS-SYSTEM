import { IService } from "./iservice"

/* ================= Clients ================= */

export interface IClients {
  id: number; // UUID
  name: string;
  title: string;
  about: string;
  location: string;
  createdAt: string;
  websiteUrl: string;
  clientType: number;
  clientProjectStatus: number;
  imageUrl: string;
  email: string;
  userName: string;
  phoneNumber: string;
  services: IService[];
lastUnPaidPayment:IPiadedPayment
  analytics?: Analytics | null;
  employeesAssignedToClient?: EmployeeAssigned[];
  lastClientProject?: LastClientProject;
}
export interface IPiadedPayment {
  amount: number;

paymentDate:Date

}
/* ================= Response ================= */

export interface ClientRes { 
  items: Item[];
  analytics: Analytics;
}

/* ================= Item ================= */

export interface Item {
  id: number; // UUID
  name: string;
  title: string;
  about: string;
  location: string;
  createdAt: string;
  websiteUrl: string;
  clientType: number;
  clientProjectStatus: number;
  projectStatus: number;
  imageUrl: string;
  email: string;
  userName: string;
  phoneNumber?: string;

  services: Service[];
  analytics?: Analytics | null;
  employeesAssignedToClient?: EmployeeAssigned[];
  lastClientProject?: LastClientProject;

  lastUnPaidPayment?: any;
}

/* ================= Nested ================= */

export interface Service {
  id: number;
  name: string;
  createdAt: string;
}

export interface EmployeeAssigned {
  name: string;
  imageUrl: string;
}

export interface LastClientProject {
  title: string;
  description: string;
  createdAt: string;
  projectType: number;
  feedbackRate: number;
  successPercentage: number;
}

/* ================= Analytics ================= */

export interface Analytics {
  currentPeriodCount: number;
  previousPeriodCount: number;
  differenceCount: number;
  isIncreased: boolean;
}
