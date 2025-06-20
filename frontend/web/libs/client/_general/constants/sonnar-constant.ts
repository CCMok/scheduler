import { ExternalToast } from "sonner";

export const SONNER_DURATION = 4000;
export const SONNER_OK_BUTTON_LABEL = '確認';
export const SONNER_DEFAULT_OPTIONS: ExternalToast = {
  action: {
    label: SONNER_OK_BUTTON_LABEL,
    onClick: () => { },
  },
  duration: SONNER_DURATION,
}