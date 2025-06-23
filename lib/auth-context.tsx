"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  full_name: string
  email: string
  phone_number: string
  cccd: string
  gender: "Male" | "Female" | null
  birthday: string | null
  guest_type_name: string
  guest_type_id?: number   
  surcharge_rate?: number 
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (userData: {
    full_name: string;
    cccd: string;
    guest_type_id: string;
    email: string;
    phone_number: string;
    password: string;
  }) => Promise<boolean>;
  signOut: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:4000/api/bookingweb/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      if (!res.ok) return false

      const data = await res.json()
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      setUser(data.user)
      return true
    } catch (err) {
      console.error("Sign in error:", err)
      return false
    }
  }
  const signUp = async (userData: {
  full_name: string;
  cccd: string;
  guest_type_name: string;
  email: string;
  phone_number: string;
  password: string;
}): Promise<boolean> => {
  try {
    const res = await fetch("http://localhost:4000/api/bookingweb/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Sign up failed");
    }

    const data = await res.json();

    localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);

    return true;
  } catch (err) {
    console.error("Sign up error:", err);
    throw err;
  }
};


  const signOut = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}

