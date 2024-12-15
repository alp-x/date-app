import { useState } from 'react';
import { Switch } from '@mui/material';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    emailNotifications: false,
    darkMode: false,
    location: true,
    distance: 50,
    ageRange: [18, 50],
    showOnline: true
  });

  const handleChange = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
    // Ayarları kaydetme API çağrısı burada yapılacak
    console.log('Settings updated:', { [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Ayarlar</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
        {/* Bildirimler */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Bildirimler</h3>
            <p className="text-sm text-gray-500">Uygulama bildirimlerini yönetin</p>
          </div>
          <Switch
            checked={settings.notifications}
            onChange={(e) => handleChange('notifications', e.target.checked)}
            color="primary"
          />
        </div>

        {/* E-posta Bildirimleri */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">E-posta Bildirimleri</h3>
            <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
          </div>
          <Switch
            checked={settings.emailNotifications}
            onChange={(e) => handleChange('emailNotifications', e.target.checked)}
            color="primary"
          />
        </div>

        {/* Konum */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Konum</h3>
            <p className="text-sm text-gray-500">Konumunuza göre eşleşmeler alın</p>
          </div>
          <Switch
            checked={settings.location}
            onChange={(e) => handleChange('location', e.target.checked)}
            color="primary"
          />
        </div>

        {/* Mesafe */}
        <div>
          <h3 className="font-semibold mb-2">Maksimum Mesafe</h3>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.distance}
            onChange={(e) => handleChange('distance', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>1 km</span>
            <span>{settings.distance} km</span>
            <span>100 km</span>
          </div>
        </div>

        {/* Yaş Aralığı */}
        <div>
          <h3 className="font-semibold mb-2">Yaş Aralığı</h3>
          <div className="flex gap-4">
            <input
              type="number"
              min="18"
              max={settings.ageRange[1]}
              value={settings.ageRange[0]}
              onChange={(e) => handleChange('ageRange', [parseInt(e.target.value), settings.ageRange[1]])}
              className="input w-24"
            />
            <span className="self-center">-</span>
            <input
              type="number"
              min={settings.ageRange[0]}
              max="100"
              value={settings.ageRange[1]}
              onChange={(e) => handleChange('ageRange', [settings.ageRange[0], parseInt(e.target.value)])}
              className="input w-24"
            />
          </div>
        </div>

        {/* Çevrimiçi Durumu */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Çevrimiçi Durumu</h3>
            <p className="text-sm text-gray-500">Çevrimiçi olduğunuzu gösterin</p>
          </div>
          <Switch
            checked={settings.showOnline}
            onChange={(e) => handleChange('showOnline', e.target.checked)}
            color="primary"
          />
        </div>

        {/* Hesap İşlemleri */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold mb-4">Hesap İşlemleri</h3>
          <div className="space-y-2">
            <button className="w-full text-left text-gray-600 hover:text-gray-800">
              Şifremi Değiştir
            </button>
            <button className="w-full text-left text-gray-600 hover:text-gray-800">
              Gizlilik Politikası
            </button>
            <button className="w-full text-left text-red-600 hover:text-red-700">
              Hesabımı Sil
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 