import "./globals.css";
export const metadata = {
 metadataBase: new URL("https://candurmaz.art"),
 title: "Can Durmaz · 3D Game Artist",
 description: "Can Durmaz — İstanbul’da mobil oyunlar için karakter, prop ve çevre tasarlayan 3D Game Artist. Oyunlarımı keşfet, deneyimime göz at ve iletişime geç.",
 alternates: {canonical: "/"},
 openGraph: {title:"Can Durmaz · 3D Game Artist",description:"3D karakter, prop ve çevre tasarımı · Mobil oyun portfolyosu",url:"https://candurmaz.art",type:"website",locale:"tr_TR"},
};
export const viewport = {width:"device-width",initialScale:1,viewportFit:"cover",themeColor:"#0a0620"};
export default function RootLayout({children}) {return <html lang="tr"><body>{children}</body></html>}
