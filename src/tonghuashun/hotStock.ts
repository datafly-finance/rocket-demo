import { Get } from '../utils/fetch'

declare module Input {

    export interface LiveTag {
        anchor: string;
        jump_url: string;
    }

    export interface Tag {
        concept_tag: string[];
        popularity_tag: string;
        live_tag: LiveTag;
    }

    export interface StockList {
        order: number;
        code: string;
        name: string;
        rate: string;
        analyse: string;
        market: number;
        hot_rank_chg: number;
        analyse_title: string;
        tag: Tag;
    }

    export interface Data {
        stock_list: StockList[];
    }

    export interface RootObject {
        status_code: number;
        status_msg: string;
        data: Data;
    }

}

const url = `https://eq.10jqka.com.cn/open/api/hot_list/v1/hot_stock/a/hour/data.txt`

export const hotStock = () => Get<Input.RootObject>( url ).then( it => it.data.stock_list.map( it => [ it.name, it.code, it.rate, it.analyse, it.analyse_title ] ) )
