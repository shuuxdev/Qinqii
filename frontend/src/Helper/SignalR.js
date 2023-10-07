import {
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import Cookies from 'react-cookie/cjs/Cookies.js';
import { SERVER_DOMAIN } from '../Enums/Server';
const connection = new HubConnectionBuilder()
    .withUrl(`${SERVER_DOMAIN}/chatHub`, {
        withCredentials: true,
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => {
            return new Cookies().get('Token');
        },
    })
    .withAutomaticReconnect()
    .configureLogging(LogLevel.None)
    .build();
export default connection;
