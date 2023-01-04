import { map, take } from 'rxjs'
import { minteData } from '../eastmoney/minte';
import { writeFile} from 'node:fs'

const mlyData$ = minteData('0.000815')

mlyData$.pipe(
    map( data => data?.trends ),
    map( trends => trends?.map( trend => trend.split(',') ) ),
).subscribe(data=>writeFile('mydata.json', JSON.stringify(data), ()=>{
    console.log('done')
}))