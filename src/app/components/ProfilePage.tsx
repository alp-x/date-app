"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { users } from '../services/api';
import { User } from '../types';

interface EditableProfile extends Partial<User> {
  latitude?: number;
  longitude?: number;
}

const ProfilePage = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EditableProfile>({});

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await users.getProfile();
      setProfile(data);
      setEditedProfile(data);
      setError(null);
    } catch (err) {
      setError('Profil yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedProfile) return;

    try {
      await users.updateProfile(editedProfile);
      await loadProfile();
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Profil güncellenirken bir hata oluştu');
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    if (!editedProfile) return;

    const interests = editedProfile.interests || [];
    const updatedInterests = interests.includes(interest)
      ? interests.filter(i => i !== interest)
      : [...interests, interest];

    setEditedProfile(prev => ({
      ...prev,
      interests: updatedInterests
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center text-red-500 p-4">
        <p>Profil bulunamadı</p>
      </div>
    );
  }

  const interests = [
    "Müzik", "Spor", "Seyahat", "Kitap", "Film", "Sanat",
    "Yemek", "Dans", "Fotoğrafçılık", "Teknoloji", "Doğa",
    "Yoga", "Fitness", "Tiyatro", "Sinema"
  ];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4">
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Profil</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'İptal' : 'Düzenle'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleProfileUpdate}>
          <div className="mb-6">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={profile.photo || '/images/default-avatar.jpg'}
                alt={profile.name}
                fill
                className="rounded-full object-cover"
                sizes="128px"
              />
            </div>
            {isEditing && (
              <div className="mt-2 text-center">
                <label className="block text-sm text-gray-600 mb-2">
                  Fotoğraf URL
                </label>
                <input
                  type="text"
                  name="photo"
                  value={editedProfile.photo || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İsim
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedProfile.name || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              ) : (
                <p className="text-gray-900">{profile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Yaş
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={editedProfile.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                  min="18"
                  max="99"
                />
              ) : (
                <p className="text-gray-900">{profile.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cinsiyet
              </label>
              {isEditing ? (
                <select
                  name="gender"
                  value={editedProfile.gender || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                >
                  <option value="Erkek">Erkek</option>
                  <option value="Kadın">Kadın</option>
                </select>
              ) : (
                <p className="text-gray-900">{profile.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editedProfile.bio || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows={4}
                />
              ) : (
                <p className="text-gray-900">{profile.bio || 'Henüz bir bio eklenmemiş'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enlem (Latitude)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="latitude"
                  value={editedProfile.latitude || ''}
                  onChange={handleInputChange}
                  step="0.000001"
                  className="w-full px-3 py-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{profile.latitude?.toFixed(4) || 'Belirtilmemiş'}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Boylam (Longitude)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  name="longitude"
                  value={editedProfile.longitude || ''}
                  onChange={handleInputChange}
                  step="0.000001"
                  className="w-full px-3 py-2 border rounded"
                />
              ) : (
                <p className="text-gray-900">{profile.longitude?.toFixed(4) || 'Belirtilmemiş'}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                İlgi Alanları
              </label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleInterestChange(interest)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      editedProfile.interests?.includes(interest)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    disabled={!isEditing}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Kaydet
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 