"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [records, setRecords] = useState([]);
  const [recordType, setRecordType] = useState("Öğrenci");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecords = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8005/api/data");
      if (res.ok) {
        const data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error("Backend'e ulaşılamıyor:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!key.trim() || !value.trim()) {
      alert("Lütfen Özellik Adı ve Değer alanlarını doldurun!");
      return;
    }

    const payload = {
      record_type: recordType,
      value: { [key]: value }
    };

    try {
      const response = await fetch("http://127.0.0.1:8005/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Başarılı! Kayıt veritabanına eklendi.");
        setKey("");
        setValue("");
        fetchRecords(); 
      } else {
        alert("Hata: Backend veriyi kabul etmedi.");
      }
    } catch (err) {
      alert("BAĞLANTI HATASI: Sunucu kapalı. Terminalden uvicorn komutunu kontrol et.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Yönetim Paneli</h1>
          <span className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow">
            Sistem Aktif
          </span>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Yeni Dinamik Kayıt Ekle</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Kayıt Türü</label>
              <select 
                value={recordType} 
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Öğrenci">Öğrenci</option>
                <option value="Firma">Firma</option>
                <option value="Ürün">Ürün</option>
                <option value="Sipariş">Sipariş</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Özellik Adı (Key)</label>
              <input 
                type="text" 
                placeholder="Örn: isim" 
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Değeri (Value)</label>
              <input 
                type="text" 
                placeholder="Örn: Okcan" 
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2 rounded-lg transition-colors shadow"
            >
              Veritabanına Gönder
            </button>
          </form>
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-700">Veritabanı Kayıtları</h2>
          </div>
          
          <div className="p-0">
            {isLoading ? (
              <p className="text-gray-500 p-6 text-center">Yükleniyor...</p>
            ) : records.length === 0 ? (
              <p className="text-gray-500 p-6 text-center">Kayıt yok veya backend kapalı.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Kayıt Türü</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">JSON İçeriği</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase">Tarih</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {records.map((record, index) => (
                      <tr key={record.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{record.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800">
                            {record.record_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <pre className="text-xs bg-gray-800 text-green-400 p-3 rounded-md max-w-md overflow-x-auto">
                            {typeof record.value === 'string' ? record.value : JSON.stringify(record.value, null, 2)}
                          </pre>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.created_at ? new Date(record.created_at).toLocaleString('tr-TR') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}