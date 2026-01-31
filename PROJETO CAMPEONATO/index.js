document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

const header = document.getElementById('header');
let lastScrollY = window.pageYOffset;

function updateHeader() {
  const currentScrollY = window.pageYOffset;
  
  if (currentScrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
}

window.addEventListener('scroll', updateHeader, { passive: true });

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll(
  '.format-card, .timeline-item, .req-item, .prize-showcase, .register-section'
);

animatedElements.forEach(element => {
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  fadeInObserver.observe(element);
});

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000) {
    return 'R$' + num;
  }
  return num.toString();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statValues = entry.target.querySelectorAll('.stat-value');
      
      statValues.forEach(stat => {
        const text = stat.textContent;
        
        if (text.includes('R$500')) {
          stat.textContent = 'R$0';
          animateCounter(stat, 500);
        } else if (text === '4') {
          stat.textContent = '0';
          animateCounter(stat, 4);
        } else if (text.includes('R$25')) {
          stat.textContent = 'R$0';
          animateCounter(stat, 25);
        }
      });
      
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  statsObserver.observe(heroStats);
}

const mobileMenuBtn = document.getElementById('mobileMenu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileMenuBtn.classList.remove('active');
    });
  });
}

const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .nav-links.active {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: var(--dark-alt);
      padding: 2rem;
      gap: 1.5rem;
      border-top: 1px solid var(--border);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    }

    .mobile-menu.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu.active span:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }
  }
`;
document.head.appendChild(style);

window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const circles = document.querySelectorAll('.bg-circle');
  
  circles.forEach((circle, index) => {
    const speed = (index + 1) * 0.05;
    circle.style.transform = `translateY(${scrolled * speed}px)`;
  });
}, { passive: true });

console.log('%c🏆 Copa LoL 2026 ', 'color: #0AC8B9; font-weight: 700; font-size: 16px; background: #0A0E17; padding: 10px 20px; border-radius: 5px;');
console.log('%c⚔️ Sistema inicializado com sucesso!', 'color: #10B981; font-size: 14px; font-weight: 600;');
console.log('%cBoa sorte no torneio! 🎮', 'color: #FFB800; font-size: 12px;');

updateHeader();