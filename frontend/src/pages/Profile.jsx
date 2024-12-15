import { useState, useEffect, useRef } from 'react';
import { PhotoCamera, Edit, Add, Close, School, Work, LocationOn } from '@mui/icons-material';
import axios from 'axios';
import config from '../config';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('photos');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Profil bilgilerini getir
  const fetchProfile = async () => {
    try {
      const response = await axios.get(
        `${config.apiUrl}${config.endpoints.users.profile}`,
        { headers: config.defaultHeaders() }
      );
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Profil fotoğrafı yükleme
  const handleProfilePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploading(true);
    try {
      const response = await axios.put(
        `${config.apiUrl}${config.endpoints.users.profile}`,
        formData,
        {
          headers: {
            ...config.defaultHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setProfile(prev => ({ ...prev, profileImage: response.data.profileImage }));
      // Profili yenile
      fetchProfile();
    } catch (error) {
      console.error('Error uploading profile photo:', error);
    } finally {
      setUploading(false);
    }
  };

  // Galeriden profil fotoğrafı seçme
  const handleSetProfilePhoto = async (photoIndex) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}${config.endpoints.users.setProfilePhoto}/${photoIndex}`,
        {},
        { headers: config.defaultHeaders() }
      );
      setProfile(prev => ({ ...prev, profileImage: response.data.profileImage }));
      // Profili yenile
      fetchProfile();
    } catch (error) {
      console.error('Error setting profile photo:', error);
    }
  };

  // Fotoğraf galerisi yükleme
  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    setUploading(true);
    try {
      const response = await axios.post(
        `${config.apiUrl}${config.endpoints.users.photos}`,
        formData,
        {
          headers: {
            ...config.defaultHeaders(),
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      setProfile(prev => ({
        ...prev,
        photos: [...(prev.photos || []), response.data.photo]
      }));
      // Profili yenile
      fetchProfile();
    } catch (error) {
      console.error('Error uploading photo:', error);
    } finally {
      setUploading(false);
    }
  };

  // Fotoğraf silme
  const handleDeletePhoto = async (photoIndex) => {
    try {
      await axios.delete(
        `${config.apiUrl}${config.endpoints.users.profile}/photos/${photoIndex}`,
        { headers: config.defaultHeaders() }
      );
      setProfile(prev => ({
        ...prev,
        photos: prev.photos.filter((_, index) => index !== photoIndex)
      }));
      // Profili yenile
      fetchProfile();
    } catch (error) {
      console.error('Error deleting photo:', error);
    }
  };

  // Profil bilgisi güncelleme
  const handleUpdateProfile = async (field, value) => {
    try {
      const response = await axios.put(
        `${config.apiUrl}${config.endpoints.users.profile}`,
        { [field]: value },
        { headers: config.defaultHeaders() }
      );
      setProfile(prev => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-800 to-fuchsia-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-background-dark via-background-DEFAULT to-background-light text-white pb-20"
    >
      <div className="max-w-4xl mx-auto p-4">
        {/* Profil Kartı */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="relative rounded-3xl overflow-hidden bg-background-light/10 backdrop-blur-xl shadow-2xl mb-6 border border-primary-light/20"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary-light/20 to-secondary-light/20 mix-blend-overlay"></div>
          
          {/* Profil Fotoğrafı ve İsim */}
          <div className="p-8 flex items-center gap-6">
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary-DEFAULT/30"
              >
                <img
                  src={profile?.profileImage ? `${config.apiUrl}${profile.profileImage}` : `${config.avatarService}/avataaars/png?seed=${user.id}`}
                  alt={profile?.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `${config.avatarService}/avataaars/png?seed=${user.id}`;
                  }}
                />
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              >
                <PhotoCamera />
              </motion.button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleProfilePhotoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div>
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-center gap-3"
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-light to-secondary-light bg-clip-text text-transparent">
                  {profile?.name}, {profile?.age}
                </h1>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-primary-DEFAULT/10 hover:bg-primary-DEFAULT/20 transition-colors"
                >
                  <Edit className="text-primary-light" />
                </motion.button>
              </motion.div>
              
              {profile?.location && (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center mt-2 text-primary-light/80"
                >
                  <LocationOn className="mr-1" />
                  <span>{profile.location}</span>
                </motion.div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-primary-light/10">
            {['photos', 'about', 'interests'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 text-center transition-all duration-300 ${
                  activeTab === tab 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab İçerikleri */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-surface rounded-3xl p-6 shadow-2xl border border-surface-light/10"
          >
            {activeTab === 'photos' && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {profile?.photos?.map((photo, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden group relative"
                  >
                    <img
                      src={`${config.apiUrl}${photo}`}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = `${config.avatarService}/avataaars/png?seed=${user.id}-${index}`;
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-bg-dark/50 flex items-center justify-center gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSetProfilePhoto(index)}
                        className="p-2 rounded-full bg-primary/80 text-white hover:bg-primary"
                      >
                        <PhotoCamera />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeletePhoto(index)}
                        className="p-2 rounded-full bg-red-500/80 text-white hover:bg-red-500"
                      >
                        <Close />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => photoInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-surface-light/30 flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                >
                  <Add className="text-3xl" />
                  <input
                    ref={photoInputRef}
                    type="file"
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </motion.button>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-xl font-semibold mb-3 text-pink-400">Eğitim</h2>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl group">
                    <div className="flex items-center gap-3">
                      <School className="text-white/60" />
                      <span>{profile?.education || 'Henüz eklenmedi'}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      onClick={() => {
                        const newEducation = prompt('Eğitim bilgini güncelle:', profile?.education);
                        if (newEducation) handleUpdateProfile('education', newEducation);
                      }}
                    >
                      <Edit className="text-white/60" />
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-3 text-pink-400">İş</h2>
                  <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl group">
                    <div className="flex items-center gap-3">
                      <Work className="text-white/60" />
                      <span>{profile?.job || 'Henüz eklenmedi'}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      onClick={() => {
                        const newJob = prompt('İş bilgini güncelle:', profile?.job);
                        if (newJob) handleUpdateProfile('job', newJob);
                      }}
                    >
                      <Edit className="text-white/60" />
                    </motion.button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-xl font-semibold mb-3 text-pink-400">Hakkımda</h2>
                  <div className="bg-white/5 p-4 rounded-xl relative group">
                    <p className="text-white/90 leading-relaxed">
                      {profile?.bio || 'Henüz bir şey yazılmadı...'}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute top-4 right-4 p-2 rounded-full opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all"
                      onClick={() => {
                        const newBio = prompt('Hakkında yazını güncelle:', profile?.bio);
                        if (newBio) handleUpdateProfile('bio', newBio);
                      }}
                    >
                      <Edit className="text-white/60" />
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'interests' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-pink-400">İlgi Alanları</h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const newInterest = prompt('Yeni ilgi alanı ekle:');
                      if (newInterest) {
                        const updatedInterests = [...(profile?.interests || []), newInterest];
                        handleUpdateProfile('interests', updatedInterests);
                      }
                    }}
                    className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 transition-colors text-pink-400"
                  >
                    <Add />
                  </motion.button>
                </div>
                <motion.div className="flex flex-wrap gap-3">
                  {profile?.interests?.map((interest, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm group relative hover:bg-white/20 transition-all"
                    >
                      {interest}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const updatedInterests = profile.interests.filter((_, i) => i !== index);
                          handleUpdateProfile('interests', updatedInterests);
                        }}
                        className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Close className="text-sm" />
                      </motion.button>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Profile; 