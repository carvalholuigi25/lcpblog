/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from '@microsoft/signalr';

let connection: any;

export const startConnection = async (hubname: string = "datahub", skipNegotiation: boolean = true) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${process.env.apiURL}/${hubname}`, {
      skipNegotiation: skipNegotiation,
      transport: skipNegotiation ? signalR.HttpTransportType.WebSockets : signalR.HttpTransportType.None,
      withCredentials: skipNegotiation ? true : false,
      accessTokenFactory: async () => { return "" }
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  try {
    await connection.start();
    console.log('SignalR Connected');
  } catch (err) {
    console.error('Error while starting connection: ', err);
  }
};

export const getConnection = () => connection;
export const disposeConnection = () => {
  if(connection) {
    connection.stop().then(() => console.log('Connection disposed')).catch((err: any) => console.error('Error disposing connection: ', err));
  }
}