export interface IFeedbackEmployee {
  id: number;
  skillsRate: number
  qualityOfRequirementsRate: number
  meetingDeadlinesRate: number
  communicationRate: number
  overallRate: number
  questionTow: string
  questionThree: number
  dateTime: string
  projectName: string
  clientName: string
}

export interface IFeedbackClients {
  overallRate: number;
  feedbacks: IFeedbackEmployee[];


}