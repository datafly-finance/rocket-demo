import axios from "axios";

export const Get = <OutPut>(url:string) => axios.get(url).then(it => it.data as OutPut)