import axios from "axios"

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