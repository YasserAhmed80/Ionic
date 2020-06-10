
export enum ProductSatusRef{
    New = 1,
    Active = 2,
    InActive = 3
};

export interface IProduct{
    id?: string, //unique number
    sid:string, // supplier ID
    n: string, // name
    d?: string, //description
    cde?: string,
    p:number, //price
    dp?:number, // discount price
    pc:number,// parent category
    mc: number, // main category
    sc: number, //sub category
    s:ProductSatusRef,//status (new, active,inactive)
    sa?:number[], // size attributes
    ca?:number[], //color attribute
    imgs?:number[], // product images
    min:number, // min quantity
    max:number, //max quantity 
};