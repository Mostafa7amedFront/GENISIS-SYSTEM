export interface IEmployee {
      id: number,
  name: string
  jobTitle: string
  salary: number
  employeeBadge: number
  imageUrl: string
  email: string
    createdAt: string

  userName: string
      feedback :IFeedback

}
export interface IFeedback {
  feedback: string;
  rate: number;
  createdAt: Date;
}