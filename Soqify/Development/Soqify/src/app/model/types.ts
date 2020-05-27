export interface IUser{
    uid?: string,
    auth_id?:string,
    email?:string,
    name?:string,
    mob?:string,
    tel_o?:string,
    comp_id?:string, // (if register under company)
    role?: UserRole, // Admin, operator, 
    provider?: string;
    // address
    cntry?:number, //countery
    gov?:number, //governate
    cty?:number, // city
    addr?:string, // address
    loc?:Geolocation, //geolocation
    // business data
    bus_type?:number, // business type (individual, shop, ..)
    bus_sec?:number[], // business sections (clothes, fashion, elec.)


};


export enum UserRole{
    Admin = 1 ,
    Operator = 2,
    Content = 3
}