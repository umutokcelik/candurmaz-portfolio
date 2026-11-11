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

### Model inceleme modları

Sağ üstte tooltip destekli sıfırlama, otomatik dönüş ve tam ekran ikonları bulunur. Alt çubuktaki görünüm menüsü Render, Material Channels, Geometry ve UV gruplarını içerir. Seçim orijinal materyalleri değiştirmez; Final Render geri seçilince modelin PBR materyalleri geri yüklenir.

- Final Render / No Post-Processing: stüdyo görünümü, ton eşleme açık / kapalı. Bu sürümde ek bir post-processing efekt zinciri yoktur.
- Base Color / Emission: ilgili materyal rengi ve varsa doku haritası, ışıklandırmadan bağımsız gösterilir.
- Metalness / Roughness: katsayılar ile glTF paketli haritalarının sırasıyla mavi / yeşil kanalları kullanılır.
- Anisotropy: desteklenen materyallerin katsayı ve harita gücü gösterilir; modelde tanımlı değilse menüden gizlenir ve renderer tarafından da seçilemez.
- Specular F0: metalik iş akışına uygun taban renk / metalness ve dielektrik IOR / specular parametrelerinden hesaplanır.
- Matcap / Wireframe / Vertex Normals: bağımsız matcap ışıklandırması, üçgen kenarları ve gerçek normal vektörleri.
- UV Checker: modelin mevcut UV koordinatlarına harf ve sayı içeren kontrol dokusu uygulanır; UV’ler değiştirilmez.

İnceleme katmanı `lib/viewer/inspection.js`, menü tanımı `lib/viewer/modes.js` içindedir. Menü klavyeyle gezinmeyi destekler; açık menüde Escape yalnızca menüyü kapatır. Geçici inceleme materyalleri ve dokuları pencereyle birlikte temizlenir. Özel kanal shader’ları mevcut statik modeller için hazırlanmıştır; ileride iskelet animasyonlu modeller eklenirse bu shader’lara skinning desteği de eklenmelidir.

Görünüm seçenekleri yüklenen modelin materyal ve geometri özelliklerinden belirlenir. Verisi olmayan kanallar ve boş gruplar gizlenir; klavye gezinmesi de yalnızca kullanılabilir seçenekleri içerir. Metalness / roughness gibi geçerli sıfır değerleri eksik veri sayılmaz. UV / normal incelemesi için tüm model parçalarında gerekli geometri verisi bulunmalıdır. Kontrol testleri: `node --test test/viewer-capabilities.test.mjs`.
