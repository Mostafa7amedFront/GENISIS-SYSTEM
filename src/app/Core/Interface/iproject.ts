export interface IProject {
    id:                 string;
    projectTitle:       string;
    projectDescription: string;
    clientName:         string;
    clientImage:        string;
    projectStatus:      number;
    deadLine:           Date;
    createdAt:          Date;
    employees:          Employee[];
    notes:              Note[];
    attachments:        Attachment[];
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
