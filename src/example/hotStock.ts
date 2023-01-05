import dayjs from 'dayjs'
import { YiDongType, states, yidong } from '../eastmoney/yidong'
import { Tick } from '../helper/tick'
import { hotStock } from '../tonghuashun/hotStock'
import { Subject, interval } from 'rxjs'
import { SendTextMsg, bot1 } from '../utils/wxMsg'

const LIMIT = 35;

const HotStock = async () =>
{
    let stocks = await hotStock()
    console.log(stocks)
    const subject = new Subject<string[]>()

    Tick( 30 * 60 * 1000 ).subscribe( () =>
    {
        hotStock().then( data =>
        {
            stocks = data
            subject.next( data.slice( 0, LIMIT ).map( it => it[ 1 ] ) )
        } )
    } )
    return {
        send: ( msg: string, code: string ) =>
        {
            const stock = stocks.find( it => it[ 1 ] === code )
            console.log("code is :",code)
            if ( stock )
            {
                SendTextMsg(
                    `${ msg }
                    ${ stock[ 3 ] ?? '' }
                `, bot1
                )
                // console.log( ` -----
                //     ${ msg }
                //     ${ stock[ 3 ] ?? '' }
                // `)
            }
            // return msg
            // console.log( msg, "-------" )
            SendTextMsg( msg, bot1 )
        },
        stocks: () => stocks.slice(0, LIMIT),
        stockChannel: subject
    }

}

const TickDemo = async ( send: ( msg: string, code: string ) => void ) =>
{
    const map = new Map<string, YiDongType[]>()

    interval( 3 * 60 * 60 * 1000 ).subscribe(
        dayjs().format( 'HH:mm:ss' ) >= "15:00:00" ? () => map.clear() : () => { }
    )

    Tick( 5 * 1000 ).subscribe( () =>
    {

        console.log( "开始更新" )
        let stocks = [ ...map.keys() ].map( code => code.startsWith( "6" ) ? `1.${ code }` : `0.${ code }` )
        console.log( "stocks", stocks )
        if ( stocks.length === 0 ){
            console.log( "stocks.length === 0" )
            return
        }
        yidong( stocks ).then( data =>
        {
            data.forEach( it =>
            {
                const [ time, code, name, state, info, isGood ] = it;
                const stock = map.get( code )
                if ( stock && stock.length > 0 )
                {
                    const last = stock[ stock.length - 1 ]
                    if ( last[ 0 ] < time )
                    {
                        map.set( code, [ ...stock, it ] )
                        if ( dayjs().subtract( 20, 's' ).format( 'HH:mm:ss' ) < time && ( state === "402" || state === "403" ) )
                        {
                            send(
                                `${ name } ${ time } ${ states.get( state ) ?? "未知" } ${ info } [${ isGood === '1' ? "Good" : "Bad" }]`,
                                code
                            )
                        }

                    }
                } else
                {
                    map.set( code, [ it ] )
                    if ( dayjs().subtract( 20, 's' ).format( 'HH:mm:ss' ) < time && ( state === "402" || state === "403" ) )
                    {
                        send(
                            `${ name } ${ time } ${ states.get( state ) ?? "未知" } ${ info } [${ isGood === '1' ? "Good" : "Bad" }]`,
                            code
                        )
                    } else
                    {
                        console.log( "过滤掉20秒前的数据", dayjs().subtract( 20, 's' ).format( 'HH:mm:ss' ), time )
                        console.log(
                            `${ name } ${ time } ${ states.get( state ) ?? "未知" } ${ info } [${ isGood === '1' ? "Good" : "Bad" }]`,
                            code
                        )
                    }
                }
            } )
        } ).catch( err => console.log( err ) )
    } )
    return ( codes: string[] ) =>
    {
        console.log("get codes", codes);
        codes.forEach( it =>
        {
            const stock = map.get( it )
            if ( !stock )
            {
                map.set( it, [] )
            }
        } )
    }
}


const start = async () =>
{
    const { send, stockChannel,stocks } = await HotStock()
    const updateStock = await TickDemo( send )
    // init 
    updateStock( stocks().map( it => it[ 1 ] ))
    // update
    stockChannel.subscribe( updateStock )
}

start()