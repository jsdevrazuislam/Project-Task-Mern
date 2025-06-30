import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import api from "../lib/api"
import ApiStrings from "../lib/api-strings"
import Cookies from "js-cookie"
import { ACCESS_TOKEN } from "../constants"
import { useQueryClient } from "@tanstack/react-query"
import { Loader } from "lucide-react"

interface AuthContextType {
  user: User | null
  accessToken: string | null
  setLoginUser: (user: User, token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(Cookies.get(ACCESS_TOKEN) || null)
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)

  const setLoginUser = (user: User, token: string) => {
    setUser(user)
    setAccessToken(token)
    Cookies.set(ACCESS_TOKEN, token)
  }

  const logout = () => {
    setAccessToken(null)
    setUser(null)
    Cookies.remove(ACCESS_TOKEN);
    queryClient.clear()
  }

  useEffect(() => {
    const token = Cookies.get(ACCESS_TOKEN)
    if (!token) {
      setIsLoading(false)
      return
    }

    const getMe = async () => {
      setIsLoading(true)
      try {
        const { data } = await api.get<AuthResponse>(ApiStrings.ME)
        setUser(data.data)
      } catch (error) {
        console.error("Error fetching user data (getMe):", error)
      } finally {
        setIsLoading(false)
      }
    }

    getMe()
  }, [accessToken])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return <AuthContext.Provider value={{ user, setLoginUser, accessToken, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
