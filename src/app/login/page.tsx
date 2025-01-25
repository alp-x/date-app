"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth } from '../services/api';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await auth.login(formData.email, formData.password);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId.toString());
      localStorage.setItem('isAdmin', response.isAdmin.toString());
      localStorage.setItem('userGender', response.gender);
      router.push('/');
    } catch (err) {
      setError('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Hoş Geldiniz</h2>
            <p className="text-gray-600">
              Hesabınıza giriş yapın ve eşleşmeleri keşfedin
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                E-posta Adresi
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="ornek@mail.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner h-5 w-5"></div>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Henüz hesabınız yok mu?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-600">
                Kayıt Ol
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 