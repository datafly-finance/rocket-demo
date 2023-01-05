import { yidongData, codes } from '../eastmoney/yidong';
import { SendTextMsg } from '../utils/wxMsg';

const states = new Map<string, string>()
states.set( "2", "大笔买入" )
states.set( "102", "大笔卖出" )
states.set( "101", "有大卖盘", )
states.set( "1", "有大买盘", )
states.set( "502", "高台跳水" )
states.set( "503", "加速下跌" )
states.set( "403", "快速反弹" )
states.set( "402", "火箭发射" )
states.set("201", "封涨停板")
states.set("202","打开涨停板")

const msg = ( it: string[] ) =>
{
    const type = states.get( it[ 3 ] ) ?? "未知"
    const name = it[ 2 ]
    const info = it[ 4 ]
    const time = it[ 0 ]


    return `${name} ${ time } ${ type } ${ info } [${ it[ 5 ] === '1' ? "Good" : "Bad" }]`

}

yidongData( codes ).subscribe( it => {
    console.log(msg(it))
    SendTextMsg(msg(it))
})