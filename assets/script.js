const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#main-nav');
const themeToggle = document.querySelector('.theme-toggle');

const setTheme = (isDark) => {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  localStorage.setItem('Muskverse-theme', isDark ? 'dark' : 'light');
};

const savedTheme = localStorage.getItem('Muskverse-theme');
setTheme(savedTheme === 'dark');
themeToggle?.addEventListener('click', () => {
  setTheme(document.documentElement.dataset.theme !== 'dark');
});

document.querySelectorAll('.auth-password-toggle').forEach((passwordToggle) => {
  passwordToggle.addEventListener('click', () => {
    const input = passwordToggle.previousElementSibling;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(isHidden));
    passwordToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
});

const authForm = document.querySelector('.auth-form');
const confirmPasswordInput = document.querySelector('#signup-confirm-password');
confirmPasswordInput?.addEventListener('input', () => {
  const password = document.querySelector('#signup-password');
  confirmPasswordInput.setCustomValidity(
    password && confirmPasswordInput.value !== password.value ? "Passwords don't match" : ''
  );
});
authForm?.addEventListener('submit', (event) => {
  event.preventDefault();
});

const hero = document.querySelector('.hero');
const heroTitle = document.querySelector('[data-hero-title]');
const heroDescription = document.querySelector('[data-hero-description]');
const heroDots = document.querySelectorAll('.hero-dots button');
const heroSlides = [
  {
    image: 'images/pexels-spacex-586054.jpg',
    title: "Own a Stake in<br>Humanity's Next<br><em>Frontier</em>",
    description: "Gain exclusive access to a limited investment opportunity in one of the world's most innovative companies and participate in the future of space exploration, satellite communications, and interplanetary technology."
  },
  {
    image: 'images/pexels-kampus-8353831.jpg',
    title: "You manage your life.<br>We'll manage your<br><em>investing.</em>",
    description: "Backed by seasoned professionals and disciplined strategy, we make growing your wealth simple. No jargon, no guesswork just trusted guidance built around your goals."
  },
  {
    image: 'images/pexels-tima-miroshnichenko-7567525.jpg',
    title: "One Platform. Every<br><em>Opportunity.</em>",
    description: "Stocks, ETFs, real estate, crypto, and exclusive deals all in one place, built to help you grow real, long-term wealth. Start Investing. See What's Inside."
  }
];
let activeHeroSlide = 0;
let heroTransitionTimer;

const showHeroSlide = (index) => {
  if (index === activeHeroSlide && hero.style.getPropertyValue('--hero-current-image')) return;
  activeHeroSlide = index;
  const slide = heroSlides[index];
  clearTimeout(heroTransitionTimer);
  hero.style.setProperty('--hero-next-image', `url("${slide.image}")`);
  hero.classList.add('is-transitioning');
  hero.querySelector('.hero-copy').classList.add('is-transitioning');
  heroTransitionTimer = setTimeout(() => {
    heroTitle.innerHTML = slide.title;
    heroDescription.textContent = slide.description;
    hero.style.setProperty('--hero-current-image', `url("${slide.image}")`);
    hero.classList.remove('is-transitioning');
    hero.querySelector('.hero-copy').classList.remove('is-transitioning');
  }, 260);
  heroDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
};

if (hero) {
  hero.style.setProperty('--hero-current-image', `url("${heroSlides[0].image}")`);
  heroDots.forEach((dot, index) => dot.addEventListener('click', () => showHeroSlide(index)));
  window.setInterval(() => showHeroSlide((activeHeroSlide + 1) % heroSlides.length), 6000);
}

const productTabs = document.querySelectorAll('[data-product]');
const productPanels = document.querySelectorAll('[data-product-panel]');
productTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    productTabs.forEach((item) => item.classList.toggle('active', item === tab));
    productPanels.forEach((panel) => panel.classList.toggle('active', panel.dataset.productPanel === tab.dataset.product));
  });
});

