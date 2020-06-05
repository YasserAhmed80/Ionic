
export enum ProductSatusRef{
    New = 1,
    Active = 2,
    InActive = 3
};

export interface IProduct{
    uid?: string, //unique number
    sid:string, // supplier ID
    N: string, // name
    D?: string, //description
    P:number, //price
    dp?:number, // discount price
    Pc:number,// parent category
    Mc: number, // main category
    Sc: number, //sub category
    S:ProductSatusRef,//status (new, active,inactive)
    sa?:[number], // size attributes
    Ca?:[number], //color attribute
    Img?:[string], // product images
    min:number, // min quantity
    Max:number, //max quantity 
};