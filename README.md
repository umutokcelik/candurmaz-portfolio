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

## Oyun görselleri

Neon Wings dışındaki 13 oyunun ikonları ve üçer ekran görüntüsü resmi App Store kayıtlarından alınmıştır. Kaynak adresleri ve yayıncı bilgileri `lib/game-media.json` içinde tutulur. Görseller WebP biçiminde `public/images/games` altında yerel olarak sunulur.

## 3D model önizleme

Çalışma branch’i: `dev/Portfolio`. Three.js, GLTFLoader ve OrbitControls yalnızca bir model kartı açılınca yüklenir. Pano kartları `lib/portfolio.js`, model kayıtları `lib/models.js` içinde tanımlıdır. Her yeni GLB ve kapak görselini `public/models/<model-id>/` içine koyup bu iki kayda eklemek yeterlidir.

Tesla Cybertruck, kullanıcının indirdiği `TeslaTruck.blend` dosyasından dönüştürülmüş bir **örnek modeldir**; Can’ın kendi portfolyo eseri olarak sunulmaz. GLB içinde aynalama modifier’ları uygulanmış geometri, UV’ler ve materyal adları korunmuştur. Eski Glossy/Mix/Emission shader’ları web için glTF PBR materyallerine uyarlanmıştır. Orijinal `.blend` dosyasına dokunulmamıştır.

### Gelecekte materyal / doku eşleme

`lib/viewer/materials.js`, materyal adına göre PBR kanal atamasını destekler. `lib/models.js` içindeki `materialOverrides` kaydında örneğin şu yapı kullanılabilir:

```js
Base: {
  metalness: 0.9,
  roughness: 0.42,
  textures: {
    baseColor: '/models/tesla-cybertruck/textures/brushed-metal.jpg',
    // normal, roughness, metalness, ao, emissive, alpha
  },
}
```

Base color ve emissive haritaları sRGB, veri haritaları lineer renk uzayında yüklenir; glTF UV yönü korunur. Örnek Blender dosyasında görsel doku ataması yoktur; arşivdeki metal dokusu ileride eşleme için ayrıca saklanmıştır. Varsayılan model görünümüne otomatik uygulanmamıştır. Bu aşama bir doku düzenleyici arayüzü içermez.

Pencere kapanınca canvas, kamera kontrolleri, animasyon döngüsü, geometriler, materyaller ve dokular temizlenir. Yükleme sürerken kapatma ve yeniden açma desteklenir. Tam ekran, tel kafes, otomatik dönüş ve sıfırlama kontrolleri bulunur.
