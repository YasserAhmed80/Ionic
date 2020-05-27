// this file include products master data like category (parent, main and sub).

// Parent Category
export interface IParent_cat{
    key:number,
    seq:number,
    name: string,
    lang_cde:number //1:arabic, 2:english
}

export const parent_cat: IParent_cat[] = [
         { key: 1, seq: 1, name: "ازياء" ,lang_cde: 1},
         { key: 2, seq: 2, name: "إلكترونيات" ,lang_cde: 1},
         { key: 3, seq: 3, name: "موبايلات وتابلت" ,lang_cde: 1},
         { key: 4, seq: 4, name: "بقالة" ,lang_cde: 1},
         { key: 5, seq: 5, name: "أدوات منزليه" ,lang_cde: 1}
       ];
 
// Main Category 
export interface IMain_cat{
    key:number,
    p_cde:number,
    seq:number,
    name: string,
    lang_cde:number //1:arabic, 2:english
}
export const main_cat: IMain_cat[] = [
         { key: 1, p_cde: 1, seq: 1, name: "ازياء حريمي" ,lang_cde: 1},
         { key: 2, p_cde: 1, seq: 2, name: "ازياء رجالى" ,lang_cde: 1},
         { key: 3, p_cde: 1, seq: 3, name: "ازياء الاطفال" ,lang_cde: 1},
         { key: 4, p_cde: 2, seq: 4, name: "تلفزيونات" ,lang_cde: 1},
         { key: 5, p_cde: 2, seq: 5, name: "أجهزة الكمبيوتر المحمولة" ,lang_cde: 1},
         { key: 6, p_cde: 2, seq: 6, name: "كاميرات" ,lang_cde: 1},
         { key: 7, p_cde: 2, seq: 7, name: "أجهزة الصوت" ,lang_cde: 1},
         { key: 8, p_cde: 2, seq: 8, name: "مستلزمات الكمبيوتر" ,lang_cde: 1},
         { key: 9, p_cde: 2, seq: 9, name: "ألعاب الفيديو" ,lang_cde: 1},
         { key: 10, p_cde: 3, seq: 10, name: "موبيلات" ,lang_cde: 1},
         { key: 11, p_cde: 3, seq: 11, name: "أجهزة تابلت" ,lang_cde: 1},
         { key: 12, p_cde: 4, seq: 12, name: "مشروبات" ,lang_cde: 1},
         { key: 13, p_cde: 4, seq: 13, name: "أغذية وبقالة" ,lang_cde: 1},
         { key: 14, p_cde: 4, seq: 14, name: "العناية الشخصية" ,lang_cde: 1},
         { key: 15, p_cde: 4, seq: 15, name: "العنايه بالمنزل" ,lang_cde: 1},
         { key: 16, p_cde: 4, seq: 16, name: "مستلزمات الاطفال" ,lang_cde: 1},
         { key: 17, p_cde: 4, seq: 17, name: "العنايه بالرجال" ,lang_cde: 1},
         { key: 18, p_cde: 4, seq: 18, name: "مستلزمات الحيوانات الاليفه" ,lang_cde: 1},
         { key: 19, p_cde: 5, seq: 19, name: "الأجهزة المنزلية" ,lang_cde: 1},
         { key: 20, p_cde: 5, seq: 20, name: "أدوات الطهي" ,lang_cde: 1},
         { key: 21, p_cde: 5, seq: 21, name: "أدوات الشرب" ,lang_cde: 1},
         { key: 22, p_cde: 5, seq: 22, name: "الحمامات" ,lang_cde: 1},
         { key: 23, p_cde: 5, seq: 23, name: "مستلزمات السرير" ,lang_cde: 1},
         { key: 24, p_cde: 5, seq: 24, name: "الأثاث" ,lang_cde: 1},
         { key: 25, p_cde: 5, seq: 25, name: "ديكورات المنازل" ,lang_cde: 1},
       ];

// Sub-gategory
export interface ISub_cat{
    key:number,
    m_cde:number,
    seq:number,
    name: string,
    lang_cde:number, //1:arabic, 2:english
}
export const sub_cat: ISub_cat[] = [
         { key: 1, m_cde: 1, seq: 1, name: "ملابس حريمي" ,lang_cde: 1},
         { key: 2, m_cde: 1, seq: 2, name: "أحذية حريمي" ,lang_cde: 1},
         { key: 3, m_cde: 1, seq: 3, name: "شنط حريمي" ,lang_cde: 1},
         { key: 4, m_cde: 2, seq: 4, name: "ملابس رجالي" ,lang_cde: 1},
         { key: 5, m_cde: 2, seq: 5, name: "أحذية رجالي" ,lang_cde: 1},
         { key: 6, m_cde: 3, seq: 6, name: "ملابس بنات" ,lang_cde: 1},
         { key: 7, m_cde: 3, seq: 7, name: "ملابس أولاد" ,lang_cde: 1},
         { key: 8, m_cde: 3, seq: 8, name: "احذية بنات" ,lang_cde: 1},
         { key: 9, m_cde: 3, seq: 9, name: "احذية أولاد" ,lang_cde: 1},
         { key: 10, m_cde: 3, seq: 10, name: "ملابس حيثي الولادة" ,lang_cde: 1},
       ];


       // Parent Category
export interface IBusiness_type{
    key:number,
    seq:number,
    name: string,
    lang_cde:number //1:arabic, 2:english
}

export const business_type: IBusiness_type[] = [
         { key: 1, seq: 1, name: "محل" ,lang_cde: 1},
         { key: 2, seq: 2, name: "تاجر جملة" ,lang_cde: 1},
         { key: 3, seq: 3, name: "مصنع" ,lang_cde: 1},
         { key: 4, seq: 4, name: "فردي" ,lang_cde: 1},
       ];