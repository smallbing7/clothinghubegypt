document.addEventListener('DOMContentLoaded',()=>{
const whatsapp='201112736689',email='clothinghubegypt4@gmail.com';
const mobileMenu=document.getElementById('mobileMenu'),mobileNav=document.getElementById('mobileNav');mobileMenu?.addEventListener('click',()=>mobileNav?.classList.toggle('open'));mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
const categoryRoutes={men:'men.html',women:'women.html',kids:'kids.html'};
document.querySelectorAll('a[href="#men"],a[href="#women"],a[href="#kids"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(categoryRoutes[id]){e.preventDefault();location.href=categoryRoutes[id]}}));
const searchBtn=document.getElementById('searchBtn'),searchbar=document.getElementById('searchbar'),searchInput=document.getElementById('searchInput');searchBtn?.addEventListener('click',()=>{searchbar?.classList.toggle('open');if(searchbar?.classList.contains('open'))searchInput?.focus()});
const products=[...document.querySelectorAll('.product,.product-card')],filters=[...document.querySelectorAll('.filter,.filter-btn')];
const categoryParam=new URLSearchParams(location.search).get('category');
const categoryRules={
'men-tshirts':c=>c==='men'&&c.includes('tshirt'),
'men-polo':c=>c==='men'&&c.includes('polo'),
'men-shirts':c=>c==='men'&&c.includes('shirt')&&!c.includes('tshirt')&&!c.includes('polo'),
'men-trousers':c=>c==='men'&&c.includes('trouser'),
'men-jeans':c=>c==='men'&&c.includes('jean'),
'men-cargo':c=>c==='men'&&c.includes('cargo')
};
function refresh(){const term=(searchInput?.value||'').trim().toLowerCase();const active=document.querySelector('.filter.active,.filter-btn.active')?.dataset.filter||'all';products.forEach(card=>{const cat=(card.dataset.category||'').toLowerCase(),text=card.textContent.toLowerCase();let categoryOK=active==='all'||cat===active;if(categoryParam&&categoryRules[categoryParam])categoryOK=categoryRules[categoryParam](text);card.style.display=categoryOK&&(!term||text.includes(term))?'':'none'});if(categoryParam&&categoryRules[categoryParam]){filters.forEach(x=>x.classList.remove('active'));document.querySelector('[data-filter="all"]')?.classList.add('active')}}
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');refresh()}));searchInput?.addEventListener('input',refresh);
const imageMap={'mens-tshirt':'Gamer Spirit T-Shirt _ Minimal Gaming Shirt.jpeg','mens-polo':'Men Colourblock Regular Fit Polo T-Shirt.jpeg','mens-shirt':'download (3).jpeg','mens-jeans':'DAIME Mens Ice Blue Baggy Jeans (DYM-114).jpeg','mens-cargo':'download (1).jpeg'};
Object.entries(imageMap).forEach(([product,file])=>{const card=document.querySelector(`a[href="product.html?product=${product}"]`);const img=card?.querySelector('.product-img img');if(img){img.src=file;img.removeAttribute('srcset');img.loading='lazy';}});
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.href=`mailto:${email}`);
const form=document.getElementById('inquiryForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form).entries());const msg=`Hello Clothing Hub Egypt, I would like a wholesale quotation.\n\nName: ${d.name||''}\nCompany: ${d.company||''}\nEmail: ${d.email||''}\nCountry: ${d.country||''}\nProduct: ${d.product||''}\nQuantity: ${d.quantity||''}\nRequirements: ${d.message||''}`;window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');form.reset()});
const footer=document.querySelector('footer');if(footer){const cols=footer.querySelectorAll('.footer-top>div');if(cols.length>=4){cols[2].innerHTML='<b>Customer Information</b><a href="#about">About Us</a><a href="#faq">FAQ</a><a href="shipping-policy.html">Shipping Policy</a><a href="refund-cancellation.html">Refund & Cancellation</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms & Conditions</a>';cols[3].innerHTML=`<b>Contact</b><a href="mailto:${email}">${email}</a><a href="#inquiry">Wholesale Inquiry</a><span>International wholesale support</span>`;}}
refresh();
});