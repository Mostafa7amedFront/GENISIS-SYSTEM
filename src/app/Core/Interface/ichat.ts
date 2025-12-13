export interface IChatAttachment {
  id: string;
  attachmentUrl: string;
}

export interface IChatMessage {
  id: string;
  message: string;
  relativeDateString: string | null;
  sentAt: string;
  projectId: string;
  userId: string;
  userName: string;
  attachments: IChatAttachment[];
}
export interface IChatLink {
  id: string;
  sentAt: string;
  link: string;
  username: string;
  userImageUrl:string
}
export interface IChatAttachmentMessages {
  messageId: string
  senderName: string
  sentAt: string
  files: File[]
}

export interface File {
  id: string
  fileUrl: string
}
export interface IChatDayGroup {
  date: string;
  relativeDateString: string;
  chats: IChatMessage[];
}

export interface IChatResponse {
  success: boolean;
  value: {
    items: IChatDayGroup[];
    nextPageNumber: number | null;
  };
}
