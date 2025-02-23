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

    const startConnection = async () => {
      try {
        // await connection.stop();
        await connection.start();
        console.log("Connection started");
      } catch (e) {
        console.log(e);
      }
    };

    startConnection();

    connection.on("ReceiveMessage", () => {
      console.log("message received");
    });

    return () => {
      if(connection) {
        connection.stop();
      }
    };
  }, [hubname, skipNegotiation]);
};

export default useMyHub;