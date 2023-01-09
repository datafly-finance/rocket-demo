import { yidongData, codes, states } from '../eastmoney/yidong';
import { Log } from '../utils/log';
import { SendNewsMsg } from '../utils/wxMsg';


const msg = ( it: string[] ) =>
{
    const type = states.get( it[ 3 ] ) ?? "未知"
    const name = it[ 2 ]
    const info = it[ 4 ]
    const time = it[ 0 ]


    return `${name} ${ time } ${ type } ${ info } [${ it[ 5 ] === '1' ? "Good" : "Bad" }]`

}

yidongData( codes ).subscribe( it => {
    Log(msg(it))
    // SendTextMsg(msg(it))
    // SendMDMsg(FormatMDMsg(it))
    SendNewsMsg(it)
})