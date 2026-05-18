# Bilgisayar Programcılığı Bitirme Projesi - Yönetim Paneli

Bu proje, Next.js (Frontend), FastAPI (Backend), PostgreSQL (Veritabanı) ve RabbitMQ (Mesaj Kuyruğu) kullanılarak Microservice mimarisine uygun olarak geliştirilmiştir. Tüm altyapı Docker üzerinde çalışmaktadır.

## 🔗 GitHub Proje Linki
(https://github.com/okcandere5-lgtm/Bitirme-Projesi)


## 🚀 Uygulama Erişim Linkleri (Docker Container)
Tüm sistem `docker-compose up -d` komutu ile ayağa kaldırıldıktan sonra aşağıdaki linklerden projelere erişilebilir:
* **Frontend (Arayüz):** http://localhost:3000
* **Backend (API):** http://localhost:8005
* **RabbitMQ Yönetim Paneli:** http://localhost:15672

## 🗄️ Veritabanı Bilgileri (PostgreSQL)
Veriler, projenin esnekliğini sağlamak amacıyla JSONB formatında tutulmaktadır.
* **Host:** localhost (veya 127.0.0.1)
* **Port:** 5432
* **Veritabanı Adı:** projedb
* **Kullanıcı Adı:** admin
* **Şifre:** 123

## 🔑 Örnek Kullanıcı Giriş Bilgileri (Roller)
Paneli test etmek için kullanılabilecek örnek hesaplar:
* **Supervisor (Tüm Yetkilere Sahip):**
  - Kullanıcı Adı: supervisor_admin
  - Şifre: super123
* **Öğrenci:**
  - Kullanıcı Adı: ogrenci_test
  - Şifre: ogrenci123
* **İşletme:**
  - Kullanıcı Adı: isletme_test
  - Şifre: isletme123

## ⚙️ Kurulum ve Çalıştırma Adımları
1. Proje dizininde terminali açın ve `docker-compose up -d` komutunu çalıştırarak veritabanı ve kuyruk sistemlerini başlatın.
2. `backend` klasörüne girip `uvicorn main:app --host 127.0.0.1 --port 8005 --reload` komutu ile API'yi başlatın.
3. `frontend` klasörüne girip `npm run dev` komutu ile arayüzü başlatın.