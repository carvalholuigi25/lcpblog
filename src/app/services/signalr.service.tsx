/* eslint-disable @typescript-eslint/no-explicit-any */
import * as signalR from '@microsoft/signalr';

let connection: any;

export const startConnection = async () => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl('https://localhost:5000/datahub')
    .withAutomaticReconnect()
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
  connection.stop().then(() => console.log('Connection disposed')).catch((err: any) => console.error('Error disposing connection: ', err));
}