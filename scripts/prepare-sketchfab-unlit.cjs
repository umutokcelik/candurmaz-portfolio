const fs=require('fs'); const path=require('path'); const sharp=require('sharp');
const [input, destination]=process.argv.slice(2);
if(!input||!destination){console.error('Usage: node scripts/prepare-sketchfab-unlit.cjs input.glb output-directory');process.exit(1)}
fs.mkdirSync(destination,{recursive:true});
(async()=>{
 const source=fs.readFileSync(input);
 const jsonLength=source.readUInt32LE(12), json=JSON.parse(source.subarray(20,20+jsonLength).toString());
 const binStart=20+jsonLength+8;
 let bin=source.subarray(binStart,binStart+source.readUInt32LE(20+jsonLength));
 // This Sketchfab export stores baked unlit colors in emissiveTexture. Move the
 // baked result into unlit baseColor, which standard glTF viewers actually use.
 const srgbToLinear=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4;
 const linearToSrgb=v=>v<=.0031308?v*12.92:1.055*v**(1/2.4)-.055;
 for(const material of json.materials){
  if(!material.extensions?.KHR_materials_unlit||!material.emissiveTexture)continue;
  const imageIndex=json.textures[material.emissiveTexture.index].source;
  const view=json.bufferViews[json.images[imageIndex].bufferView];
  const {data,info}=await sharp(bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const strength=material.extensions.KHR_materials_emissive_strength?.emissiveStrength??1;
  const factors=material.emissiveFactor||[1,1,1];
  let alpha;
  if(material.alphaMode==='BLEND'&&material.pbrMetallicRoughness.baseColorTexture){
   const oldImage=json.images[json.textures[material.pbrMetallicRoughness.baseColorTexture.index].source];const oldView=json.bufferViews[oldImage.bufferView];
   alpha=await sharp(bin.subarray(oldView.byteOffset||0,(oldView.byteOffset||0)+oldView.byteLength)).resize(info.width,info.height).ensureAlpha().raw().toBuffer();
  }
  for(let i=0;i<data.length;i+=4){for(let c=0;c<3;c++)data[i+c]=Math.round(255*linearToSrgb(Math.min(1,srgbToLinear(data[i+c]/255)*strength*factors[c])));if(alpha)data[i+3]=alpha[i+3];}
  const png=await sharp(data,{raw:{width:info.width,height:info.height,channels:4}}).png().toBuffer();
  const padding=(4-bin.length%4)%4;bin=Buffer.concat([bin,Buffer.alloc(padding)]);
  json.images[imageIndex].bufferView=json.bufferViews.length;
  json.bufferViews.push({buffer:0,byteOffset:bin.length,byteLength:png.length});
  bin=Buffer.concat([bin,png]);
  material.pbrMetallicRoughness.baseColorTexture={...material.emissiveTexture};
  material.pbrMetallicRoughness.baseColorFactor=[1,1,1,material.pbrMetallicRoughness.baseColorFactor?.[3]??1];
  delete material.emissiveTexture;delete material.emissiveFactor;delete material.extensions.KHR_materials_emissive_strength;
 }
 json.extensionsUsed=json.extensionsUsed.filter(x=>x!=='KHR_materials_emissive_strength');
 // Repack referenced buffer views, discarding the old replaced image payloads.
 const used=new Set();
 const collect=value=>{if(Array.isArray(value))value.forEach(collect);else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(key==='bufferView'&&Number.isInteger(item))used.add(item);else if(key!=='bufferViews')collect(item)}};
 collect(json);
 const oldViews=json.bufferViews,indexMap=new Map();let packed=Buffer.alloc(0);
 const views=[];
 for(const index of [...used].sort((a,b)=>a-b)){
  const view=oldViews[index];const bytes=bin.subarray(view.byteOffset||0,(view.byteOffset||0)+view.byteLength);
  packed=Buffer.concat([packed,Buffer.alloc((4-packed.length%4)%4)]);
  indexMap.set(index,views.length);views.push({...view,buffer:0,byteOffset:packed.length});packed=Buffer.concat([packed,bytes]);
 }
 const remap=value=>{if(Array.isArray(value))value.forEach(remap);else if(value&&typeof value==='object')for(const [key,item] of Object.entries(value)){if(key==='bufferView'&&Number.isInteger(item))value[key]=indexMap.get(item);else if(key!=='bufferViews')remap(item)}};
 remap(json);json.bufferViews=views;bin=packed;
 json.buffers[0].byteLength=bin.length;
 let jsonBuffer=Buffer.from(JSON.stringify(json));jsonBuffer=Buffer.concat([jsonBuffer,Buffer.alloc((4-jsonBuffer.length%4)%4,32)]);
 bin=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);
 const header=Buffer.alloc(20);header.writeUInt32LE(0x46546c67,0);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jsonBuffer.length+bin.length,8);header.writeUInt32LE(jsonBuffer.length,12);header.writeUInt32LE(0x4e4f534a,16);
 const binHeader=Buffer.alloc(8);binHeader.writeUInt32LE(bin.length,0);binHeader.writeUInt32LE(0x004e4942,4);
 fs.writeFileSync(path.join(destination,'model.glb'),Buffer.concat([header,jsonBuffer,binHeader,bin]));
 fs.writeFileSync(path.join(destination,'attribution.json'),JSON.stringify(json.asset.extras,null,2)+'\n');
 console.log('Normalized baked texture channels and preserved the ground alpha mask.');
})();
