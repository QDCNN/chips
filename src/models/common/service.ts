import { CommonApi } from '@/api';
import onceInit from 'once-init';
import create from 'zustand'

const onceFetchServiceInfo = onceInit(() => CommonApi.getService());

interface ServiceState {
  state: {},
  actions: {
    fetchServiceInfo: () => Promise<void>
  },
}

export const useServiceState = create<ServiceState>((set) => ({
  state: {},
  actions: {
    async fetchServiceInfo() {
      const { data } = await onceFetchServiceInfo.init();
      console.log('data: ', data);
    }
  },
}));
