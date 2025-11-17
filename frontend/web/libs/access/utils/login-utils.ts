import { CLEANABLE_LOCAL_STORAGE_KEYS } from "@/libs/_general/enums/local-storage-key"
import { REDIRECT_PRIVATE_PATH } from "@/libs/_general/enums/path"

export const afterLoginUi = (onRedirect: (path: string) => void) => {
  // Remove user specific item
  for (const key of CLEANABLE_LOCAL_STORAGE_KEYS) {
    localStorage.removeItem(key)
  }

  onRedirect(REDIRECT_PRIVATE_PATH)
}