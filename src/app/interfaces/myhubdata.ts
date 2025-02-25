export interface MyHubData {
  hubname: string;
  skipNegotiation: boolean;
  fetchData: () => void | Promise<void> | undefined;
}