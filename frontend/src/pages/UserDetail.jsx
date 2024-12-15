import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import config from '../config';

const UserDetail = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [matchStatus, setMatchStatus] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${config.apiUrl}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);

        // Eşleşme durumunu kontrol et
        const matchResponse = await axios.get(`${config.apiUrl}/api/matches/status/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMatchStatus(matchResponse.data.status);
      } catch (err) {
        setError(err.response?.data?.message || 'Kullanıcı bilgileri alınamadı');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleMatch = async (action) => {
    try {
      await axios.post(`${config.apiUrl}/api/matches/${action}`, 
        { targetUserId: userId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // İşlem başarılı olduktan sonra ana sayfaya yönlendir
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'İşlem başarısız');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
        >
          Geri Dön
        </button>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Profil Başlığı */}
        <div className="relative h-64 bg-gradient-to-r from-primary to-primary-dark">
          <img
            src={user.photos?.[0] || '/default-cover.jpg'}
            alt="Profil Fotoğrafı"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
            <h1 className="text-3xl font-bold text-white">{user.name}, {user.age}</h1>
            <p className="text-white/90">{user.job}</p>
          </div>
        </div>

        {/* Profil İçeriği */}
        <div className="p-6">
          {/* Temel Bilgiler */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Hakkında</h2>
            <p className="text-gray-700 mb-4">{user.bio}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600"><span className="font-medium">Konum:</span> {user.location}</p>
                <p className="text-gray-600"><span className="font-medium">Eğitim:</span> {user.education}</p>
              </div>
              <div>
                <p className="text-gray-600"><span className="font-medium">Meslek:</span> {user.job}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Premium Üye:</span> {user.is_premium ? 'Evet' : 'Hayır'}
                </p>
              </div>
            </div>
          </div>

          {/* İlgi Alanları */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">İlgi Alanları</h2>
            <div className="flex flex-wrap gap-2">
              {user.interests?.map((interest, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Fotoğraflar */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Fotoğraflar</h2>
            <div className="grid grid-cols-3 gap-4">
              {user.photos?.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${user.name} fotoğraf ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Eşleşme Butonları */}
          {currentUser.id !== user.id && (
            <div className="flex justify-center gap-4 mt-8">
              {!matchStatus && (
                <>
                  <button
                    onClick={() => handleMatch('like')}
                    className="px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                  >
                    👍 Beğen
                  </button>
                  <button
                    onClick={() => handleMatch('pass')}
                    className="px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                  >
                    👎 Geç
                  </button>
                </>
              )}
              {matchStatus === 'liked' && (
                <div className="text-green-500 font-medium">Bu kullanıcıyı beğendiniz</div>
              )}
              {matchStatus === 'matched' && (
                <div className="text-primary font-medium">Eşleştiniz! 🎉</div>
              )}
              {matchStatus === 'rejected' && (
                <div className="text-red-500 font-medium">Bu kullanıcıyı geçtiniz</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetail; 