const groups=[
{id:'anya-2',provider:'AnyAIGC',model:'gpt-image-2',group:'Codex-Gpt-2',price:'0.0264',estimate:true,date:'09.28',sizes:['941×1672','941×1672'],times:[null,null],notes:['双手握杯较自然，手势和杯子位置仍有调整。','增加了指向瓶子的动作，瓶子位置发生改变。']},
{id:'anya-25',provider:'AnyAIGC',model:'gpt-image-2.5-sunburst-c',group:'Gpt-Image-2',price:'0.1372',estimate:true,date:'09.28',sizes:['864×1536','864×1536'],times:[null,null],notes:['杯子主体完成替换，手部承托关系较自然。','完成水瓶替换，人物改为展示瓶子的姿势。']},
{id:'waw-2',provider:'WawAPI',model:'gpt-image-2',group:'gpt-image2 生图',price:'0.04',date:'09.29',sizes:['864×1536','941×1672'],times:[54,35],notes:['双手与杯子有接触，手势有所调整。','握持较自然，手势有所调整；未严格遵循请求尺寸。']},
{id:'waw-25',provider:'WawAPI',model:'gpt-image-2.5-sunburst',group:'gpt-image2 生图',price:'0.04',date:'09.29',sizes:['941×1672','941×1672'],times:[29,36],notes:['单手承托杯子，整体姿势较接近原关键帧。','单手握住瓶子下部，保留伸出的手臂；瓶身角度有所调整。']},
{id:'adobe-2',provider:'WawAPI',model:'gpt-image-2',group:'gpt-image2-adobe 生图',price:'0.06',date:'09.29',sizes:['864×1536','864×1536'],times:[39,42],notes:['人物姿势保留较多；杯盖形状和视角有变化。','手托瓶子下部，姿势较接近原图；瓶身比例和标签仍有重绘。']}
];
const gallery=document.querySelector('#gallery');let product='cup';
function render(){const provider=document.querySelector('#provider').value;let html='',count=0;for(const g of groups){if(provider!=='all'&&g.provider!==provider)continue;for(const [i,p] of ['cup','water'].entries()){if(product!=='all'&&p!==product)continue;count++;const name=p==='cup'?'蓝色杯子':'绿色水瓶';html+=`<article class="card"><div class="card-head"><div class="provider"><span>${g.provider}</span><span>${g.date} · ${name}</span></div><h3>${g.model}</h3><div class="group">${g.group}</div></div><button class="photo" data-image="assets/${g.id}-${p}.png" data-title="${g.provider} · ${g.model} · ${g.group} · ${name}" aria-label="放大查看 ${g.group} ${g.model} ${name}"><img src="assets/${g.id}-${p}.png" alt="${g.model} ${name} 替换效果" loading="lazy" width="864" height="1536"><span>放大查看 ↗</span></button><div class="card-body"><div class="metrics"><div><span class="price">¥${g.price}</span> <span class="badge ${g.estimate?'estimate':''}">${g.estimate?'估算':'实扣'}</span></div><div class="tech">${g.sizes[i]}<br>${g.times[i]?`约 ${g.times[i]} 秒`:'耗时未记录'}</div></div><p>${g.notes[i]}</p></div></article>`}}gallery.innerHTML=html;document.querySelector('#result-count').textContent=`${count} 张结果 · 点击图片可放大`}
document.querySelectorAll('[data-product]').forEach(b=>b.addEventListener('click',()=>{product=b.dataset.product;document.querySelectorAll('[data-product]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b))});render()}));document.querySelector('#provider').addEventListener('change',render);
const viewer=document.querySelector('#viewer');gallery.addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;document.querySelector('#viewer-image').src=b.dataset.image;document.querySelector('#viewer-image').alt=b.dataset.title;document.querySelector('#viewer-title').textContent=b.dataset.title;document.querySelector('#original').href=b.dataset.image;viewer.showModal()});document.querySelector('#close-viewer').addEventListener('click',()=>viewer.close());viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
const sample=`import { readFile, writeFile } from 'node:fs/promises';
const form = new FormData();
form.append('image', new Blob([await readFile('scene.png')], {type:'image/png'}), 'scene.png');
form.append('image', new Blob([await readFile('product.jpg')], {type:'image/jpeg'}), 'product.jpg');
form.append('model', 'gpt-image-2');
form.append('prompt', '将第一张图片中人物手中的物品自然地替换成第二张的主体物品');
form.append('size', '864x1536');
form.append('quality', 'medium');
form.append('n', '1'); // AnyAIGC gpt-image-2 实测时省略此项
const response = await fetch('https://wawapii.com/v1/images/edits', {
  method: 'POST',
  headers: {Authorization: 'Bearer ' + process.env.IMAGE_API_KEY},
  body: form,
  signal: AbortSignal.timeout(600000)
});
const body = await response.json();
if (!response.ok) throw new Error(JSON.stringify(body));
const item = Array.isArray(body.data) ? body.data[0] : body.data;
let bytes;
if (item?.b64_json) bytes = Buffer.from(item.b64_json, 'base64');
else if (item?.url) {
  const imageResponse = await fetch(item.url);
  if (!imageResponse.ok) throw new Error('图片下载失败');
  bytes = Buffer.from(await imageResponse.arrayBuffer());
} else throw new Error('没有可识别的结果图片');
await writeFile('result.png', bytes);`;
document.querySelector('#sample').textContent=sample;async function copy(text){try{await navigator.clipboard.writeText(text);document.querySelector('#toast').textContent='已复制'}catch{document.querySelector('#toast').textContent='复制失败，请手动选择文字复制'}document.querySelector('#toast').classList.add('show');setTimeout(()=>document.querySelector('#toast').classList.remove('show'),2000)}document.querySelector('#copy-prompt').addEventListener('click',()=>copy(document.querySelector('#prompt').textContent));document.querySelector('#copy-code').addEventListener('click',()=>copy(sample));render();
