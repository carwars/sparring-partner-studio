'use strict';
const muscles=[['pectoraux','Pectoraux'],['dos','Dos'],['epaules','Épaules'],['biceps','Biceps'],['triceps','Triceps'],['abdominaux','Abdominaux'],['quadriceps','Quadriceps'],['ischio-jambiers','Ischio-jambiers'],['mollets','Mollets']];
const selected=[];const images={};const canvas=document.getElementById('poster');const ctx=canvas.getContext('2d');const fields=['student','week','date','time','place','comment'];const $=id=>document.getElementById(id);
const assetPaths=['logo-da.webp','fond-salle-9x16.jpg',...muscles.map(x=>x[0]+'.png')];const loaded=Promise.all(assetPaths.map(name=>new Promise(resolve=>{const image=new Image();image.onload=()=>{images[name]=image;resolve()};image.onerror=()=>resolve();image.src=(window.DA_EMBEDDED_ASSETS&&window.DA_EMBEDDED_ASSETS[name])||'img/'+name;})));
const iconMarkup='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3v4M17 3v4M4 9h16M5 5h14v15H5z"/><path d="M8 13h3m3 0h3m-9 4h3m3 0h3"/></svg>';
for(const [id,label] of muscles){const b=document.createElement('button');b.type='button';b.className='muscle-chip';b.setAttribute('aria-pressed','false');b.dataset.muscle=id;b.innerHTML=iconMarkup+'<span>'+label+'</span>';b.addEventListener('click',()=>{const pos=selected.indexOf(id);if(pos>=0){selected.splice(pos,1)}else if(selected.length===4){toast('4 groupes musculaires maximum. Désélectionne un groupe pour en choisir un autre.');return}else selected.push(id);syncPicker();render()});$('muscle-picker').appendChild(b)}
function syncPicker(){document.querySelectorAll('.muscle-chip').forEach(b=>b.setAttribute('aria-pressed',String(selected.includes(b.dataset.muscle))));$('counter').textContent=selected.length+' / 4'}
function toast(text){$('toast-text').textContent=text;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,5000)}$('toast-close').addEventListener('click',()=>$('toast').hidden=true);
for(const id of fields)$(id).addEventListener('input',render);
$('session-form').addEventListener('reset',()=>{selected.splice(0);syncPicker();$('toast').hidden=true;setTimeout(render,0)});
function line(x,y,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke()}
function roundRect(x,y,w,h,r,fill,stroke){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}}
function text(str,x,y,size=40,color='#fff',weight=800,align='center',italic=false){ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='middle';ctx.font=`${italic?'italic ':''}${weight} ${size}px Arial, Helvetica, sans-serif`;ctx.fillText(str,x,y)}
function fit(str,maxWidth,start=60,min=23){let size=start;ctx.font=`900 italic ${size}px Arial`;while(ctx.measureText(str).width>maxWidth&&size>min){size-=1;ctx.font=`900 italic ${size}px Arial`;}return size}
function bg(){
 ctx.clearRect(0,0,1080,1920);
 const photo=images['fond-salle-9x16.jpg'];
 if(photo){ctx.drawImage(photo,0,0,1080,1920)}else{ctx.fillStyle='#09090d';ctx.fillRect(0,0,1080,1920)}
 // Subtle veiling prevents background equipment from competing with content.
 const veil=ctx.createLinearGradient(0,0,0,1920);
 veil.addColorStop(0,'#05050855');veil.addColorStop(.34,'#05050899');veil.addColorStop(.76,'#05050890');veil.addColorStop(1,'#04040855');
 ctx.fillStyle=veil;ctx.fillRect(0,0,1080,1920);
 line(79,268,1001,268,'#e12a40',3);
 line(79,1544,1001,1544,'#df3449',3);
}
function logo(){const logo=images['logo-da.webp'];if(logo){ctx.save();ctx.shadowColor='#000';ctx.shadowBlur=15;ctx.drawImage(logo,272,27,536,202);ctx.restore()}else{text('DA  DISCIPLINE ATHLETIC',540,127,50,'#fff',950)}}
function dateLabel(value){if(!value)return 'DATE À DÉFINIR';const d=new Date(value+'T12:00:00');if(Number.isNaN(d.getTime()))return 'DATE À DÉFINIR';return new Intl.DateTimeFormat('fr-FR',{weekday:'long',day:'numeric',month:'long'}).format(d).toLocaleUpperCase('fr-FR')}
function drawHeader(){logo();text('SPARRING',540,352,119,'#f6f6f7',950,'center',true);text('PARTNER',540,465,121,'#ed3044',950,'center',true);line(112,525,968,525,'#c71d35',4);const week=$('week').value;roundRect(352,545,376,68,11,'#a31528');text('SEMAINE '+(week||'—'),540,581,46,'#fff',950,'center',true);const student=$('student').value.trim();const name=student?'AVEC '+student.toLocaleUpperCase('fr-FR'):'AVEC VOTRE ÉLÈVE';text(name,540,661,fit(name,860,57,29),'#fff',950,'center',true)}
function drawMuscles(){
 const n=selected.length;const items=n?selected:[null];
 let positions;
 if(n<=1){positions=[{x:540,y:805,w:760,h:630}]}
 else if(n===2){positions=[{x:285,y:795,w:466,h:630},{x:795,y:795,w:466,h:630}]}
 else if(n===3){positions=[{x:285,y:740,w:456,h:344},{x:795,y:740,w:456,h:344},{x:540,y:1094,w:456,h:344}]}
 else{positions=[{x:285,y:740,w:456,h:344},{x:795,y:740,w:456,h:344},{x:285,y:1098,w:456,h:344},{x:795,y:1098,w:456,h:344}]}
 items.forEach((id,i)=>{
  const v=positions[i];if(!id){text('SÉLECTIONNE UN À QUATRE',540,1060,40,'#d7d0d4',850);text('GROUPES MUSCULAIRES',540,1110,40,'#d7d0d4',850);return}
  const label=muscles.find(m=>m[0]===id)[1].toLocaleUpperCase('fr-FR');
  const image=images[id+'.png'];
  const labelY=v.y+v.h-38;const boxH=v.h-81;
  ctx.save();ctx.fillStyle='#07080db5';ctx.strokeStyle='#a22a4066';ctx.lineWidth=2;
  ctx.beginPath();ctx.roundRect(v.x-v.w/2,v.y,v.w,v.h,15);ctx.fill();ctx.stroke();
  if(image){
    const scale=Math.min((v.w-22)/image.width,(boxH-8)/image.height);
    const dw=image.width*scale,dh=image.height*scale;
    ctx.drawImage(image,v.x-dw/2,v.y+(boxH-dh)/2+4,dw,dh);
  }
  ctx.restore();
  const sz=fit(label,v.w-35,n<3?37:30,21);text(label,v.x,labelY,sz,'#fff',950,'center',true);
  line(v.x-v.w*.34,labelY+24,v.x+v.w*.34,labelY+24,'#f03446',3)
 })
}
function drawIcon(kind,x,y){ctx.save();ctx.strokeStyle='#f2f2f4';ctx.lineWidth=7;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();if(kind==='date'){ctx.roundRect(x-29,y-28,58,56,5);ctx.moveTo(x-29,y-9);ctx.lineTo(x+29,y-9);ctx.moveTo(x-14,y-36);ctx.lineTo(x-14,y-20);ctx.moveTo(x+14,y-36);ctx.lineTo(x+14,y-20);ctx.stroke();for(let r=0;r<2;r++)for(let c=0;c<3;c++){ctx.fillStyle='#f33b50';ctx.fillRect(x-17+c*16,y+1+r*14,8,7)}}else if(kind==='time'){ctx.arc(x,y,29,0,Math.PI*2);ctx.moveTo(x,y-17);ctx.lineTo(x,y);ctx.lineTo(x+16,y+9);ctx.stroke()}else{ctx.moveTo(x,y+35);ctx.bezierCurveTo(x-48,y-9,x-24,y-33,x,y-33);ctx.bezierCurveTo(x+24,y-33,x+48,y-9,x,y+35);ctx.stroke();ctx.beginPath();ctx.arc(x,y-8,10,0,Math.PI*2);ctx.stroke()}ctx.restore()}
function drawDetails(){roundRect(98,1569,884,266,14,'#07090de0','#4f2630');const date=dateLabel($('date').value), time=$('time').value||'HEURE À DÉFINIR',place=$('place').value.trim().toLocaleUpperCase('fr-FR')||'LIEU À DÉFINIR';const vals=[date,time.replace(':','H'),place];for(let i=0;i<3;i++){const y=1621+i*82;drawIcon(['date','time','place'][i],164,y);line(231,y-28,231,y+29,'#f02b43',4);const sz=fit(vals[i],685,i===0?44:49,24);text(vals[i],594,y,sz,'#f5f4f6',900,'center',true)}let comment=$('comment').value.trim();if(comment){text(comment.length>58?comment.slice(0,57)+'…':comment,540,1867,24,'#bbb8bc',650)}else{text('DISCIPLINE  •  ENGAGEMENT  •  PROGRESSION',540,1877,23,'#c9cbd0',750)}}
function render(){bg();drawHeader();drawMuscles();drawDetails()}
$('export').addEventListener('click',async()=>{
 const button=$('export');
 button.disabled=true;
 try{
  await loaded;
  const missing=assetPaths.filter(p=>!images[p]);
  if(missing.length)throw new Error('Images manquantes : '+missing.join(', '));
  render();
  const blob=await new Promise((resolve,reject)=>{
   try{canvas.toBlob(result=>result?resolve(result):reject(new Error('Le navigateur ne peut pas créer le fichier PNG.')),'image/png')}
   catch(error){reject(error)}
  });
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;
  const student=$('student').value.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'').toLowerCase()||'seance';
  link.download=`DA-sparring-${student}.png`;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),10000);
  toast('Affiche PNG générée. Vérifie les téléchargements de ton navigateur.');
 }catch(error){
  console.error('Export PNG impossible',error);
  const blocked=error?.name==='SecurityError';
  toast(blocked?'Export bloqué par la sécurité du navigateur. Utilise le ZIP complet de cette version.':('Export impossible : '+(error?.message||'erreur inconnue')));
 }finally{button.disabled=false}
});
loaded.then(render);render();
