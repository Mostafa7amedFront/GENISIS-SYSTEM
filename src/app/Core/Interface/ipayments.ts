export interface IPayments {
  id:number
  amount: number
  paymentDate: Date
  isPaid: boolean
  projectName: string
  dateTime:Date
  clientName:string
  isLate: boolean
}
