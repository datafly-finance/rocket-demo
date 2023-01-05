import axios from "axios"

export const SendTextMsg = ( msg: string ) =>
{
    const msgText = {
        "msgtype": "text",
        "text": {
            "content": msg,
        }
    }
    axios.post( "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=3946e1f9-4326-4a9b-9945-887649475ac3", msgText,
        {
            headers: {
                "Content-Type": "application/json"
            }
        })
}