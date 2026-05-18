import "./globals.css";

export const metadata = {
  title: "Yönetim Paneli",
  description: "Bitirme Projesi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="antialiased bg-gray-100">{children}</body>
    </html>
  );
}