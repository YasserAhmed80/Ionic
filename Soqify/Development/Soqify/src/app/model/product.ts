
export enum ProductSatusRef{
    New = 1,
    Active = 2,
    InActive = 3
};

export interface IProduct{
    id?: string, //unique number
    sup_id:string, // supplier ID
    name: string, // name
    desc?: string, //description
    code?: string,
    price:number, //price
    price_disc?:number, // discount price
    p_cat:number,// parent category
    m_cat: number, // main category
    s_cat: number, //sub category
    status:ProductSatusRef,//status (new, active,inactive)
    sizes?:number[], // size attributes
    colors?:number[], //color attribute
    imgs?:string[], // product images
    min_qty:number, // min quantity
    max_qty:number, //max quantity 
};