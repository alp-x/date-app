"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth } from '../services/api';
import { UserRegistration } from '../types';

// Form için özel interface
interface RegisterFormData extends Omit<UserRegistration, 'latitude' | 'longitude' | 'age'> {
  age: string;
}

const RegisterPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    email: '',
    password: '',
    name: '',
    age: '',
    gender: 'Erkek',
    lookingFor: []
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLookingForChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      lookingFor: prev.lookingFor.includes(value)
        ? prev.lookingFor.filter(item => item !== value)
        : [...prev.lookingFor, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (parseInt(formData.age) < 18) {
      setError('Yaşınız 18\'den küçük olamaz.');
      setLoading(false);
      return;
    }

    try {
      const response = await auth.register({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        lookingFor: formData.lookingFor
      });
      
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.userId);
      router.push('/');
    } catch (err) {
      setError('Kayıt olurken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const lookingForOptions = [
    'Uzun Süreli İlişki',
    'Kısa Süreli İlişki',
    'Arkadaşlık',
    'Yeni İnsanlar Tanıma'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Kayıt Ol</h2>
            <p className="text-gray-600">
              Yeni bir hesap oluşturun ve eşleşmeleri keşfedin
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
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                İsim
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="İsminiz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Yaş
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Yaşınız"
                min="18"
                max="100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cinsiyet
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Seçiniz</option>
                <option value="Erkek">Erkek</option>
                <option value="Kadın">Kadın</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Ne Arıyorsun?
              </label>
              <div className="flex flex-wrap gap-2">
                {lookingForOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleLookingForChange(option)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      formData.lookingFor.includes(option)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn"
              disabled={loading}
            >
              {loading ? (
                <div className="loading-spinner h-5 w-5"></div>
              ) : (
                'Kayıt Ol'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-blue-500 hover:text-blue-600">
                Giriş Yap
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 