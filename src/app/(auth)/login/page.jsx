'use client'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

const LogIn = () => {
const router = useRouter()
async function handleLogin(event) {
  event.preventDefault()
  let obj = {
    userName: event.target['username'].value,
    password: event.target['password'].value
  }
  try {
    const {data} = await axios.post(`https://instagram-api.softclub.tj/Account/login`,obj)
    localStorage.setItem('access_token',data.data)
    router.push('/')
  } catch (error) {
    console.log(error);
    
  }
}
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white rounded-lg p-6 shadow-lg w-[350px]">
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          <Image 
            className="w-[260px] h-[100px]" 
            src="https://logos-world.net/wp-content/uploads/2020/05/Instagram-Logo-2016-present.png" 
            alt="Instagram Logo" 
            width={260} 
            height={100} 
          />
        </div>
        
        {/* Input fields for username and password */}
        <input 
          className="w-full p-3 mb-4 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type="text" 
          name='username'
          placeholder="имя пользователя" 
        />
        
        <input 
          className="w-full p-3 mb-6 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          type="password" 
          name='password'
          placeholder="Пароль" 
        />
        
        {/* Submit Button */}
        <button 
          className="w-full py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="submit"
        >
          Войти
        </button>
        
        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-300" />
          <span className="mx-2 text-gray-500">или</span>
          <div className="flex-1 border-t border-gray-300" />
        </div>
        
        {/* Forgot password link */}
        <a 
          href="https://www.instagram.com/accounts/password/reset/" 
          className="text-gray-500 text-sm block text-center mb-4"
        >
          Забыли пароль?
        </a>
        
        {/* Sign up link */}
        <div className="flex justify-center">
          <p className="text-gray-500 text-sm">
            У вас ещё нет аккаунта? 
            <Link
              href="/registration" 
              className="text-blue-500 hover:underline"
            >
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LogIn
