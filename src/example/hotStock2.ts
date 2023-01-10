/**
 *  1. 每两秒获取一次异动数据
 *  2. 过滤
 */

import {  interval } from "rxjs"
import { Tick } from "../helper/tick"
import { AllDataWithFilter, YiDongType, } from "../eastmoney/yidong";
import { hotStock } from "../tonghuashun/hotStock";
import dayjs from "dayjs";
import { Log } from "../utils/log";
import { SendMDMsg, SendNewsMsg, bot1 } from "../utils/wxMsg";


const isHotFac = () =>
{
    const Limit = 100;
    const map: Map<string, boolean> = new Map();

    const SetHotStock = () =>
    {
        hotStock().then( it =>
        {
            it.slice( 0, Limit ).forEach( item =>
            {
                const [ name, code ] = item
                if ( !map.has( code ) )
                {
                    map.set( code, true )
                }
            } )
        } )
    }
    // init
    SetHotStock()

    // 每10分钟更新一次热门股票
    Tick( 10 * 60 * 1000 ).subscribe( data =>
    {
        SetHotStock()
    } )

    // 3点后清空map
    interval( 3 * 60 * 60 * 1000 ).subscribe( data =>
    {
        if ( dayjs().format( "HH:mm:ss" ) > "15:00:00" )
        {
            Log( "清空前：", [ ...map.keys() ] );
            map.clear()
            Log( "清空map------------", [ ...map.keys() ] )
        }
    } )

    return ( data: YiDongType ) =>
    {
        const [ time, code, _name, state ] = data

        if ( map.has( code ) )
        {
            return true
        }
        return false
    }
}

const isDown = (data:YiDongType)=>{
    const [ time, code, _name, state ] = data
    if ( state === "502" || state === "503" ) return true
    return false
}

const HotNews = () => AllDataWithFilter( [
    isHotFac(),
    isDown
] )

HotNews().subscribe(data=>SendNewsMsg(data,bot1))