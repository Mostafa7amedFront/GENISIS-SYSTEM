import { IService } from "./iservice"

export interface IClients {
  id: number
  name: string
  title: string
  about: string
  location: string
  createdAt: string
  websiteUrl: string
  clientType: number
  imageUrl: string
  email: string
  userName: string
  services: IService[]
  phoneNumber: number
  clientProjectStatus: number
  
}
export interface ClientRes{ 
   items: Item[]
  analytics: Analytics
}

export interface Item {
  id: number
  name: string
  title: string
  about: string
  location: string
  createdAt: string
  websiteUrl: string
  clientType: number
  imageUrl: string
  email: string
  userName: string
  phoneNumber?: string
  services: Service[]
  lastUnPaidPayment: any
}

export interface Service {
  id: string
  name: string
  createdAt: string
}

export interface Analytics {
  currentPeriodCount: number
  previousPeriodCount: number
  differenceCount: number
  isIncreased: boolean
}
