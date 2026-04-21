document.addEventListener('DOMContentLoaded', () => {

let touchStartY = 0;
let isMoving = false;

// Apply to the whole section to ensure vertical swipes are passed through
const sliderSection = document.querySelector('.slider-section');

sliderSection.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].pageY;
  isMoving = false;
}, { passive: true });

sliderSection.addEventListener('touchmove', (e) => {
  const touchY = e.touches[0].pageY;
  // If the finger moves more than 5px vertically, the user is scrolling the page
  if (Math.abs(touchY - touchStartY) > 5) {
    isMoving = true; 
  }
}, { passive: true });

// Modify your card click listener to check 'isMoving'
const allClickableItems = document.querySelectorAll('.card, .gallery-item');
allClickableItems.forEach(item => {
  item.addEventListener('click', (e) => {
    if (isMoving) {
      // It was a scroll, not a click. Don't open the popup.
      return;
    }
    openPopup(item.dataset);
  });
});

  /* ==============================================
     POPUP ELEMENTS
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
  sliderCards.forEach(card => {
  card.addEventListener('click', () => {
    openPopup(card.dataset);
  }, { passive: true }); // Tells Safari this won't block scrolling
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