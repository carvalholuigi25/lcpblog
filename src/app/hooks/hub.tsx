import { useEffect } from 'react';
import * as signalR from '@microsoft/signalr';

export const useMyHub = (hubname: string = "datahub", skipNegotiation: boolean = true) => {
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.apiURL}/${hubname}`, {
      skipNegotiation: skipNegotiation,
      transport: skipNegotiation ? signalR.HttpTransportType.WebSockets : signalR.HttpTransportType.None,
      withCredentials: skipNegotiation ? true : false,
      accessTokenFactory: async () => { return "" }
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

    connection.start().catch(err => console.error('Connection failed: ', err));

    return () => {
      connection.stop().then(() => console.log('Connection disposed')).catch(err => console.error('Error disposing connection: ', err));
    };
  }, [hubname, skipNegotiation]);
};

export default useMyHub;