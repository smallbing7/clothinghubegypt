document.addEventListener('DOMContentLoaded',()=>{
const whatsapp='201112736689',email='clothinghubegypt4@gmail.com';
const mobileMenu=document.getElementById('mobileMenu'),mobileNav=document.getElementById('mobileNav');
mobileMenu?.addEventListener('click',()=>mobileNav?.classList.toggle('open'));
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>mobileNav.classList.remove('open')));
const categoryRoutes={men:'men.html',women:'women.html',kids:'kids.html',ethnic:'ethnic.html'};
document.querySelectorAll('a[href="#men"],a[href="#women"],a[href="#kids"],a[href="#ethnic"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1);if(categoryRoutes[id]){e.preventDefault();location.href=categoryRoutes[id]}}));
function addEthnicNav(){
 document.querySelectorAll('header nav, .mobile-nav').forEach(nav=>{
  if(!nav.querySelector('a[href="ethnic.html"]')){const a=document.createElement('a');a.href='ethnic.html';a.textContent='Ethnic';nav.appendChild(a)}
 });
}
addEthnicNav();
function ensureSearch(){
 let searchbar=document.getElementById('searchbar');
 if(!searchbar){
  searchbar=document.createElement('div');searchbar.id='searchbar';searchbar.className='searchbar';searchbar.innerHTML='<input id="searchInput" type="search" placeholder="Search catalogue…" aria-label="Search catalogue">';
  const productsSection=document.getElementById('products');
  productsSection?.querySelector('.section-head')?.appendChild(searchbar);
 }
 return searchbar;
}
const searchbar=ensureSearch(),searchBtn=document.getElementById('searchBtn'),searchInput=document.getElementById('searchInput');
searchBtn?.addEventListener('click',()=>{searchbar?.classList.toggle('open');if(searchbar?.classList.contains('open'))searchInput?.focus()});
const products=[...document.querySelectorAll('.product,.product-card')],filters=[...document.querySelectorAll('.filter,.filter-btn')];
const categoryParam=new URLSearchParams(location.search).get('category');
const categoryRules={'men-tshirts':text=>text.includes('men / t-shirts')&&!text.includes('polo'),'men-polo':text=>text.includes('men / polo'),'men-shirts':text=>text.includes('men / shirts')&&!text.includes('t-shirt')&&!text.includes('polo'),'men-trousers':text=>text.includes('men / trousers'),'men-jeans':text=>text.includes('men / jeans')||text.includes('men / denim'),'men-cargo':text=>text.includes('men / cargo')};
function refresh(){const term=(searchInput?.value||'').trim().toLowerCase();const active=document.querySelector('.filter.active,.filter-btn.active')?.dataset.filter||'all';products.forEach(card=>{const cat=(card.dataset.category||'').toLowerCase(),text=card.textContent.toLowerCase();let categoryOK=active==='all'||cat===active;if(categoryParam&&categoryRules[categoryParam])categoryOK=categoryRules[categoryParam](text);card.style.display=categoryOK&&(!term||text.includes(term))?'':'none'});if(categoryParam&&categoryRules[categoryParam]){filters.forEach(x=>x.classList.remove('active'));document.querySelector('[data-filter="all"]')?.classList.add('active')}}
filters.forEach(b=>b.addEventListener('click',()=>{filters.forEach(x=>x.classList.remove('active'));b.classList.add('active');refresh()}));
searchInput?.addEventListener('input',refresh);
function addEthnicCatalogueCard(){
 const grid=document.getElementById('productGrid');
 if(!grid||grid.querySelector('[data-ethnic-card]'))return;
 const card=document.createElement('article');card.className='product';card.dataset.ethnicCard='true';
 card.innerHTML='<a href="ethnic.html"><div class="product-img" style="background:linear-gradient(135deg,#eee8df,#d9c8ad);display:flex;align-items:center;justify-content:center"><div style="text-align:center;padding:20px"><span style="display:block;font-size:11px;letter-spacing:2px;margin-bottom:8px">ETHNIC COLLECTION</span><strong style="font-family:Playfair Display,serif;font-size:28px">Ethnic Wear</strong></div><span class="tag">ETHNIC</span></div><div class="product-info"><span>Ethnic / Traditional</span><h3>Ethnic Wear</h3><p>Open Ethnic collection →</p></div></a>';
 grid.appendChild(card);
}
function updateCatalogueCopy(){
 const flexible=document.querySelector('.benefits div:nth-child(4) span');if(flexible)flexible.textContent='Men • Women • Kids • Ethnic';
 const faq=document.querySelectorAll('.faq details')[1]?.querySelector('p');if(faq&&!faq.textContent.toLowerCase().includes('ethnic'))faq.textContent+=' Our catalogue also includes ethnic wear and traditional styles.';
}
addEthnicCatalogueCard();updateCatalogueCopy();
const imageMap={'mens-tshirt':'Gamer Spirit T-Shirt _ Minimal Gaming Shirt.jpeg','mens-polo':'Men Colourblock Regular Fit Polo T-Shirt.jpeg','mens-shirt':'download (3).jpeg','mens-jeans':'DAIME Mens Ice Blue Baggy Jeans (DYM-114).jpeg','mens-cargo':'download (1).jpeg'};
Object.entries(imageMap).forEach(([product,file])=>{const card=document.querySelector(`a[href="product.html?product=${product}"]`);const img=card?.querySelector('.product-img img');if(img){img.src=file;img.removeAttribute('srcset');img.loading='lazy';}});
document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.href=`mailto:${email}`);
const form=document.getElementById('inquiryForm');form?.addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(form).entries());const msg=`Hello Clothing Hub Egypt, I would like a wholesale quotation.\n\nName: ${d.name||''}\nCompany: ${d.company||''}\nEmail: ${d.email||''}\nCountry: ${d.country||''}\nProduct: ${d.product||''}\nQuantity: ${d.quantity||''}\nRequirements: ${d.message||''}`;window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`,'_blank','noopener,noreferrer');form.reset()});
const footer=document.querySelector('footer');if(footer){const cols=footer.querySelectorAll('.footer-top>div');if(cols.length>=4){cols[2].innerHTML='<b>Customer Information</b><a href="#about">About Us</a><a href="#faq">FAQ</a><a href="shipping-policy.html">Shipping Policy</a><a href="refund-cancellation.html">Refund & Cancellation</a><a href="privacy-policy.html">Privacy Policy</a><a href="terms.html">Terms & Conditions</a>';cols[3].innerHTML=`<b>Contact</b><a href="mailto:${email}">${email}</a><a href="#inquiry">Wholesale Inquiry</a><span>International wholesale support</span>`;}}
refresh();
});