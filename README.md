# Can Durmaz · candurmaz.art

Next.js App Router ile tek sayfalı interaktif portfolyo. Downloads içindeki özgün HTML tasarımı ve içerikleri korunmuştur. Görseller public/images içine çıkarılmıştır. Masaüstü motoru lib/desktop.js içinde React yaşam döngüsüne bağlıdır; zamanlayıcılar ve olay dinleyicileri kaldırılır.

## Çalıştırma

```sh
npm install
npm run dev
```

http://localhost:3000

## Üretim

```sh
npm run build
npm start
```

Mobilde ikonlar kaydırılabilir, dock ekrana sığar, pencereler yeniden boyutlandırmada görünür alanda tutulur. Escape pencereyi kapatır, Tab açık pencerede dolaşır. Hareket azaltma tercihi desteklenir.

CV dosyası kaynakta yoktu; CV penceresi e-posta ile talep bağlantısı sunar. Alan adı yayını ve DNS ayarı yapılmamıştır.
