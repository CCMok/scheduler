import { createStore } from 'zustand/vanilla';
import { GetMaxHistoryCountRequest } from '@/libs/server/organization/models/get-max-history-count-request';
import { getMaxHistoryCountAction } from '@/libs/server/organization/actions/get-max-history-count-action';
import { isNil } from 'lodash';
import { handleServiceResponse } from '@/libs/share/_general/utils/service-response-handler';

export type MaxHistoryCountState = {
  maxHistoryCount?: number;
  isFetchingMaxHistoryCount: boolean;
};

export type MaxHistoryCountActions = {
  fetchMaxHistoryCount: (departmentId: number, onRoute: (path: string) => void) => Promise<void>;
};

export type MaxHistoryCountStore = MaxHistoryCountState & MaxHistoryCountActions;

export const defaultInitState: MaxHistoryCountState = {
  maxHistoryCount: undefined,
  isFetchingMaxHistoryCount: false,
};

const getGetMaxHistoryCountRequest = (departmentId: number): GetMaxHistoryCountRequest => ({
  departmentId,
});

export const createMaxHistoryCountStore = (initState?: Partial<MaxHistoryCountState>) => {
  return createStore<MaxHistoryCountStore>()((set, get) => {
    return {
      ...defaultInitState,
      ...initState,
      fetchMaxHistoryCount: async (departmentId, onRoute) => {
        if (get().isFetchingMaxHistoryCount) return;

        set({ isFetchingMaxHistoryCount: true });
        const request = getGetMaxHistoryCountRequest(departmentId);
        const response = await getMaxHistoryCountAction(request);

        const uiResponse = handleServiceResponse(response, onRoute);
        if (!uiResponse.isSuccess) {
          console.error(`Failed to get max history count. message title: ${uiResponse.message.title}, content: ${uiResponse.message.content}`);
        } else {
          if (isNil(uiResponse.data.maxHistoryCount)) return;
          set({ maxHistoryCount: uiResponse.data.maxHistoryCount });
        }

        set({ isFetchingMaxHistoryCount: false });
      },
    };
  });
}; 