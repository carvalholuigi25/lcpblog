import { MyHubData } from '../interfaces/myhubdata';
import * as signalR from '@microsoft/signalr';

export async function buildMyConnection(hubname: string, skipNegotiation: boolean) {
  return new signalR.HubConnectionBuilder()
  .withUrl(`${process.env.apiURL}/${hubname}`, {
    skipNegotiation: skipNegotiation,
    transport: skipNegotiation ? signalR.HttpTransportType.WebSockets : signalR.HttpTransportType.None,
    withCredentials: skipNegotiation ? true : false,
    accessTokenFactory: async () => { return "" }
  })
  .withAutomaticReconnect()
  .configureLogging(signalR.LogLevel.Information)
  .build();
}

export async function loadMyRealData({ hubname, skipNegotiation, fetchData }: MyHubData) {
  const connection = await buildMyConnection(hubname, skipNegotiation);

  try {
    await connection.stop();
    await connection.start();
    console.log("Connection started");
  } catch (e) {
    console.log(e);
  }

  connection.on("ReceiveMessage", () => {
    console.log("message received");
    fetchData();
  });

  return () => connection.stop();
}

export async function sendMessage(connection: signalR.HubConnection, message: string) {
  if (connection) {
    await connection.send("SendMessage", message);
  }
}