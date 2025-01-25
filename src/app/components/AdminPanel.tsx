"use client";

import React, { useState, useEffect } from 'react';
import { admin } from '../services/api';
import { AdminStats, User } from '../types';
import Image from 'next/image';

const AdminPanel = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    premiumUsers: 0,
    dailyMatches: 0,
    revenue: 0,
    newUsers: 0,
    activeUsers: 0,
    matchRate: 0,
    premiumConversionRate: 0
  });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'stats' | 'users'>('stats');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        admin.getStats(),
        admin.getUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
      setError(null);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number) => {
    try {
      await admin.banUser(userId);
      await loadData(); // Kullanıcı listesini yenile
    } catch (err) {
      setError('Kullanıcı yasaklanırken bir hata oluştu');
      console.error(err);
    }
  };

  const handleUnbanUser = async (userId: number) => {
    try {
      await admin.unbanUser(userId);
      await loadData(); // Kullanıcı listesini yenile
    } catch (err) {
      setError('Kullanıcı yasağı kaldırılırken bir hata oluştu');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden m-4">
      <div className="p-6">
        <h2 className="text-3xl font-bold mb-6">Yönetim Paneli</h2>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTab('stats')}
            className={`px-4 py-2 rounded ${
              selectedTab === 'stats'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            İstatistikler
          </button>
          <button
            onClick={() => setSelectedTab('users')}
            className={`px-4 py-2 rounded ${
              selectedTab === 'users'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Kullanıcılar
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
            <p>{error}</p>
          </div>
        )}

        {selectedTab === 'stats' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Toplam Kullanıcı</h3>
              <p className="text-3xl font-bold text-blue-900">{stats.totalUsers}</p>
            </div>
            <div className="bg-green-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800">Premium Kullanıcı</h3>
              <p className="text-3xl font-bold text-green-900">{stats.premiumUsers}</p>
            </div>
            <div className="bg-yellow-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800">Günlük Eşleşme</h3>
              <p className="text-3xl font-bold text-yellow-900">{stats.dailyMatches}</p>
            </div>
            <div className="bg-purple-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-800">Gelir (TL)</h3>
              <p className="text-3xl font-bold text-purple-900">
                {stats.revenue.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-posta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="relative h-10 w-10 mr-3">
                          <Image
                            src={user.photo || '/images/default-avatar.jpg'}
                            alt={user.name}
                            fill
                            className="rounded-full object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.latitude && user.longitude ? 
                              `${user.latitude.toFixed(4)}, ${user.longitude.toFixed(4)}` : 
                              'Konum belirtilmemiş'
                            }
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isPremium
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.isPremium ? 'Premium' : 'Standart'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => user.isAdmin ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                        className={`px-3 py-1 rounded ${
                          user.isAdmin
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                      >
                        {user.isAdmin ? 'Yasağı Kaldır' : 'Yasakla'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel; 