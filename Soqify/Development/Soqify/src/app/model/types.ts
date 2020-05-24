export interface IUser{
    uid?: string,
    auth_id?:string,
    email?:string,
    name?:string,
    tel?:string,
    geo?:string,
    comp_id?:string, // (if register under company)
    role?: UserRole, // Admin, operator, 
    provider?: string;
};


export enum UserRole{
    Admin = 1 ,
    Operator = 2,
    Content = 3
}