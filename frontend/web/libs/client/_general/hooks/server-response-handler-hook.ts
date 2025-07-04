'use client'

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ServerResponse, SuccessResponse } from "@/libs/share/_general/models/server-response";
import { ClientMessage } from "../models/client-message-model";
import { handleServerResponse as handleServerResponseUtil } from "../utils/server-response-handler";

export default function useServerResponseHandler() {
  const router = useRouter();

  const handleServerResponse = useCallback(async <T>(
    response: ServerResponse<T>,
    onSuccess: (response: SuccessResponse<T>) => void | Promise<void>,
    onError: (response: ServerResponse<T>, clientMessage: ClientMessage) => void | Promise<void>
  ): Promise<void> => {
    await handleServerResponseUtil(response, onSuccess, onError, router);
  }, [router])

  return { handleServerResponse }
}