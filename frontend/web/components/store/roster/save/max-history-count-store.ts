import { createStore } from 'zustand/vanilla';
import { GetMaxHistoryCountRequest } from '@/libs/server/organization/models/get-max-history-count-request';
import { getMaxHistoryCountAction } from '@/libs/server/organization/actions/get-max-history-count-action';
import { ServerResponse, SuccessResponse } from '@/libs/share/_general/models/server-response';
import { GetMaxHistoryCountResponse } from '@/libs/server/organization/models/get-max-history-count-response';
import { isNil } from 'lodash';
import { handleServerResponse } from '@/libs/client/_general/utils/server-response-handler';

export type MaxHistoryCountState = {
  maxHistoryCount?: number;
  isFetchingMaxHistoryCount: boolean;
};

export type MaxHistoryCountActions = {
  fetchMaxHistoryCount: (departmentId: number) => Promise<void>;
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
    const onGetMaxHistoryCountSuccess = (response: SuccessResponse<GetMaxHistoryCountResponse>) => {
      if (isNil(response.data.maxHistoryCount)) return;
      set({ maxHistoryCount: response.data.maxHistoryCount });
    };

    const onGetMaxHistoryCountError = (error: ServerResponse) => {
      console.error(error);
    };

    return {
      ...defaultInitState,
      ...initState,
      fetchMaxHistoryCount: async (departmentId) => {
        if (get().isFetchingMaxHistoryCount) return;

        set({ isFetchingMaxHistoryCount: true });
        const request = getGetMaxHistoryCountRequest(departmentId);
        const response = await getMaxHistoryCountAction(request);
        await handleServerResponse(response, onGetMaxHistoryCountSuccess, onGetMaxHistoryCountError);
        set({ isFetchingMaxHistoryCount: false });
      },
    };
  });
}; 