const testimonials = [
  ['"What sold me was the real estate access. Being able to earn from vetted property assets without the landlord headaches fits my life perfectly."', 'CA', 'Chris Andrade', 'Pro Racing Driver'],
  ['"I\'ve used a few platforms, but none gave me everything in one place, stocks, ETFs, and crypto under a single dashboard. The interface is intuitive and the fees are refreshingly honest."', 'JM', 'Javier Moreno', 'Marketing Director'],
  ['"I never had time to actively manage my money, so the automated portfolios were a game changer. I set my goals once, and it just works in the background."', 'MW', 'Marcus Whitfield', 'Engineering Manager'],
  ['"The IPO and marketplace access opened doors I didn\'t think were available to someone like me. Every opportunity feels researched and considered, not hyped."', 'AV', 'Anna Volkova', 'Biologist'],
  ['"Becoming a VIP member was worth it for the dedicated advisor alone. Having a real person to talk strategy with completely changed how confident I feel."', 'TK', 'Tomasz Kowalski', 'Civil Engineer'],
  ['"What stood out here is the transparency, clear fees, real research behind every opportunity, and access to deals I would not normally see."', 'WZ', 'Wei Zhang', 'Data Analyst']
];
const testimonialQuote = document.querySelector('[data-testimonial-quote]');
const testimonialAvatar = document.querySelector('[data-testimonial-avatar]');
const testimonialName = document.querySelector('[data-testimonial-name]');
const testimonialRole = document.querySelector('[data-testimonial-role]');
const testimonialDots = document.querySelectorAll('[data-testimonial-dot]');
const showTestimonial = (index) => {
  const [quote, avatar, name, role] = testimonials[index];
  if (testimonialQuote) testimonialQuote.textContent = quote;
  if (testimonialAvatar) testimonialAvatar.textContent = avatar;
  if (testimonialName) testimonialName.textContent = name;
  if (testimonialRole) testimonialRole.textContent = role;
  testimonialDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === index));
};
testimonialDots.forEach((dot) => dot.addEventListener('click', () => showTestimonial(Number(dot.dataset.testimonialDot))));
window.setInterval(() => {
  const current = [...testimonialDots].findIndex((dot) => dot.classList.contains('active'));
  showTestimonial((current + 1) % testimonials.length);
}, 7000);

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

mainNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const articleMore = document.querySelector('.article-detail-more');
if (articleMore) {
  const articleMoreInner = articleMore.querySelector('.article-detail-more-inner');
  if (articleMoreInner) {
    articleMoreInner.style.maxWidth = '1280px';
    articleMoreInner.style.padding = window.matchMedia('(max-width: 640px)').matches ? '0' : '0 24px';
    articleMoreInner.style.boxSizing = 'border-box';
  }

  const articleHeroInner = document.querySelector('.article-detail-hero-inner');
  const articleHeroTitle = document.querySelector('.article-detail-hero h1');
  const articleMoreGrid = articleMore.querySelector('.article-detail-more-grid');
  const isMobileArticle = window.matchMedia('(max-width: 640px)').matches;
  if (articleHeroInner) articleHeroInner.style.padding = isMobileArticle ? '64px 16px' : '80px 24px';
  if (articleHeroTitle) {
    articleHeroTitle.style.maxWidth = '700px';
    articleHeroTitle.style.marginLeft = 'auto';
    articleHeroTitle.style.marginRight = 'auto';
  }
  if (articleMore) articleMore.style.padding = isMobileArticle ? '64px 16px' : '80px 0';
  if (articleMoreGrid) {
    articleMoreGrid.style.gridTemplateColumns = isMobileArticle ? '1fr' : 'repeat(3, minmax(0, 1fr))';
  }

  const articleFooter = document.querySelector('.site-footer');
  if (articleFooter && !document.querySelector('.article-detail-cta')) {
    const articleCta = document.createElement('section');
    articleCta.className = 'final-cta article-detail-cta';
    articleCta.id = 'contact';
    articleCta.innerHTML = `
      <div class="page-width">
        <div class="final-cta-content">
          <p class="eyebrow">READY TO PUT YOUR MONEY TO WORK?</p>
          <p class="final-cta-description">muskverse Equity was founded with a simple goal: to provide dependable and professional investing services that clients can rely on. Over the years, we have built strong relationships with our investors.</p>
          <div class="final-cta-actions">
            <a class="final-cta-button final-cta-primary" href="mailto:support@Muskverseequity.com">Get Started</a>
            <a class="final-cta-button final-cta-secondary" href="about-us.html">Learn More</a>
          </div>
        </div>
      </div>`;
    articleFooter.before(articleCta);
  }
}

const revealTargets = document.querySelectorAll('main > section:not(.hero), .site-footer');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
}
