from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pika
import json
from database import get_db_connection

app = FastAPI()

# Arayüzün (Next.js) backend'e erişebilmesi için CORS izinleri
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Arayüzden gelecek verinin yapısı
class RecordModel(BaseModel):
    record_type: str
    value: dict

# RabbitMQ'ya mesaj gönderme fonksiyonu (Zırhlı/Hata Korumalı)
def send_to_queue(message: dict):
    try:
        # localhost yerine 127.0.0.1 kullandık
        connection = pika.BlockingConnection(pika.ConnectionParameters(host='127.0.0.1'))
        channel = connection.channel()
        channel.queue_declare(queue='task_queue', durable=True)
        channel.basic_publish(
            exchange='',
            routing_key='task_queue',
            body=json.dumps(message),
            properties=pika.BasicProperties(
                delivery_mode=2,  # Mesajı kalıcı yap
            )
        )
        connection.close()
        print("RabbitMQ'ya mesaj başarıyla iletildi!")
    except Exception as e:
        print(f"Uyarı: RabbitMQ bağlantısı kurulamadı (Kritik değil, devam ediliyor): {e}")

# Ana Dizin Testi
@app.get("/")
def read_root():
    return {"mesaj": "FastAPI Backend Hazır!", "durum": "Çalışıyor"}

# Verileri Getirme (Arayüzdeki Tablo İçin)
@app.get("/api/data")
def get_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, record_type, value, created_at FROM records ORDER BY id DESC")
        rows = cursor.fetchall()
        
        records = []
        for row in rows:
            records.append({
                "id": row[0],
                "record_type": row[1],
                "value": row[2],
                "created_at": row[3]
            })
            
        cursor.close()
        conn.close()
        return records
    except Exception as e:
        print(f"Veri çekme hatası: {e}")
        raise HTTPException(status_code=500, detail="Veritabanı hatası")

# Yeni Veri Ekleme (Arayüzdeki Form İçin)
@app.post("/api/data")
def create_data(record: RecordModel):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # JSONB olarak veritabanına ekle
        insert_query = "INSERT INTO records (record_type, value) VALUES (%s, %s) RETURNING id"
        cursor.execute(insert_query, (record.record_type, json.dumps(record.value)))
        new_id = cursor.fetchone()[0]
        
        conn.commit()
        cursor.close()
        conn.close()

        # Kayıt başarılıysa kuyruğa fırlat
        queue_message = {"id": new_id, "type": record.record_type, "işlem": "Yeni kayıt eklendi"}
        send_to_queue(queue_message)

        return {"mesaj": "Kayıt başarılı", "id": new_id}
    except Exception as e:
        print(f"Veri ekleme hatası: {e}")
        raise HTTPException(status_code=500, detail="Veri eklenemedi")