"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  fullName: string;  
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
  signUp: (userData: {
    full_name: string;
    cccd: string;
    guest_type_id: string;
    email: string;
    phone_number: string;
    password: string;
  }) => Promise<boolean>
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
    try {
            const response = await fetch('../controllers/bookingWebController/signinController', { // <-- Thay đổi URL API tại đây
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Đăng nhập thành công, lưu token và thông tin user
                localStorage.setItem('token', data.token);

                const userData: User = {
                    id: data.guest_account_id, 
                    fullName: data.full_name || "",
                    email: email,
                    mobile: "", 
                    idNumber: "", 
                    idType: "National", 
                    address: "", 
                };
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem("user", JSON.stringify(userData)); // Lưu thông tin user vào localStorage
                return true;
            } else {
                // Đăng nhập thất bại
                console.error("Sign-in failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("Error during sign-in:", error);
            return false;
        }
  }

  const signUp = async (userData: { // Đảm bảo type của userData khớp
    full_name: string;
    cccd: string;
    guest_type_id: string;
    email: string;
    phone_number: string;
    password: string;
}): Promise<boolean> => {
    try {
        const response = await fetch('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: userData.full_name,
                cccd: userData.cccd,
                guest_type_id: userData.guest_type_id,
                email: userData.email,
                phone_number: userData.phone_number,
                password: userData.password,
            }),
        });

        const data = await response.json();

        if (response.ok) {

            const newUserId = data.guest_account_id || `temp-${Date.now()}`;

            const newUser: User = { // Tạo User object để lưu vào AuthContext và localStorage
              id: userData.cccd,
              fullName: userData.full_name,
              email: userData.email,
              mobile: userData.phone_number,
              idNumber: userData.cccd,
              idType: userData.guest_type_id as "National" | "International",
              address: "", // Trường này không có trong signup API, nên giữ rỗng
          };
            setUser(newUser); // Cập nhật user trong AuthContext
            setIsAuthenticated(true); // Đặt trạng thái xác thực
            localStorage.setItem("user", JSON.stringify(newUser)); 

            return true;
        } else {
            console.error("Sign-up failed:", data.message);
            throw new Error(data.message || "Registration failed."); // Ném lỗi để bắt ở frontend
        }
    } catch (error: any) {
        console.error("Error during sign-up:", error);
        return false; // Trả về false để frontend xử lý lỗi
    }
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
