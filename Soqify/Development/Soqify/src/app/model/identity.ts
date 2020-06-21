export interface IGeoLocation{
    latitude: number,
    longitude: number
}

export enum UserRoleRef{
    Admin = 1 ,
    Operator = 2,
    Content = 3
}

export enum UserTypeRef{
    Supplier = 1 ,
    Customer = 2,
    Agent = 3
}


export interface IUser{
    id?: string,
    auth_id?:string,
    email?:string,
    name?:string,
    type?: UserTypeRef, // 1= supplier, 2 = customer, 3= agent
    mob?:string,
    tel_o?:string,
    comp_id?:string, // (if register under company)
    role?: UserRoleRef, // Admin, operator, 
    provider?: string;
    // address
    cntry?:number, //countery
    gov?:number, //governate
    cty?:number, // city
    addr?:string, // address
    loc?:IGeoLocation, //geolocation
    // business data
    bus_type?:number, // business type (individual, company, ..)
    bus_sec?:number[], // business sections (clothes, fashion, elec.)
    active_ind?: number, // 1=active, 0 = inactive
    createdAt?:any,

};


