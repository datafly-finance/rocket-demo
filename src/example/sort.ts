import data from './mydata.json';
import {bufferCount, interval, map, take } from 'rxjs'

const buttom: string[][] = []
const top: string[][] = [];

interval(100).pipe(
    take(data.length),
    map((_,index) =>data[index])
).pipe(
    bufferCount(3,1)
).subscribe(
    (data) => {
        if(data.length !=3) return;
        if(data[0][2] > data[1][2] && data[2][2] > data[1][2]){
            console.log(data[1][0]," : 出现底部", data[1][2])
            if(buttom.length > 3){
                const slice = buttom.slice(buttom.length - 3, buttom.length)
                if (slice.every(it => it[2] < data[1][2])){
                    console.log("出现底部突破", data[1][0], `突破比例： ${((buttom.filter(it => it[2] < data[1][2]).length / buttom.length) * 100) .toFixed(2)}`)
                }
                
            }
            buttom.push(data[1])

        }
        if(data[0][2] < data[1][2] && data[2][2] < data[1][2]){
            console.log(data[1][0]," : 出现顶部",data[1][2])
            if(top.length > 3){
                const slice = top.slice(top.length - 3, top.length)
                if (slice.every(it => it[2] < data[1][2])){
                    console.log("出现顶部突破", data[1][0],`突破比例： ${((top.filter(it => it[2] < data[1][2]).length / top.length) * 100) .toFixed(2)}`)
                }
            }
            top.push(data[1])
        }
    }
)