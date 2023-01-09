import dayjs from 'dayjs'
import { YiDongType, states, yidong } from '../eastmoney/yidong'
import { Tick } from '../helper/tick'
import { hotStock } from '../tonghuashun/hotStock'
import { Subject, interval } from 'rxjs'
import { SendTextMsg, bot1 } from '../utils/wxMsg'
import { Log } from '../utils/log'

const LIMIT = 35;

const HotStock = async () =>
{
    let stocks = await hotStock()
    const subject = new Subject<string[]>()

    Tick( 10 * 60 * 1000 ).subscribe( () =>
    {
        hotStock().then( data =>
        {
            stocks = data
            Log("更新热门股票:",data.slice( 0, LIMIT ).map( it => it[ 1 ] ))
            subject.next( data.slice( 0, LIMIT ).map( it => it[ 1 ] ) )
        } )
    } )
    return {
        send: ( msg: string, code: string ) =>
        {
            const stock = stocks.find( it => it[ 1 ] === code )
            if ( stock )
            {
                SendTextMsg(
                    `${ msg }
                    ${ stock[ 3 ] ?? '' }
                `, bot1
                )
                return
            }
            SendTextMsg( msg, bot1 )
        },
        stocks: () => stocks.slice( 0, LIMIT ),
        stockChannel: subject
    }

}

const TickDemo = async ( send: ( msg: string, code: string ) => void ) =>
{
    const map = new Map<string, YiDongType[]>()

    interval( 3 * 60 * 60 * 1000 ).subscribe(
        dayjs().format( 'HH:mm:ss' ) >= "15:00:00" ? () =>
        {
            map.clear()
            Log( "清空map------------", [ ...map.keys() ].length === 0 )
        } : () => { }
    )

    Tick( 5 * 1000 ).subscribe( () =>
    {

        Log( "开始更新" )
        let stocks = [ ...map.keys() ].map( code => code.startsWith( "6" ) ? `1.${ code }` : `0.${ code }` )
        if ( stocks.length === 0 )
        {
            Log( "stocks.length === 0" )
            return
        }
        console.log("stocks 更新:",stocks)
        yidong( stocks ).then( data =>
        {
            Log( " 异动信息：", data )
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
                        Log(
                            `${ name } ${ time } ${ states.get( state ) ?? "未知" } ${ info } [${ isGood === '1' ? "Good" : "Bad" }]`,
                            code
                        )
                    }
                }
            } )
        } ).catch( err => Log( err ) )
    } )
    return ( codes: string[] ) =>
    {
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
    const { send, stockChannel, stocks } = await HotStock()
    const updateStock = await TickDemo( send )
    // init 
    updateStock( stocks().map( it => it[ 1 ] ) )
    // update
    stockChannel.subscribe( updateStock )
}

start()