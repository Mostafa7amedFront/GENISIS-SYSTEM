export interface IProject {
    id:                 any;
    month:number;
        projectPayment:     number;
    projectFeedBack:    number;
    projectDuration:    number;
    projectTitle:       string;
    projectDescription: string;
    clientName:         string;
    clientImage:        string;
    projectStatus:      number;
    clientAbout:       string;
    deadLine:           Date;
    clientId:           string;
    createdAt:          Date;
    projectType:number;
    employees:          Employee[];
    notes:              Note[];
    attachments:        Attachment[];
    projectAttachment:string[];
}
export interface GetAllProjectsStats{
  completed: number
  paused: number
  inProgress: number
  totalCompletedAllTime: number
  successRate: number
}

export interface Attachment {
    fileUrl: string;
}

export interface Employee {
    id:       string;
    name:     string;
    imageUrl: string;
}

export interface Note {
        id:       number
  isCompleted: boolean
  isFav: boolean
  noteContent: string
}
export interface NoteReq {
  id: string;
  noteContent: string;
  isFav: boolean;
  isCompleted: boolean;
}
export interface IEmployeeMini {
  id: string;
  name: string;
  imageUrl: string;
}

export interface IProject {
  projectTitle: string;
  projectDescription: string;
  projectType: number;
  projectStatus: number;
  projectDuration: number;
  clientId: string;
  clientName: string;
  clientImage: string;
  employees: IEmployeeMini[];
}

export interface Analytics {
  currentPeriodCount: number;
  previousPeriodCount: number;
  differenceCount: number;
  isIncreased: boolean;
}

export interface ProjectsValue {
  items: IProject[];
  analytics: Analytics;
}
export interface SubmissionAttachment {
  id: string;
  fileUrl: string;
  status: number; // backend: 0/1/2...
}

export interface Submission {
  id: string;
  userName: string;
  userImage: string;
  submittedAt: string; // ISO
  quality: number | null;
  comment: string | null;
  attachments: SubmissionAttachment[];
}

export interface UpdateSubmissionPayload {
  comment: string;
  quality: number;
  attachments: { id: string; status: number }[];
}