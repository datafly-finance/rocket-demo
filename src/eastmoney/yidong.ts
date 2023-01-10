import axios from 'axios'
import dayjs from 'dayjs';
import { Subject, filter, interval } from 'rxjs';
import { Log } from '../utils/log';
import { Tick } from '../helper/tick';

const url = ( codes: string[] ) => `http://push2.eastmoney.com/api/qt/pkyd/get?&fields=f1,f2,f4,f5,f6,f7&secids=${ codes.join( "," ) }&lmt=100&ut=fa5fd1943c7b386f172d6893dbfba10b`

export const states = new Map<string, string>()
states.set( "1", "有大买盘", )
states.set( "2", "大笔买入" )
states.set( "101", "有大卖盘", )
states.set( "102", "大笔卖出" )
states.set( "201", "封涨停板" )
states.set( "202", "打开涨停板" )
states.set( "301", "封跌停板" )
states.set( "304", "60日新低" )
states.set( "401", "向上缺口" )
states.set( "402", "火箭发射" )
states.set( "403", "快速反弹" )
states.set( "501", "向下缺口" )
states.set( "502", "高台跳水" )
states.set( "503", "加速下跌" )

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



export const yidong = ( codes: string[] ) => axios.get<Input.RootObject>( url( codes ) ).then( it => it.data.data.pkyd.map( it => it.split( "," ) as YiDongType ) )


export const codes = [
    "1.688670", // 金迪克
    "0.000815", // 美利云
    "0.002469", // 三维化学
    "0.300505"  // 川金诺
]
type Time = string
type Code = string
type Name = string
type State = string
type Info = string
type IsGood = string

export type YiDongType = [
    Time,
    Code,
    Name,
    State,
    Info,
    IsGood
]

export const yidongData = ( codes: string[] ) =>
{
    let lastTime = "";
    const subject = new Subject<YiDongType>();
    Tick(5 * 1000, !!process.env.DEV).subscribe(
        async () =>
        {
            const data = await yidong( codes );
            data.forEach( it =>
            {
                if ( it[ 0 ] > lastTime )
                {
                    lastTime = it[ 0 ];
                    subject.next( it );
                    Log("更新",it)
                }else{
                   Log("不更新",it)
                }
            } )
        }
    )
    return subject;
} 



type YidongNull = YiDongType | null;

const isRecord = ( a: YidongNull, b: YidongNull ) =>
{
    if ( a === null ) return true
    if ( b === null ) return false
    const [ time1, code1, _name1, state1 ] = a
    const [ time2, code2, _name2, state2 ] = b
    if ( time2 < time1 ) return false
    if ( time2 === time1 )
    {
        if ( ( code2 === code1 ) && ( state1 === state2 ) ) return false
    }
    return true
}

const All = () =>
{
    let last: YidongNull = null;
    let subject = new Subject<YiDongType>();

    Tick( 5 * 1000, !!process.env.DEV ).subscribe( () =>
    {
        yidong( [] ).then( it =>
        {
            it.forEach( item =>
            {
                if ( isRecord( last, item ) )
                {
                    subject.next( item )
                    last = item
                }
            } )
        } ).catch( Log )
    } )
    return subject
}

type YidongFilter = ( data: YiDongType ) => boolean

export const AllDataWithFilter = ( fn: YidongFilter[] ) =>
{
    const AllData = All();
    return AllData
        .pipe(
            filter( data => fn.every( fn => fn( data ) ) )
        )

}