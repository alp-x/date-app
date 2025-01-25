"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../services/api';
import Link from 'next/link';
import { UserRegistration } from '../types';

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<UserRegistration>({
    email: '',
    password: '',
    name: '',
    age: 18,
    gender: 'Erkek',
    lookingFor: []
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await auth.register(formData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('userGender', response.user.gender);
      router.push('/');
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLookingForChange = (value: string) => {
    const lookingFor = formData.lookingFor || [];
    const updatedLookingFor = lookingFor.includes(value)
      ? lookingFor.filter(item => item !== value)
      : [...lookingFor, value];

    setFormData(prev => ({
      ...prev,
      lookingFor: updatedLookingFor
    }));
  };

  const lookingForOptions = [
    "Uzun Süreli İlişki",
    "Kısa Süreli İlişki",
    "Yeni Arkadaşlar",
    "Henüz Karar Veremedim"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Şifre
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              İsim
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Yaş
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="18"
              max="99"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cinsiyet
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ne Arıyorsun?
            </label>
            <div className="flex flex-wrap gap-2">
              {lookingForOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => handleLookingForChange(option)}
                  className={`px-4 py-2 rounded-full text-sm ${
                    formData.lookingFor?.includes(option)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Kayıt olunuyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-blue-500 hover:text-blue-600">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 