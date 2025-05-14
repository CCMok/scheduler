import 'server-only'
import { LoginRequest } from '@/libs/share/login/model/login-request'

export const login = async (request: LoginRequest): Promise<void> => {
  console.log(request)
}