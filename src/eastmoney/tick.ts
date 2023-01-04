import { genES } from './eventsource';

const url = ( code: string ) => `http://45.push2delay.eastmoney.com/api/qt/stock/sse?fields=f58,f734,f107,f57,f43,f59,f169,f170,f152,f177,f111,f46,f60,f44,f45,f47,f260,f48,f261,f279,f277,f278,f288,f19,f17,f531,f15,f13,f11,f20,f18,f16,f14,f12,f39,f37,f35,f33,f31,f40,f38,f36,f34,f32,f211,f212,f213,f214,f215,f210,f209,f208,f207,f206,f161,f49,f171,f50,f86,f84,f85,f168,f108,f116,f167,f164,f162,f163,f92,f71,f117,f292,f51,f52,f191,f192,f262,f294,f295,f269,f270,f256,f257,f285,f286&mpi=1000&invt=2&fltt=1&secid=${ code }&ut=fa5fd1943c7b386f172d6893dbfba10b&wbp2u=|0|0|0|web`;

declare module Input
{

    export interface Data
    {
        f43: number;
        f44: number;
        f45: number;
        f46: number;
        f47: number;
        f48: number;
        f49: number;
        f50: number;
        f51: number;
        f52: number;
        f57: string;
        f58: string;
        f59: number;
        f60: number;
        f71: number;
        f84: number;
        f85: number;
        f86: number;
        f92: number;
        f107: number;
        f108: number;
        f111: number;
        f116: number;
        f117: number;
        f152: number;
        f161: number;
        f162: number;
        f163: number;
        f164: number;
        f167: number;
        f168: number;
        f169: number;
        f170: number;
        f171: number;
        f177: number;
        f191: number;
        f192: number;
        f256: string;
        f257: number;
        f260: string;
        f261: string;
        f262: string;
        f269: string;
        f270: number;
        f277: number;
        f278: number;
        f279: number;
        f285: string;
        f286: number;
        f288: number;
        f292: number;
        f294: number;
        f295: number;
        f31: string;
        f32: string;
        f33: string;
        f34: string;
        f35: string;
        f36: string;
        f37: string;
        f38: string;
        f39: string;
        f40: string;
        f19: number;
        f20: number;
        f17: number;
        f18: number;
        f15: number;
        f16: number;
        f13: number;
        f14: number;
        f11: number;
        f12: number;
        f734: string;
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

export const tickData = ( code: string ) => genES( url( code ) )(
    ( input: Input.RootObject ) => input.data
)

