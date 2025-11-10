export interface IDecode {
   name: string;       
  email: string;   
  role?: string;    
  exp: number;        // expiry time

}
export interface ILogin{
    id: string
  email: string
  username: string
  role:string,
  token: string
  expiresIn: number
  refreshToken: string
  refreshTokenExpiration: string
}