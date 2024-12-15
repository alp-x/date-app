import User from '../../models/User.js';
import Match from '../../models/Match.js';
import Message from '../../models/Message.js';
import Payment from '../../models/Payment.js';
import sequelize from '../connection.js';
import { Op } from 'sequelize';
import { faker } from '@faker-js/faker/locale/tr';

// Rastgele kullanıcı oluşturma fonksiyonu
const createRandomUser = () => {
  const gender = faker.helpers.arrayElement(['male', 'female']);
  const firstName = gender === 'male' ? faker.person.firstName('male') : faker.person.firstName('female');
  const lastName = faker.person.lastName();
  
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName }).toLowerCase(),
    password: 'password123', // Sabit şifre, test için
    age: faker.number.int({ min: 18, max: 45 }),
    gender: gender,
    interested_in: faker.helpers.arrayElement(['male', 'female', 'both', null]),
    location: `İstanbul, ${faker.helpers.arrayElement(['Kadıköy', 'Beşiktaş', 'Şişli', 'Üsküdar', 'Maltepe', 'Sarıyer'])}`,
    education: `${faker.helpers.arrayElement(['Boğaziçi', 'İTÜ', 'ODTÜ', 'Yıldız Teknik', 'Marmara'])} Üniversitesi, ${faker.helpers.arrayElement(['Bilgisayar Mühendisliği', 'Endüstri Mühendisliği', 'İşletme', 'Psikoloji', 'Mimarlık'])}`,
    job: faker.person.jobTitle(),
    bio: faker.lorem.paragraph(),
    interests: Array.from({ length: 5 }, () => faker.helpers.arrayElement(['Yoga', 'Spor', 'Seyahat', 'Fotoğrafçılık', 'Müzik', 'Sinema', 'Kitap', 'Dans', 'Yemek', 'Teknoloji', 'Sanat', 'Doğa', 'Bisiklet', 'Yüzme', 'Tiyatro'])),
    photos: Array.from({ length: faker.number.int({ min: 2, max: 4 }) }, (_, i) => `/uploads/user${faker.number.int({ min: 1, max: 999 })}.jpg`),
    profile_image: `/uploads/user${faker.number.int({ min: 1, max: 999 })}.jpg`,
    is_premium: faker.datatype.boolean(),
    last_active: faker.date.recent(),
    settings: {
      theme: faker.helpers.arrayElement(['light', 'dark']),
      notifications: faker.datatype.boolean(),
      privacy: {
        showLocation: faker.datatype.boolean(),
        showAge: faker.datatype.boolean(),
        showEducation: faker.datatype.boolean()
      }
    }
  };
};

