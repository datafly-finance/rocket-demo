import axios from 'axios';
import { yidongData, codes } from '../eastmoney/yidong';

const types = {
    "2": "大笔买入",
    "102": "大笔卖出",
    "101": "有大卖盘",
    "1": "有大买盘",
    "502": "高台跳水",
    "503": "加速下跌",
    "403": "快速反弹",
    "402": "火箭发射",
}

const states = new Map<string, string>()
states.set( "2", "大笔买入" )
states.set( "102", "大笔卖出" )
states.set( "101", "有大卖盘", )
states.set( "1", "有大买盘", )
states.set( "502", "高台跳水" )
states.set( "503", "加速下跌" )
states.set( "403", "快速反弹" )
states.set( "402", "火箭发射" )

const msg = ( it: string[] ) =>
{
    console.log(it[3] , states.get( it[ 3 ] ))
    const type = states.get( it[ 3 ] ) ?? "未知"
    const name = it[ 2 ]
    const info = it[ 4 ]
    const time = it[ 0 ]


    return {
        "msgtype": "text",
        "text": {
            "content": `${name} ${ time } ${ type } ${ info } [${ it[ 5 ] === '1' ? "Good" : "Bad" }]`,
        }
    }

}

yidongData( codes ).subscribe( it => {
    console.log(msg(it))
    axios.post("https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3946e1f9-4326-4a9b-9945-887649475ac3",
    msg(it),
    {
        headers: {
            "Content-Type": "application/json"
        }
    }
    )
})