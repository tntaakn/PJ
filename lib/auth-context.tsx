"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  idNumber?: string
  idType?: "National" | "International"
  address?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (userData: Omit<User, "id"> & { password: string }) => Promise<boolean>
  updateProfile: (userData: Partial<User>) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication using email - in real app, this would call an API
    if (email === "abcdefgh@gmail.com" && password === "password") {
      const userData = {
        id: "1",
        firstName: "Nguyen",
        lastName: "Brakenull",
        email: "abcdefgh@gmail.com",
        mobile: "972345789",
        idNumber: "123456",
        idType: "National" as const,
        address: "123 street, ward, city",
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const signUp = async (userData: Omit<User, "id"> & { password: string }): Promise<boolean> => {
    // Mock registration - in real app, this would call an API
    const newUser = {
      id: Date.now().toString(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobile: userData.mobile,
      idNumber: userData.idNumber,
      idType: userData.idType,
      address: userData.address,
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(newUser))
    return true
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signUp, updateProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
