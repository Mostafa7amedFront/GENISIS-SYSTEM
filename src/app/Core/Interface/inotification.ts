export interface INotification {
  id: string;
  typeId: string;
  userId: string;
  projectId: string;
  type: number;
  title: string;
  createAt: string;
  isRead: boolean;
  data: {
    clientName: string;
    meetingDate: string;
    meetingTime: number;

  };
}

