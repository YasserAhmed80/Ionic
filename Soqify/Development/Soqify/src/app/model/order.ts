export interface IOrder{
    id?:string,
    sup_id:string, // supplier ID
    cus_id:string, // customer ID
    cdate?: any, // created date
    ddate?: any, // delivery date,
    status:number, // order status,
    qty: number, // sum of items
    count:number, // number of items
    sum: number, // order sum (qty * price)
    items?:IOrderItem[],
};

export interface IOrderItem{
    id?:string,
    pro_id:string,
    qty:number,
    price:number,
    color:number,
    size:number,
    pro_name:string, // not saved in DB
    img?:string,
}

export interface IOrderDetail extends IOrder{
    sup_name?:string,
    cus_name?:string,
    items?: IOrderItemDetail[],
}

export interface IOrderItemDetail extends IOrderItem{
    
}
