import EventSource from "eventsource";
import { Subject } from 'rxjs'

export const genES = ( url: string ) => <Input, Output> ( fn: ( input: Input ) => Output ) =>
{
    const sse = new EventSource( url );
    const subject = new Subject<Output>();

    sse.onopen = () =>
    {
        sse.onmessage = ( msg ) =>
        {
            const data = JSON.parse(msg.data) as Input;
            subject.next( fn( data ) )
        }
    }
    return subject;
} 