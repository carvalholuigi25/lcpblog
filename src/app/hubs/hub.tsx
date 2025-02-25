import { useEffect } from 'react';
import { loadMyRealData } from '../functions/functions';
import { MyHubData } from '../interfaces/myhubdata';

export const useMyHub = ({ hubname, skipNegotiation, fetchData }: MyHubData) => {
  useEffect(() => {
    loadMyRealData({hubname, skipNegotiation, fetchData});
  }, [hubname, skipNegotiation, fetchData]);
};

export default useMyHub;