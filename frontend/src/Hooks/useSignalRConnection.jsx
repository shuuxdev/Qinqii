import connection from '../Helper/SignalR';
import { useEffect } from 'react';

export const useSignalRConnection = () => {

    useEffect(() => {
        connection.stop().then(() => {
            console.log('connection stopped');
            connection.start().then(() => {
                console.log('connection started');
                console.log(connection.state);
                console.log(connection.connectionId);
            }).catch((err) => {
                console.log('connection start error: ', err);
            });
        }).catch((err) => {
            console.log('connection stop error: ', err);
        });

        return () => {
            connection.stop().then(() => {
                console.log('connection stopped');
            }).catch((err) => {
                console.log('connection stop error: ', err);
            });
        }
    });
    return connection;
};