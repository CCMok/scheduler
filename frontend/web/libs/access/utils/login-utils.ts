import { CLEANABLE_LOCAL_STORAGE_KEYS } from "@/libs/_general/enums/local-storage-key"

export const afterLoginUi = () => {
  // Remove user specific item
  for (const key of CLEANABLE_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }
}