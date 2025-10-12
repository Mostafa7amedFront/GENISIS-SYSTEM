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
  
}
