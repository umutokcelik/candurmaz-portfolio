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

Güncel örnek, kullanıcının indirdiği `stylized_car.glb` dosyasıdır: [Stylized Car — Split Studios](https://sketchfab.com/3d-models/stylized-car-0323feeb81e84e67a13acc964b6c609b). Kaynak lisans bilgisi `public/models/stylized-car/attribution.json` içinde korunur ve görüntüleyicide üretici bağlantısı gösterilir. Can’ın kendi eseri olarak sunulmaz.

Model 8.196 üçgen, dört materyal ve dört gömülü doku içerir. Renk ve ışıklar dokulara işlenmiştir (unlit). Kaynak dışa aktarımda emissive kanalına konmuş renkler, `scripts/prepare-sketchfab-unlit.cjs` ile standart unlit base color kanalına taşınır; emissive güç katsayısı ve zeminin alfa maskesi korunur. Downloads altındaki orijinal dosya değiştirilmez. Zemin kamera kadrajı hesabından çıkarılır, modelin kendi zemini kullanılır.

### Gelecekte materyal / doku eşleme

`lib/viewer/materials.js`, materyal adına göre PBR kanal atamasını destekler. `lib/models.js` içindeki `materialOverrides` kaydında örneğin şu yapı kullanılabilir:

```js
Base: {
  metalness: 0.9,
  roughness: 0.42,
  textures: {
    baseColor: '/models/model-id/textures/base-color.jpg',
    // normal, roughness, metalness, ao, emissive, alpha
  },
}
```

Base color ve emissive haritaları sRGB, veri haritaları lineer renk uzayında yüklenir; glTF UV yönü korunur. Yukarıdaki yapı, gelecekte eklenecek PBR modelleri için bir eşleme örneğidir. Güncel Stylized Car kendi gömülü dokularını kullanır ve ek materyal override içermez. Bu aşama bir doku düzenleyici arayüzü içermez.

Pencere kapanınca canvas, kamera kontrolleri, animasyon döngüsü, geometriler, materyaller ve dokular temizlenir. Yükleme sürerken kapatma ve yeniden açma desteklenir. Tam ekran, tel kafes, otomatik dönüş ve sıfırlama kontrolleri bulunur.

### Model inceleme modları

Sağ üstte tooltip destekli sıfırlama, otomatik dönüş ve tam ekran ikonları bulunur. Alt çubuktaki görünüm menüsü Render, Material Channels, Geometry ve UV gruplarını içerir. Seçim orijinal materyalleri değiştirmez; Final Render geri seçilince modelin orijinal materyalleri geri yüklenir.

- Final Render / No Post-Processing: stüdyo görünümü, ton eşleme açık / kapalı. Bu sürümde ek bir post-processing efekt zinciri yoktur.
- Base Color / Emission: ilgili materyal rengi ve varsa doku haritası, ışıklandırmadan bağımsız gösterilir.
- Metalness / Roughness: katsayılar ile glTF paketli haritalarının sırasıyla mavi / yeşil kanalları kullanılır.
- Anisotropy: desteklenen materyallerin katsayı ve harita gücü gösterilir; modelde tanımlı değilse menüden gizlenir ve renderer tarafından da seçilemez.
- Specular F0: metalik iş akışına uygun taban renk / metalness ve dielektrik IOR / specular parametrelerinden hesaplanır.
- Matcap / Wireframe / Vertex Normals: bağımsız matcap ışıklandırması, üçgen kenarları ve gerçek normal vektörleri.
- UV Checker: modelin mevcut UV koordinatlarına harf ve sayı içeren kontrol dokusu uygulanır; UV’ler değiştirilmez.

İnceleme katmanı `lib/viewer/inspection.js`, menü tanımı `lib/viewer/modes.js` içindedir. Menü klavyeyle gezinmeyi destekler; açık menüde Escape yalnızca menüyü kapatır. Geçici inceleme materyalleri ve dokuları pencereyle birlikte temizlenir. Özel kanal shader’ları mevcut statik modeller için hazırlanmıştır; ileride iskelet animasyonlu modeller eklenirse bu shader’lara skinning desteği de eklenmelidir.

Görünüm seçenekleri yüklenen modelin materyal ve geometri özelliklerinden belirlenir. Verisi olmayan kanallar ve boş gruplar gizlenir; klavye gezinmesi de yalnızca kullanılabilir seçenekleri içerir. Metalness / roughness gibi geçerli sıfır değerleri eksik veri sayılmaz. UV / normal incelemesi için tüm model parçalarında gerekli geometri verisi bulunmalıdır. Kontrol testleri: `node --test test/viewer-capabilities.test.mjs`.

### Işık yönü

Işık kontrolü yalnızca sahne ışığını kullanan materyallerde etkindir. Stylized Car gibi ışığı dokulara işlenmiş unlit modellerde güneş ikonu pasiftir ve Alt hareketi devre dışıdır; tooltip nedenini açıklar.

Sağ üstteki güneş ikonu ana DirectionalLight’ı mevcut kameranın arkasına yerleştirir ve modelin merkezine yönlendirir. Kamera başka bir açıya çevrildikten sonra da aynı ikon ışığı o yeni açıya göre sıfırlar. Alt + sol tuşla sürükleme, ışığı ekranın yatay / dikey eksenlerine göre döndürür; yeni ışık oluşturmaz. Normal sürükleme kamerayı yönetmeye devam eder.

Alt hareketi sırasında OrbitControls, kamera ataleti ve otomatik dönüş geçici olarak durur. Pointer up / cancel, kaybolan pointer capture, pencere odağının kaybolması ve görüntüleyicinin kapanması kontrolleri serbest bırakır. Işık ayarı Final Render, No Post-Processing ve normal inceleme stüdyo görünümlerinde görünür; ışık kullanmayan kanallarda ayarın Final Render’da görüleceği belirtilir. Kontrol mantığı `lib/viewer/lighting.js` içindedir.

Kontrol testleri: `node --test test/viewer-lighting.test.mjs test/viewer-capabilities.test.mjs`.
