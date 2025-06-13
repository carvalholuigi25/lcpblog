import { UserRole } from '@applocale/interfaces/user';
import { MyHubData } from '@applocale/interfaces/myhubdata';
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
    if(connection.state == signalR.HubConnectionState.Disconnected) {
      await connection.stop();
      await connection.start();
    }

    console.log("Connection started");
  } catch (e) {
    console.log(e);
  }

  connection.on("ReceiveMessage", () => {
    console.log("message received");
    fetchData();
  });

  return () => {
    connection.stop();
    connection.off("ReceiveMessage");
  };
}

export function shortenLargeNumber(num: number, digits: number) {
  const units = ['k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  let decimal;

  for(let i=units.length-1; i>=0; i--) {
    decimal = Math.pow(1000, i+1);

    if(Math.abs(num) >= decimal) {
      return +(num / decimal).toFixed(digits) + units[i];
    }
  }

  return num;
}

export const addSlash = (value: string) => {
  return !value.match(/\//ig) ? `/${value.split("/")[0]}` : value;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getImagePath(img: any, path?: string) {
  return !!["http", "https", "file"].includes(img) ? img : (!img.includes("/images/") ? '/images/' + (!!path && !img.includes(path) ? path + '/' : '') + img : img);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getVideoThumbnailPath(vth: any, path?: string) {
  return !!["http", "https", "file"].includes(vth) ? vth : (!vth.includes("/videos/thumbnails/") ? '/videos/thumbnails/' + (!!path && !vth.includes(path) ? path + '/' : '') + vth : vth);
}


export function formatDate(mydate: number | string | Date) {
  return new Date(mydate).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: undefined, hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' });
}

export async function sendMessage(connection: signalR.HubConnection, message: string) {
  if (connection) {
    await connection.send("SendMessage", message);
  }
}

export const allUsers: UserRole[] = ["admin", "moderator", "user"];
export const onlyAdmins: UserRole[] = ["admin"];
export const onlyAdminsAndDevs: UserRole[] = ["admin", "dev"];