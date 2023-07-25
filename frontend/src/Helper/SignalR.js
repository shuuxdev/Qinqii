import {
    HttpTransportType,
    HubConnectionBuilder,
    LogLevel,
} from '@microsoft/signalr';
import Cookies from 'react-cookie/cjs/Cookies.js';
const connection = new HubConnectionBuilder()
    .withUrl('https://localhost:7084/chatHub', {
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
