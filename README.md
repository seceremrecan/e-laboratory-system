# E-Laboratory Mobile Project

E-Laboratory Mobile Project, bir doktorun ve hastaların tahlil sonuçlarını takip edebileceği, analiz edebileceği ve yönetebileceği bir mobil uygulamadır. Bu uygulama, Firebase'i backend olarak kullanarak kullanıcı oturumu, kılavuz yönetimi, tahlil sonuçları değerlendirme ve kullanıcı profili gibi özellikler sunar.

## Özellikler

- **Doktor Paneli**:
  - Hasta sonuçlarını görüntüleme ve değerlendirme.
  - Yeni kılavuzlar oluşturma.
  - Mevcut kılavuzlara göre tahlil sonuçlarını analiz etme.
  - Hastalara yeni tahlil sonuçları ekleme.

- **Kullanıcı Paneli**:
  - Tahlil sonuçlarını görüntüleme.
  - Kullanıcı profili bilgilerini güncelleme.

- **Kayıt ve Giriş**:
  - Firebase Authentication ile güvenli kullanıcı giriş ve kayıt işlemleri.
  - Yeni kullanıcılar için otomatik UID ile `Users` koleksiyonuna kaydedilme.

- **Kılavuz Yönetimi**:
  - Firebase Firestore üzerinden dinamik kılavuz yönetimi.
  - Doktorlar tarafından yeni kılavuz ekleme ve mevcut kılavuzları düzenleme.
  - Tahlil sonuçlarının seçilen kılavuza göre değerlendirilmesi.

## Kullanılan Teknolojiler

- **Frontend**: React Native
- **Backend**: Firebase (Authentication ve Firestore)
- **UI Kitaplıkları**:
  - React Native Picker
  - React Navigation
  - Expo

## Proje Kurulumu

### Gereksinimler
- Node.js (v14 veya üzeri)
- Expo CLI
- Firebase projesi oluşturulmuş olmalı

### Adım Adım Kurulum

1. **Projeyi Klonlayın**:
   ```bash
   git clone https://github.com/username/e-laboratory-mobile-project.git
   cd e-laboratory-mobile-project
