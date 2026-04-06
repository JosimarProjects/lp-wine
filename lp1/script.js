// ===== PARTNER CONFIG =====
// Each Flip partner gets their own URL params
// Example: ?partner=joao&name=João+Silva
const params = new URLSearchParams(window.location.search);
const partnerSlug = params.get('partner') || params.get('utm_campaign') || 'parceiro';
const partnerName = params.get('name') || formatSlug(partnerSlug);

function formatSlug(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

// Apply partner name throughout the page
const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
setText('partnerName', partnerName);
setText('heroPartner', partnerName);
setText('aboutPartnerTitle', partnerName);

// First name for sections
const firstName = partnerName.split(' ')[0];
setText('winesSectionName', firstName);

// Update page title
document.title = `${partnerName} | Wine x Flip - Vinhos Selecionados`;

// ===== WINE FILTERS =====
const filterBtns = document.querySelectorAll('.filter-btn');
const wineCards = document.querySelectorAll('.wine-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    wineCards.forEach(card => {
      if (filter === 'todos' || card.dataset.type === filter) {
        card.style.display = '';
        card.style.animation = 'fadeUp 0.4s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
  threshold: 0.05,
  rootMargin: '0px 0px 80px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animations to sections
// Wine cards - scale in with stagger
document.querySelectorAll('.wine-card').forEach((card, i) => {
  card.classList.add('scale-in');
  card.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(card);
});

// Benefits - fade in with stagger
document.querySelectorAll('.benefit').forEach((b, i) => {
  b.classList.add('fade-in');
  b.style.transitionDelay = `${i * 0.1}s`;
  observer.observe(b);
});

// Creator photo - slide from left
document.querySelectorAll('.creator-photo-wrap').forEach(el => {
  el.classList.add('slide-left');
  observer.observe(el);
});

// Creator info elements - slide from right
document.querySelectorAll('.creator-info .section-tag, .creator-info h2, .creator-info .creator-role, .creator-info .creator-bio').forEach((el, i) => {
  el.classList.add('slide-right');
  el.style.transitionDelay = `${0.1 + i * 0.12}s`;
  observer.observe(el);
});

// Plan cards - fade in with stagger
document.querySelectorAll('.plan-card').forEach((card, i) => {
  card.classList.add('fade-in');
  card.style.transitionDelay = `${i * 0.15}s`;
  observer.observe(card);
});

// Club endorsement - scale in
document.querySelectorAll('.club-creator-endorsement').forEach(el => {
  el.classList.add('scale-in');
  observer.observe(el);
});

// CTA - fade in
document.querySelectorAll('.cta-content').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// Section headers - fade in
document.querySelectorAll('.section-header').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 150) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== SMOOTH SCROLL for nav links =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ===== ADD TO CART BUTTON FEEDBACK =====
document.querySelectorAll('.btn-wine').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const original = btn.textContent;
    btn.textContent = 'Adicionado!';
    btn.style.background = '#2ECC71';
    btn.style.borderColor = '#2ECC71';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.style.borderColor = '';
    }, 1500);
  });
});

// ===== TRACK UTM PARAMS (Flip Integration) =====
const utmSource = params.get('utm_source') || 'flipnet';
const utmCampaign = params.get('utm_campaign') || partnerSlug;
const utmContent = params.get('utm_content') || '';

// Append UTM to all outbound links
document.querySelectorAll('a[href^="http"]').forEach(link => {
  const url = new URL(link.href);
  url.searchParams.set('utm_source', utmSource);
  url.searchParams.set('utm_campaign', utmCampaign);
  if (utmContent) url.searchParams.set('utm_content', utmContent);
  link.href = url.toString();
});

// Add CSS animation keyframe
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// ===== COUPON COPY =====
const couponTicket = document.getElementById('couponTicket');
const couponEl = document.getElementById('couponCode');
if (couponTicket && couponEl) {
  couponTicket.addEventListener('click', () => {
    navigator.clipboard.writeText(couponEl.textContent).then(() => {
      const original = couponEl.textContent;
      const hintEl = couponTicket.querySelector('.coupon-hint');
      couponEl.textContent = 'COPIADO!';
      if (hintEl) hintEl.textContent = 'Cupom copiado com sucesso!';
      couponTicket.classList.add('copied');
      setTimeout(() => {
        couponEl.textContent = original;
        if (hintEl) hintEl.textContent = 'Clique para copiar';
        couponTicket.classList.remove('copied');
      }, 2000);
    });
  });
}

// ===== CREATOR SLIDESHOW =====
const slides = document.querySelectorAll('.creator-slide');
const dots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;

function goToSlide(index) {
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentSlide = index;
}

if (slides.length > 1) {
  setInterval(() => {
    goToSlide((currentSlide + 1) % slides.length);
  }, 3500);

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goToSlide(i));
  });
}

console.log(`[Wine x Flip LP] Partner: ${partnerName} | UTM: ${utmSource}/${utmCampaign}`);
