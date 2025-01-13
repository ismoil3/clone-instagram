'use client'
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import axios from 'axios';
import { apiSoftInsta } from '@/app/config/config';

const SingUp = () => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();
    let obj = {
      userName: event.target['username'].value,
      fullName: event.target['fullName'].value,
      email: event.target['email'].value,
      password: event.target['password'].value,
      confirmPassword: event.target['confirmPassword'].value
    };

    if (
      obj.userName &&
      obj.fullName &&
      obj.email &&
      obj.password &&
      obj.confirmPassword
    ) {
      setLoading(true);
      setError('');
      setSuccess(false);

      try {
        const response = await axios.post(`${apiSoftInsta}/Account/register`, obj);
        console.log(response.data); 
        if (response.data?.errors) {
          setError(response.data.errors.join(', '));
        } else {
          setSuccess(true);
          setTimeout(() => {
            window.location.href = '/login'; 
          }, 2000);
        }
		window.location.href = '/login'
      } catch (error) {
        if (error.response) {
          setError(error.response?.data?.errors || 'An unexpected error occurred.');
        } else {
          setError('Network or server error');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please fill all the fields.');
    }
  }

  return (
    <div>
      <div className="bg-gray-100 flex flex-col items-center min-h-screen py-10">
        {/* Registration Form */}
        <form
          className="bg-white w-full max-w-sm p-6 rounded shadow-md"
          onSubmit={handleRegister}
        >
          <div className="flex justify-center mb-4">
            <Image
              src="https://logos-world.net/wp-content/uploads/2020/05/Instagram-Logo-2016-present.png"
              alt="Instagram Logo"
              width={192}
              height={75}
              priority
            />
          </div>
          <p className="text-center text-gray-600 mb-4">
            Зарегистрируйтесь, чтобы <br />
            смотреть фото и видео ваших <br />
            друзей.
          </p>
          <input
            required
            type="text"
            name="username"
            placeholder="Имя пользователя"
            className="w-full mb-2 px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            required
            type="text"
            name="fullName"
            placeholder="Имя и фамилия"
            className="w-full mb-2 px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            required
            type="email"
            name="email"
            placeholder="эл.адрес"
            className="w-full mb-2 px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            required
            type="password"
            name="password"
            placeholder="Пароль"
            className="w-full mb-4 px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <input
            required
            type="password"
            name="confirmPassword"
            placeholder="Подтвердите пароль"
            className="w-full mb-4 px-3 py-2 border rounded text-sm focus:outline-none focus:ring focus:ring-blue-300"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Зарегистрироваться'}
          </button>
          {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          {success && <p className="text-green-500 text-sm text-center mt-4">Registration successful! Redirecting...</p>}
        </form>

        {/* Login Redirect */}
        <div className="bg-white w-full max-w-sm p-4 mt-4 text-center rounded shadow-md">
          <p className="text-sm">
            Есть аккаунт?{' '}
            <Link
              href="/login"
              className="text-blue-500 font-semibold hover:underline"
            >
              Вход
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SingUp;