const seed = async () => {
  try {
    console.log('\n🔄 Seed işlemi başlıyor...');
    
    // Tabloları sıfırla
    console.log('\n🗑️  Tüm tablolar siliniyor...');
    
    // Önce bağımlı tabloları sil
    await Payment.drop({ cascade: true });
    await Message.drop({ cascade: true });
    await Match.drop({ cascade: true });
    
    // En son ana tabloyu sil
    await User.drop({ cascade: true });
    
    // Tabloları yeniden oluştur
    await sequelize.sync({ force: true });
    console.log('✅ Tüm tablolar başarıyla silindi ve yeniden oluşturuldu');

    // Rastgele kullanıcılar oluştur
    console.log('\n👥 Rastgele kullanıcılar oluşturuluyor...');
    const userCount = 100; // 100 kullanıcı
    const users = Array.from({ length: userCount }, createRandomUser);
    
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const createdUser = await User.create(user);
        console.log(`✅ Kullanıcı oluşturuldu: ${user.name} (ID: ${createdUser.id})`);
        console.log(`   📍 Konum: ${user.location}`);
        console.log(`   💼 Meslek: ${user.job}`);
        console.log(`   🎓 Eğitim: ${user.education}`);
        console.log(`   ⭐ İlgi Alanları: ${user.interests.join(', ')}`);
        console.log('   ----------------------------------------');
        return createdUser;
      })
    );

    // Test hesabını oluştur
    console.log('\n🔑 Test hesabı oluşturuluyor...');
    const testUser = await User.create({
      name: 'Test Kullanıcı',
      email: 'test@example.com',
      password: 'password123',
      age: 25,
      gender: 'male',
      interested_in: 'female',
      location: 'İstanbul, Kadıköy',
      education: 'Test Üniversitesi, Yazılım Mühendisliği',
      job: 'Software Developer',
      bio: 'Bu bir test hesabıdır.',
      interests: ['Teknoloji', 'Yazılım', 'Test', 'Geliştirme', 'React'],
      photos: ['/uploads/test1.jpg', '/uploads/test2.jpg', '/uploads/test3.jpg'],
      profile_image: '/uploads/test1.jpg',
      is_premium: true,
      last_active: new Date(),
      settings: {
        theme: 'light',
        notifications: true,
        privacy: {
          showLocation: true,
          showAge: true,
          showEducation: true
        }
      }
    });
    console.log(`✅ Test hesabı oluşturuldu: ${testUser.name} (ID: ${testUser.id})`);
    console.log('   📧 Email: test@example.com');
    console.log('   🔒 Şifre: password123');
    console.log('   ----------------------------------------');

    createdUsers.push(testUser); // Test kullanıcısını listeye ekle

    console.log(`✅ Toplam ${userCount + 1} kullanıcı oluşturuldu`);

    // Rastgele eşleşmeler oluştur
    console.log('\n💕 Rastgele eşleşmeler oluşturuluyor...');
    const matchCount = 150; // Her kullanıcı için ortalama 1.5 eşleşme
    for(let i = 0; i < matchCount; i++) {
      const user1 = faker.helpers.arrayElement(createdUsers);
      const user2 = faker.helpers.arrayElement(createdUsers.filter(u => u.id !== user1.id));
      
      await Match.create({
        userId1: user1.id,
        userId2: user2.id,
        status: faker.helpers.arrayElement(['pending', 'matched', 'rejected']),
        matchedAt: faker.helpers.arrayElement(['matched', 'rejected']) === 'matched' ? new Date() : null
      });
      if (i % 10 === 0) { // Her 10 eşleşmede bir log göster
        console.log(`✅ Eşleşme oluşturuldu: ${user1.name} -> ${user2.name}`);
      }
    }
    console.log(`✅ Toplam ${matchCount} eşleşme oluşturuldu`);

    // Rastgele mesajlar oluştur
    console.log('\n💬 Rastgele mesajlar oluşturuluyor...');
    const messageCount = 300; // Her kullanıcı için ortalama 3 mesaj
    let createdMessageCount = 0;
    
    for(let i = 0; i < messageCount; i++) {
      const sender = faker.helpers.arrayElement(createdUsers);
      const receiver = faker.helpers.arrayElement(createdUsers.filter(u => u.id !== sender.id));
      
      // Önce bu iki kullanıcı arasında bir eşleşme var mı kontrol et
      const match = await Match.findOne({
        where: {
          status: 'matched',
          [Op.or]: [
            { userId1: sender.id, userId2: receiver.id },
            { userId1: receiver.id, userId2: sender.id }
          ]
        }
      });

      if (match) {
        await Message.create({
          matchId: match.id,
          senderId: sender.id,
          content: faker.lorem.sentence(),
          read: faker.datatype.boolean(),
          readAt: faker.datatype.boolean() ? new Date() : null
        });
        createdMessageCount++;
        if (createdMessageCount % 20 === 0) { // Her 20 mesajda bir log göster
          console.log(`✅ ${createdMessageCount}. Mesaj oluşturuldu: ${sender.name} -> ${receiver.name}`);
        }
      }
    }
    console.log(`✅ Toplam ${createdMessageCount} mesaj oluşturuldu`);

    console.log('\n🎉 Tüm seed dataları başarıyla oluşturuldu!\n');
  } catch (error) {
    console.error('\n❌ Seed data oluşturulurken hata:', error);
    throw error;
  }
};

// Seed fonksiyonunu çalıştır
if (process.env.NODE_ENV !== 'production') {
  seed().catch(error => {
    console.error('Seed işlemi başarısız:', error);
    process.exit(1);
  });
}

export default seed; 