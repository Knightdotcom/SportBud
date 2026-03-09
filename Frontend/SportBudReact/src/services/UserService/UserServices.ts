import type { LoginResponseType, RegisterUserType, SetUserStatusType, UpdatePasswordType, UserTableType } from '../../types/Types'
import type { UserType } from '../../types/Types'
import { authService } from '../AuthService/AuthService'

// Bas-URL för alla anrop till backend-API:et
const BASE = 'http://localhost:6200'

// Registrerar en ny användare i systemet
export async function RegisterUser(dto: RegisterUserType) {
  const res = await fetch(`${BASE}/api/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  })
  const contentType = res.headers.get('content-type') ?? ''
  const bodyText = await res.text()
  if (!res.ok) throw new Error(bodyText)
  if (!contentType.includes('application/json')) throw new Error('API returnerade icke-JSON')
  return JSON.parse(bodyText)
}

// Hämtar en användares information baserat på id, kräver inloggning
export async function GetUser(id: string): Promise<UserType> {
  const token = authService.getToken()
  const user: UserType = await fetch(`${BASE}/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json())
  if (!user) throw new Error('Användare hittades inte')
  return user
}

// Hämtar alla användare, kräver admin-behörighet
export async function GetUsers(): Promise<UserTableType[]> {
  const token = authService.getToken()
  const users: UserTableType[] = await fetch(`${BASE}/allUsers`, {
    headers: { Authorization: `Bearer ${token}` },
  }).then(r => r.json())
  return users
}

// Aktiverar eller inaktiverar ett användarkonto, kräver admin-behörighet
export async function SetUserStatus({ userId, isActive }: SetUserStatusType) {
  const token = authService.getToken()
  const response = await fetch(`${BASE}/api/User?userId=${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  })
  return response.json()
}

// Uppdaterar lösenordet för inloggad användare och ersätter token med ett nytt
export async function UpdatePassword({ oldPassword, newPassword }: UpdatePasswordType) {
  const token = authService.getToken()
  if (!token) throw new Error('Ingen token hittades. Logga in igen.')

  const response = await fetch(`${BASE}/user/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ oldPassword, newPassword }),
  })

  const result: LoginResponseType = await response.json()
  if (!response.ok) throw new Error(result?.error || 'Kunde inte uppdatera lösenord')

  // Byter ut det gamla token mot det nya om uppdateringen lyckades
  if (result?.token && result?.isActive) {
    authService.clearToken()
    authService.setToken(result.token)
  }
  return result
}
