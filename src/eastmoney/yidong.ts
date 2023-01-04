import axios from 'axios'
import { Subject, filter, interval } from 'rxjs';

const url = ( codes: string[] ) => `http://push2.eastmoney.com/api/qt/pkyd/get?&fields=f1,f2,f4,f5,f6,f7&secids=${ codes.join( "," ) }&lmt=2&ut=fa5fd1943c7b386f172d6893dbfba10b`

declare module Input
{

    export interface Data
    {
        pkyd: string[];
    }

    export interface RootObject
    {
        rc: number;
        rt: number;
        svr: number;
        lt: number;
        full: number;
        dlmkts: string;
        data: Data;
    }

}



export const yidong = ( codes: string[] ) => axios.get<Input.RootObject>( url( codes ) ).then( it => it.data.data.pkyd.map( it => it.split( "," ) ) )


export const codes = [
    "1.688670", // 金迪克
    "0.000815", // 美利云
    "0.002469", // 三维化学
    "0.300505"  // 川金诺
]

export const yidongData = ( codes: string[] ) =>
{
    let lastTime = "";
    const subject = new Subject<string[]>();
    interval( 5000 ).pipe(
        // filter( () =>
        // {
        //     const now = dayjs().format( "HH:mm:ss" );
        //     console.log("当前时间",now)
        //     if ( dayjs().day() < 1 || dayjs().day() > 5 ) return false;
        //     if ( now >= "09:30:00" && now <= "11:30:00" || now >= "13:00:00" && now <= "15:00:00" )
        //     {
        //         return true;
        //     }
        //     console.log("不在交易时间")
        //     return false
        // } )
    ).subscribe(
        async () =>
        {
            const data = await yidong( codes );
            data.forEach( it =>
            {
                if ( !lastTime )
                {
                    lastTime = it[ 0 ];
                    subject.next( it );
                    console.log("第一次",it)
                } else
                {
                    if ( it[ 0 ] > lastTime )
                    {
                        lastTime = it[ 0 ];
                        subject.next( it );
                        console.log("更新",it)
                    }else{
                        console.log("不更新",it)
                    }
                }
            } )
        }
    )
    return subject;
} 