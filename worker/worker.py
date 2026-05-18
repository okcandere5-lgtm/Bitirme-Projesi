import pika
import sys
import os

def main():
    # Docker'daki RabbitMQ'ya bağlanıyoruz
    connection = pika.BlockingConnection(pika.ConnectionParameters(host='localhost'))
    channel = connection.channel()

    # Dinleyeceğimiz kuyruğun adını belirtiyoruz
    channel.queue_declare(queue='log_kuyrugu')

    # Kuyruğa yeni bir mesaj düştüğünde ne yapılacağını bu fonksiyon belirliyor
    def callback(ch, method, properties, body):
        mesaj = body.decode()
        print(f" [✓] GÖREV GELDİ! İşleniyor: {mesaj}")
        # Gerçek bir projede burada mail atma veya dosya oluşturma kodları olurdu

    # Kuyruğu dinleme ayarı
    channel.basic_consume(queue='log_kuyrugu', on_message_callback=callback, auto_ack=True)

    print(' [*] RabbitMQ kuyruğu dinleniyor... Çıkmak için CTRL+C yapın.')
    channel.start_consuming()

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Worker durduruldu.')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)