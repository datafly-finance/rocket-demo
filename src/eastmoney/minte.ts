import { genES } from './eventsource';

const url = (code :string) => `https://push2delay2.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f17&fields2=f51,f52,f53,f54,f55,f56,f57,f58&mpi=1000&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=${code}&ndays=1&iscr=0&iscca=0&wbp2u=%7C0%7C0%7C0%7Cwe`

declare module Input
{

    export interface HisPrePrice
    {
        date: number;
        prePrice: number;
    }

    export interface Data
    {
        code: string;
        market: number;
        type: number;
        status: number;
        name: string;
        decimal: number;
        preSettlement: number;
        preClose: number;
        beticks: string;
        trendsTotal: number;
        time: number;
        kind: number;
        prePrice: number;
        hisPrePrices: HisPrePrice[];
        trends: string[];
    }

    export interface RootObject
    {
        rc: number;
        rt: number;
        svr: number;
        lt: number;
        full: number;
        dlmkts: string;
        data: Data | null;
    }

}


export const minteData = (code:string) => genES( url(code) )(
    ( input: Input.RootObject ) => input.data
)
