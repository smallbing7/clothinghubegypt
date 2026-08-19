document.addEventListener('DOMContentLoaded',()=>{
const whatsapp='201112736689';
const mobileMenu=document.getElementById('mobileMenu'),mobileNav=document.getElementById('mobileNav');
if(mobileMenu) mobileMenu.addEventListener('click',()=>mobileNav.classList.toggle('open'));
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
const searchBtn=document.getElementById('searchBtn'),searchbar=document.getElementById('searchbar'),searchInput=document.getElementById('searchInput');
if(searchBtn) searchBtn.addEventListener('click',()=>{searchbar.classList.toggle('open');if(searchbar.classList.contains('open'))searchInput.focus()});
const products=[...document.querySelectorAll('.product')];
function applySearch(){const term=(searchInput?.value||'').toLowerCase().trim();products.forEach(p=>p.style.display=p.textContent.toLowerCase().includes(term)?'':'none')}
if(searchInput)searchInput.addEventListener('input',applySearch);
document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const cat=btn.dataset.filter;products.forEach(p=>p.style.display=cat==='all'||p.dataset.category===cat?'':'none');if(searchInput)searchInput.value='';}));
const toast=document.getElementById('toast');
function showToast(text){if(!toast)return;toast.textContent=text;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3000)}
document.querySelectorAll('.quick').forEach(btn=>btn.addEventListener('click',()=>{const product=btn.dataset.product||'clothing';const msg=`Hello Clothing Hub Egypt, I am interested in ${product}. Please send me wholesale price, MOQ, available quantity and shipping options.`;window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener');}));
const inquiry=document.getElementById('inquiryForm');
if(inquiry)inquiry.addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(inquiry));const msg=`Hello Clothing Hub Egypt, I would like to make a wholesale inquiry.\n\nName: ${data.name||''}\nCompany: ${data.company||''}\nEmail: ${data.email||''}\nCountry: ${data.country||''}\nProduct: ${data.product||''}\nQuantity: ${data.quantity||''}\nRequirements: ${data.message||''}`;window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener');const fm=document.getElementById('formMessage');if(fm)fm.textContent='Inquiry prepared. WhatsApp has been opened.';showToast('Wholesale inquiry sent to WhatsApp');inquiry.reset()});
});