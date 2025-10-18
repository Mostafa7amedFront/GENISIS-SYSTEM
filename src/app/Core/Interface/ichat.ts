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
