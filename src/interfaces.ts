
interface AdminAuthRegisterReturn {
  token: string
}

interface AdminAuthLoginReturn {
  token: string
}

interface AdminUserDetailsReturn {
  user: {
    userId: number,
    name: string,
    email: string,
    numSuccessfulLogins: number,
    numFailedPasswordsSinceLastLogin: number
  }
}

interface ErrorObject {
  error: string;
} 

interface TokenParameter {
  token: string;
}

export { AdminAuthLoginReturn, AdminUserDetailsReturn, AdminAuthRegisterReturn, ErrorObject, TokenParameter}