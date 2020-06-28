export interface IOrder{
    id?:string,
    sup_id:string, // supplier ID
    cus_id:string, // customer ID
    cdate: Date, // created date
    ddate?: Date, // delivery date,
    status:number, // order status,
    qty: number, // count of items
    sum: number, // order sum (qty * price)
    items?: IOrderItem[]
};

export interface IOrderItem{
    id?:string,
    pro_id:string,
    qty:number,
    price:number,
    color:number,
    size:number,
    pro_name:string, // not saved in DB
}
