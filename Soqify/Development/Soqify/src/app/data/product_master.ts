// this file include products master data like category (parent, main and sub).

// Parent Category
export interface IParent_cat{
    p_key:number,
    seq:number,
    p_name: string
}

export const parent_cat: IParent_cat[] = [
    {p_key:1,seq:1,p_name:'ازياء'},
    {p_key:2,seq:2,p_name:'إلكترونيات'},
    {p_key:3,seq:3,p_name:'موبايلات وتابلت'},
    {p_key:4,seq:4,p_name:'بقالة'},
    {p_key:5,seq:5,p_name:'أدوات منزليه'}
]

// Main Category 
export interface IMain_cat{
    m_key:number,
    p_cde:number,
    seq:number,
    m_name: string
}
export const main_cat:IMain_cat[] =[
    {m_key:1,p_cde:1,seq:1,m_name:'ازياء حريمي'},
    {m_key:2,p_cde:1,seq:2,m_name:'ازياء رجالى'},
    {m_key:3,p_cde:1,seq:3,m_name:'ازياء الاطفال'},
    {m_key:4,p_cde:2,seq:4,m_name:'تلفزيونات'},
    {m_key:5,p_cde:2,seq:5,m_name:'أجهزة الكمبيوتر المحمولة'},
    {m_key:6,p_cde:2,seq:6,m_name:'كاميرات'},
    {m_key:7,p_cde:2,seq:7,m_name:'أجهزة الصوت'},
    {m_key:8,p_cde:2,seq:8,m_name:'مستلزمات الكمبيوتر'},
    {m_key:9,p_cde:2,seq:9,m_name:'ألعاب الفيديو'},
    {m_key:10,p_cde:3,seq:10,m_name:'موبيلات'},
    {m_key:11,p_cde:3,seq:11,m_name:'أجهزة تابلت'},
    {m_key:12,p_cde:4,seq:12,m_name:'مشروبات'},
    {m_key:13,p_cde:4,seq:13,m_name:'أغذية وبقالة'},
    {m_key:14,p_cde:4,seq:14,m_name:'العناية الشخصية'},
    {m_key:15,p_cde:4,seq:15,m_name:'العنايه بالمنزل'},
    {m_key:16,p_cde:4,seq:16,m_name:'مستلزمات الاطفال'},
    {m_key:17,p_cde:4,seq:17,m_name:'العنايه بالرجال'},
    {m_key:18,p_cde:4,seq:18,m_name:'مستلزمات الحيوانات الاليفه'},
    {m_key:19,p_cde:5,seq:19,m_name:'الأجهزة المنزلية'},
    {m_key:20,p_cde:5,seq:20,m_name:'أدوات الطهي'},
    {m_key:21,p_cde:5,seq:21,m_name:'أدوات الشرب'},
    {m_key:22,p_cde:5,seq:22,m_name:'الحمامات'},
    {m_key:23,p_cde:5,seq:23,m_name:'مستلزمات السرير'},
    {m_key:24,p_cde:5,seq:24,m_name:'الأثاث'},
    {m_key:25,p_cde:5,seq:25,m_name:'ديكورات المنازل'}
]

// Sub-gategory
export interface ISub_cat{
    s_key:number,
    m_cde:number,
    seq:number,
    s_name: string
}
export const sub_cat: ISub_cat[]=[
    {s_key:1,m_cde:1,seq:1,s_name:'ملابس حريمي'},
    {s_key:2,m_cde:1,seq:2,s_name:'أحذية حريمي'},
    {s_key:3,m_cde:1,seq:3,s_name:'شنط حريمي'},
    {s_key:4,m_cde:2,seq:4,s_name:'ملابس رجالي'},
    {s_key:5,m_cde:2,seq:5,s_name:'أحذية رجالي'},
    {s_key:6,m_cde:3,seq:6,s_name:'ملابس بنات'},
    {s_key:7,m_cde:3,seq:7,s_name:'ملابس أولاد'},
    {s_key:8,m_cde:3,seq:8,s_name:'احذية بنات'},
    {s_key:9,m_cde:3,seq:9,s_name:'احذية أولاد'},
    {s_key:10,m_cde:3,seq:10,s_name:'ملابس حيثي الولادة'},
]
