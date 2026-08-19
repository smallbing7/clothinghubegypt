document.addEventListener('DOMContentLoaded', () => {
  const whatsapp = '201112736689';
  const email = 'clothinghubegypt4@gmail.com';

  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNav = document.getElementById('mobileNav');
  mobileMenu?.addEventListener('click', () => mobileNav?.classList.toggle('open'));
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

  const searchBtn = document.getElementById('searchBtn');
  const searchbar = document.getElementById('searchbar');
  const searchInput = document.getElementById('searchInput');
  searchBtn?.addEventListener('click', () => {
    searchbar?.classList.toggle('open');
    if (searchbar?.classList.contains('open')) searchInput?.focus();
  });

  const products = [...document.querySelectorAll('.product')];
  const filters = [...document.querySelectorAll('.filter')];

  function refreshProducts() {
    const term = (searchInput?.value || '').trim().toLowerCase();
    const active = document.querySelector('.filter.active')?.dataset.filter || 'all';
    products.forEach(card => {
      const category = (card.dataset.category || '').toLowerCase();
      const text = card.textContent.toLowerCase();
      const visible = (active === 'all' || category === active) && (!term || text.includes(term));
      card.style.display = visible ? '' : 'none';
    });
  }

  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    refreshProducts();
  }));
  searchInput?.addEventListener('input', refreshProducts);

  document.querySelectorAll('.quick').forEach(button => {
    button.addEventListener('click', () => {
      const product = button.dataset.product || 'clothing';
      const message = `Hello Clothing Hub Egypt, I am interested in ${product}. Please send me wholesale price, MOQ, available quantity and shipping options.`;
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
  });

  const inquiryForm = document.getElementById('inquiryForm');
  inquiryForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(inquiryForm).entries());
    const message = `Hello Clothing Hub Egypt, I would like to make a wholesale inquiry.\n\nName: ${data.name || ''}\nCompany: ${data.company || ''}\nEmail: ${data.email || ''}\nCountry: ${data.country || ''}\nProduct: ${data.product || ''}\nQuantity: ${data.quantity || ''}\nRequirements: ${data.message || ''}`;

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    const formMessage = document.getElementById('formMessage');
    if (formMessage) formMessage.textContent = `WhatsApp opened. You can also email us at ${email}.`;
    inquiryForm.reset();
  });

  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.href = `mailto:${email}`;
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', event => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  refreshProducts();
});