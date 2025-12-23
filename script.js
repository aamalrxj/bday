window.addEventListener("DOMContentLoaded", () => {
  // Slideshow (auto + dots) - IMPROVED
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let slideInterval;

  const showSlide = (index) => {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));
    
    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");
    currentSlide = index;
  };

  const nextSlide = () => {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  };

  const startSlideshow = () => {
    // 5 second interval (longer for better viewing)
    slideInterval = setInterval(nextSlide, 5000);
  };

  // Dot click handlers
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      clearInterval(slideInterval);
      showSlide(index);
      startSlideshow(); // Restart auto slideshow
    });
  });

  // Initialize slideshow
  showSlide(0);
  startSlideshow();

  // Music player - ENHANCED
  const audio = document.getElementById("bgMusic");
  const playBtn = document.getElementById("playBtn");

  if (audio && playBtn) {
    let isPlaying = false;

    const updateButton = () => {
      playBtn.innerHTML = isPlaying
        ? '<span class="btn-icon">⏸️</span>Pause music'  // Emoji pause icon
        : '<span class="btn-icon">🎵</span>Play music';
      playBtn.classList.toggle("is-playing", isPlaying);
    };

    playBtn.addEventListener("click", async () => {
      try {
        if (!isPlaying) {
          // Resume from current position
          await audio.play();
          isPlaying = true;
          console.log("Music started");
        } else {
          audio.pause();
          isPlaying = false;
          console.log("Music paused");
        }
        updateButton();
      } catch (err) {
        console.error("Audio playback failed:", err);
        // Better error message for mobile users
        if (err.name === 'NotAllowedError') {
          alert("🎵 Music blocked by browser. Tap 'Play music' button to start!");
        } else {
          alert("Audio error. Please refresh and try again.");
        }
      }
    });

    // Pause when page is hidden (tab switch, mobile app switch)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && isPlaying) {
        audio.pause();
        isPlaying = false;
        updateButton();
      }
    });

    // Handle mobile resume (iOS Safari fix)
    document.addEventListener("pageshow", () => {
      if (isPlaying) {
        audio.currentTime = 0; // Restart from beginning on page reload
      }
    });

    // Preload audio for better performance
    audio.preload = "auto";
    audio.volume = 0.7; // Slightly lower volume for better experience
  }

  // Touch/swipe support for slideshow (mobile)
  let startX = 0;
  let startY = 0;

  const slideshowContainer = document.querySelector(".slideshow-container");
  
  if (slideshowContainer) {
    slideshowContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });

    slideshowContainer.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      // Horizontal swipe only (ignore vertical scroll)
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          // Swipe left - next slide
          clearInterval(slideInterval);
          nextSlide();
          startSlideshow();
        } else {
          // Swipe right - previous slide
          clearInterval(slideInterval);
          const prev = (currentSlide - 1 + slides.length) % slides.length;
          showSlide(prev);
          startSlideshow();
        }
      }
    });
  }

  // Performance: Reduce animations on low-end devices
  if ('matchMedia' in window && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.animation = 'none';
  }
});
    