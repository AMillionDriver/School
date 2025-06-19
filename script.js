/**
 * script.js - Axolotl Internasional High School (AIHS)
 * Terhubung ke: hamburger menu, scroll link aktif, slider, form kontak, dan chatbot.
 * Author: ChatGPT x Sky
 * Last Update: 19 Juni 2025
 */

document.addEventListener('DOMContentLoaded', () => {
  // === 1. MENU NAVIGASI MOBILE ===
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('nav-active');

    const icon = navToggle.querySelector('i');
    icon.classList.toggle('bi-list');
    icon.classList.toggle('bi-x');
  });

  // === 2. SCROLL SPY AKTIFKAN LINK NAVBAR ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#main-nav a');

  const activateMenuLinkOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const height = section.offsetHeight;
      const top = section.offsetTop - 120;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY <= top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', activateMenuLinkOnScroll);
  activateMenuLinkOnScroll(); // Trigger on load

  // === 3. SLIDER (Aktivitas & Sertifikat) ===
  const initSlider = (sliderId, prevBtnClass, nextBtnClass) => {
    const slider = document.getElementById(sliderId);
    const prev = document.querySelector(prevBtnClass);
    const next = document.querySelector(nextBtnClass);

    if (!slider || !prev || !next) return;

    const itemWidth = slider.querySelector('.slider-item')?.offsetWidth || 320;
    const gap = 20;

    next.addEventListener('click', () => {
      slider.scrollBy({ left: itemWidth + gap, behavior: 'smooth' });
    });

    prev.addEventListener('click', () => {
      slider.scrollBy({ left: -itemWidth - gap, behavior: 'smooth' });
    });
  };

  initSlider('activity-slider', '.prev-activity', '.next-activity');
  initSlider('cert-slider', '.prev-cert', '.next-cert');

  // === 4. FORM KONTAK (Simulasi Submit) ===
  const contactForm = document.getElementById('contactForm');
  const formFeedback = document.getElementById('formFeedback');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nama = contactForm.querySelector('input[name="nama"]').value.trim();
    formFeedback.textContent = `Terima kasih, ${nama}! Pesan Anda telah terkirim.`;
    formFeedback.style.color = 'green';
    formFeedback.style.marginTop = '1rem';

    setTimeout(() => {
      contactForm.reset();
      formFeedback.textContent = '';
    }, 4000);
  });

  // === 5. CHATBOT INTERAKTIF ===
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatbotModal = document.getElementById('chatbotModal');
  const chatbotClose = document.getElementById('chatbotClose');
  const chatbotForm = document.getElementById('chatbotForm');
  const chatbotInput = document.getElementById('chatbotInput');
  const chatbotBody = document.getElementById('chatbotBody');

  chatbotBtn?.addEventListener('click', () => {
    chatbotModal.style.display = 'flex';
  });

  chatbotClose?.addEventListener('click', () => {
    chatbotModal.style.display = 'none';
  });

  chatbotForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = chatbotInput.value.trim();
    if (input === '') return;

    appendMessage(input, 'user');
    chatbotInput.value = '';

    setTimeout(() => {
      const response = getBotResponse(input.toLowerCase());
      appendMessage(response, 'bot');
    }, 500);
  });

  const appendMessage = (text, sender) => {
    const msg = document.createElement('div');
    msg.className = `chatbot-message chatbot-message-${sender}`;
    msg.innerHTML = text;
    chatbotBody.appendChild(msg);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const getBotResponse = (input) => {
    if (input.includes('biaya') || input.includes('spp')) {
      return 'Biaya pendaftaran dan SPP bisa dicek langsung ke +62 21 8888 9090 atau email info@aihs.id.';
    } else if (input.includes('pendaftaran') || input.includes('daftar')) {
      return 'Pendaftaran dibuka 1 - 12 Juli 2024. Info lengkap di bagian Berita & Pengumuman.';
    } else if (input.includes('fasilitas')) {
      return 'Fasilitas kami: Lab Komputer, Perpustakaan Digital, Green Park, Lapangan Olahraga.';
    } else if (input.includes('lokasi') || input.includes('alamat')) {
      return 'Alamat kami: Jl. Inspirasi No.7, Jakarta.';
    } else if (input.includes('halo') || input.includes('hai')) {
      return 'Halo juga! Ada yang bisa saya bantu tentang AIHS?';
    } else if (input.includes('terima kasih')) {
      return 'Sama-sama! Semoga harimu menyenangkan~';
    } else {
      return 'Maaf, saya belum paham. Coba tanya "pendaftaran", "biaya", atau "alamat".';
    }
  };
});