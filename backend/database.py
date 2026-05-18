import psycopg2
from psycopg2.extras import Json

# Docker'daki PostgreSQL'e bağlanma bilgilerimiz
DB_CONFIG = {
    "dbname": "projedb",
    "user": "admin",
    "password": "123",
    "host": "127.0.0.1",  # Burayı değiştirdik!
    "port": "5432"
}

def get_db_connection():
    """Veritabanına bağlanır ve connection nesnesini döner."""
    conn = psycopg2.connect(**DB_CONFIG)
    return conn

def init_db():
    """Hocanın istediği JSONB tabanlı tabloyu oluşturur."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Tüm verileri tutacağımız tek ve esnek tablo
    create_table_query = """
    CREATE TABLE IF NOT EXISTS records (
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        record_type VARCHAR(50) NOT NULL,
        value JSONB NOT NULL
    );
    """
    cursor.execute(create_table_query)
    conn.commit()
    cursor.close()
    conn.close()
    print("Veritabanı ve JSONB tablosu başarıyla hazırlandı!")

if __name__ == "__main__":
    init_db()