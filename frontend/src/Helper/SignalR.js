import {
    HttpTransportType,
    HubConnectionBuilder, HubConnectionState,
    LogLevel,
} from '@microsoft/signalr';
import Cookies from 'react-cookie/cjs/Cookies.js';
import { SERVER_DOMAIN } from '../Enums/Server';

export const startSignalRConnection = async connection => {

    try {
        await connection.start();
        console.assert(connection.state === HubConnectionState.Connected);
        console.log('SignalR connection established');
    } catch (err) {
        console.assert(connection.state === HubConnectionState.Disconnected);
        console.error('SignalR Connection Error: ', err);
        setTimeout(() => startSignalRConnection(connection), 5000);
    }
};
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
// re-establish the connection if connection dropped
connection.onclose(error => {
    console.assert(connection.state === HubConnectionState.Disconnected);
    console.log('Connection closed due to error. Try refreshing this page to restart the connection', error);
});

connection.onreconnecting(error => {
    console.assert(connection.state === HubConnectionState.Reconnecting);
    console.log('Connection lost due to error. Reconnecting.', error);
});

connection.onreconnected(connectionId => {
    console.assert(connection.state === HubConnectionState.Connected);
    console.log('Connection reestablished. Connected with connectionId', connectionId);
});

export default connection;
