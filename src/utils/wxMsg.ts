import axios from "axios"
import { YiDongType, states } from "../eastmoney/yidong"
import { CodeWithHeader, CodeWithType } from "../helper/format"

// 热榜股票
export const bot1 = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=b89223ed-f0b3-4720-951c-96a734e6685a"

export const SendTextMsg = ( msg: string, bot:string = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3946e1f9-4326-4a9b-9945-887649475ac3" ) =>
{
    const msgText = {
        "msgtype": "text",
        "text": {
            "content": msg,
        }
    }
    axios.post( bot, msgText,
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
}

export const SendMDMsg = ( msg: string, bot:string = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3946e1f9-4326-4a9b-9945-887649475ac3") => {
    const msgText = {
        "msgtype": "markdown",
        "markdown": {
            "content": msg,
        }
    }
    axios.post( bot, msgText,
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
}

export const FormatMDMsg = ( info:YiDongType) => {
    const [ time, code, name, state, info1, isGood ] = info;
    const type = states.get( state ) ?? "未知"
    return `#### ${name} ${ time }  [${ isGood === '1' ? "Good" : "Bad" }]
            > ${ type } ${ info1 }      
            > [${ name } 详情 ](https://wap.eastmoney.com/quote/stock/${ code.startsWith("6")?`1.${code}`:`0.${code}` }.html)`
}

export const SendNewsMsg = ( msg: YiDongType, bot:string = "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3946e1f9-4326-4a9b-9945-887649475ac3") => {
    const [ time, code, name, state, info1, isGood ] = msg;
    const type = states.get( state ) ?? "未知"
    const msgText = {
        "msgtype": "news",
        "news": {
            "articles": [
                {
                    "title": `${name} ${ time }  [${ isGood === '1' ? "Good" : "Bad" }]`,
                    "description": `${ type } ${ info1 }`,
                    "url": `https://wap.eastmoney.com/quote/stock/${ CodeWithType(code) }.html`,
                    "picurl": `http://webquotepic.eastmoney.com/GetPic.aspx?nid=${CodeWithType(code)}&imageType=r&_t=${Date.now()}`
                }
            ]
        }
    }
    axios.post( bot, msgText,
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
}