document.addEventListener('DOMContentLoaded', () => {

  /* ==============================================
     POPUP ELEMENTS3
     ============================================== */
  const popupBackdrop = document.getElementById('popupBackdrop');
  const popupCard     = document.getElementById('popupCard');
  const popupClose    = document.getElementById('popupClose');
  const popupMedia    = document.getElementById('popupMedia');
  const popupTitle    = document.getElementById('popupTitle');
  const popupDesc     = document.getElementById('popupDescription');
  const popupDate     = document.getElementById('popupDate');
  const popupMedium   = document.getElementById('popupMedium');

  /* -- Open Popup Function -- */
  function openPopup(data) {
    if (!popupCard) return;

    // Clear previous content
    popupMedia.innerHTML = '';

    // Handle Media Types (Image/Video/YouTube)
    if (data.type === 'image') {
      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.title || '';
      popupMedia.appendChild(img);
    } else if (data.type === 'video') {
      const video = document.createElement('video');
      video.src = data.src;
      video.controls = true;
      video.autoplay = true;
      popupMedia.appendChild(video);
    } else if (data.type === 'youtube') {
  const iframe = document.createElement('iframe');
  
  // 1. Construct the URL (rel=0 removes related videos, enablejsapi=1 helps with controls)
  iframe.src = `https://www.youtube.com/embed/${data.src}?autoplay=1&rel=0&enablejsapi=1`;
  
  // 2. CRITICAL: Grant sensor permissions for the 360 navigation compass
  iframe.allow = 'autoplay;呈现; fullscreen; gyroscope; accelerometer; picture-in-picture';
  
  // 3. Standard iframe settings
  iframe.allowFullscreen = true;
  iframe.title = data.title || 'YouTube Video';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0';
  
  popupMedia.appendChild(iframe);
}
    

    // Fill Text Info
    if (popupTitle)  popupTitle.textContent  = data.title || '';
    if (popupDesc)   popupDesc.textContent   = data.description || '';
    if (popupDate)   popupDate.textContent   = data.date || '';
    if (popupMedium) popupMedium.textContent = data.medium || '';

    // Show elements
    popupBackdrop.classList.add('visible');
    popupCard.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  /* -- Close Popup Function -- */
  function closePopup() {
    popupCard.classList.remove('visible');
    popupBackdrop.classList.remove('visible');
    document.body.style.overflow = '';
    // Small delay to clear media after fade out
    setTimeout(() => { popupMedia.innerHTML = ''; }, 350);
  }

  /* ==============================================
     EVENT LISTENERS
     ============================================== */

  // 1. Attach to HERO slider cards
  const sliderCards = document.querySelectorAll('.card');
  sliderCards.forEach(card => {
    card.addEventListener('click', () => openPopup(card.dataset));
  });

  // 2. Attach to GALLERY grid items
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => openPopup(item.dataset));
  });

  // 3. Close Triggers
  if (popupClose) popupClose.addEventListener('click', closePopup);
  if (popupBackdrop) popupBackdrop.addEventListener('click', closePopup);
  
  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });

  /* ==============================================
     SLIDER DRAG / TOUCH SCROLL
     Enables mouse drag on desktop and touch swipe on mobile.
     Vertical swipes pass through to the page scroll normally.
     ============================================== */
  const sliderSection = document.querySelector('.slider-section');

  if (sliderSection) {
    let startX = 0;
    let startY = 0;
    let startScrollLeft = 0;
    let isDragging = false;
    let dragMoved = false;
    const gallery = sliderSection.querySelector('.gallery');

    /* ---- TOUCH (mobile) ---- */
    sliderSection.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startScrollLeft = sliderSection.scrollLeft;
      isDragging = true;
      dragMoved = false;
    }, { passive: true });

    sliderSection.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // If moving more vertically than horizontally, let the page scroll
      if (!dragMoved && Math.abs(dy) > Math.abs(dx)) {
        isDragging = false;
        return;
      }

      dragMoved = true;
      sliderSection.scrollLeft = startScrollLeft - dx;
    }, { passive: true });

    sliderSection.addEventListener('touchend', () => {
      isDragging = false;
    });

    /* ---- MOUSE DRAG (desktop fallback) ---- */
    sliderSection.addEventListener('mousedown', (e) => {
      startX = e.clientX;
      startScrollLeft = sliderSection.scrollLeft;
      isDragging = true;
      dragMoved = false;
      if (gallery) gallery.classList.add('is-dragging');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) dragMoved = true;
      sliderSection.scrollLeft = startScrollLeft - dx;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      if (gallery) gallery.classList.remove('is-dragging');
    });

    // Prevent card click from firing after a drag
    sliderSection.addEventListener('click', (e) => {
      if (dragMoved) e.stopPropagation();
    }, true);
  }

  /* ==============================================
     GALLERY FILTER LOGIC (Original)
     ============================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

});