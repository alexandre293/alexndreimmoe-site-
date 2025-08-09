
function toggleMenu(){const m=document.getElementById('menu');m.style.display=(m.style.display==='flex')?'none':'flex';}
async function fetchJSON(path){const r=await fetch(path);return await r.json();}
function euro(n){return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);}
document.addEventListener('DOMContentLoaded', async () => {
  const exclusivesEl=document.getElementById('exclusives');
  if(exclusivesEl){const data=await fetchJSON('properties.json');data.filter(p=>p.exclusif).slice(0,3).forEach(p=>exclusivesEl.appendChild(card(p,true)));}
  const listEl=document.getElementById('listings');
  if(listEl){window._props=await fetchJSON('properties.json');renderList(window._props);}
  const estimateForm=document.getElementById('estimateForm');
  if(estimateForm){estimateForm.addEventListener('submit',(e)=>{e.preventDefault();alert('Merci ! Nous vous rappelons sous 24h.');estimateForm.reset();});}
  const contactForm=document.getElementById('contactForm');
  if(contactForm){contactForm.addEventListener('submit',(e)=>{e.preventDefault();alert('Message envoyé. Réponse sous 24h.');contactForm.reset();});}
});
function card(p){const el=document.createElement('div');el.className='card prop';el.innerHTML=`
  <img src="${p.image}" alt="${p.titre}">
  <div class="card-body">
    <div class="tags"><span class="tag">${p.ville}</span><span class="tag">${p.type}</span>${p.exclusif?'<span class="tag">Exclusivité</span>':''}</div>
    <h3>${p.titre}</h3>
    <div class="prop-meta"><span>🛏 ${p.chambres}</span><span>🛁 ${p.sdb}</span><span>📐 ${p.surface} m²</span>${p.exterieur?`<span>🌿 ${p.exterieur}</span>`:''}</div>
    <div class="price" style="margin-top:.5rem">${euro(p.prix)}</div>
  </div>`;el.addEventListener('click',()=>openModal(p.id));return el;}
function renderList(arr){const list=document.getElementById('listings');if(!list)return;list.innerHTML='';arr.forEach(p=>list.appendChild(card(p)));}
function applyFilters(){const q=document.getElementById('q').value.toLowerCase();const t=document.getElementById('ftype').value;const b=document.getElementById('fbeds').value;const pmin=parseInt(document.getElementById('pmin').value||'0',10);const pmax=parseInt(document.getElementById('pmax').value||'999999999',10);const out=window._props.filter(p=>{const okQ=!q||(p.titre.toLowerCase().includes(q)||p.ville.toLowerCase().includes(q));const okT=!t||p.type===t;const okB=!b||p.chambres>=parseInt(b,10);const okP=p.prix>=pmin&&p.prix<=pmax;return okQ&&okT&&okB&&okP;});renderList(out);}
function resetFilters(){document.getElementById('q').value='';document.getElementById('ftype').value='';document.getElementById('fbeds').value='';document.getElementById('pmin').value='';document.getElementById('pmax').value='';renderList(window._props);}
async function openModal(id){const data=window._props||await fetchJSON('properties.json');const p=data.find(x=>x.id===id);if(!p)return;const m=document.getElementById('modal');const c=document.getElementById('modalContent');c.innerHTML=`
  <img src="${p.image}" alt="${p.titre}"><h2 style="margin:.6rem 0">${p.titre}</h2>
  <div class="prop-meta"><span>🛏 ${p.chambres}</span><span>🛁 ${p.sdb}</span><span>📐 ${p.surface} m²</span>${p.exterieur?`<span>🌿 ${p.exterieur}</span>`:''}</div>
  <div class="price" style="margin-top:.6rem">${euro(p.prix)}</div>
  ${p.description?`<p style="color:#c8d6f0;margin-top:.6rem">${p.description}</p>`:''}
  <div style="margin-top:.8rem;display:flex;gap:.6rem;flex-wrap:wrap">
    <a class="btn btn-primary" href="https://wa.me/3319923377" target="_blank">WhatsApp</a>
    <a class="btn" href="mailto:alexandre.livens06@gmail.com?subject=Intérêt: ${'${encodeURIComponent(p.titre)}'}">Email</a>
  </div>`;m.classList.add('open');}
function closeModal(e){if(e)e.stopPropagation();document.getElementById('modal').classList.remove('open');}
