// Music Control Functionality - Hanya bunyi saat tab aktif
function initMusicControl() {
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicControl = document.getElementById('musicControl');
    const musicIcon = musicControl.querySelector('.music-icon');
    
    // Set initial state - wajib hidup
    backgroundMusic.volume = 0.3;
    musicIcon.textContent = '🔊';
    musicControl.style.cursor = 'not-allowed';
    musicControl.title = 'Musik wajib hidup';

    let isPlaying = false;

    // Function untuk play musik
    function playMusic() {
        if (!isPlaying) {
            backgroundMusic.play().then(() => {
                isPlaying = true;
                console.log('Musik background diputar');
            }).catch(error => {
                console.log('Gagal memutar musik:', error);
            });
        }
    }

    // Function untuk pause musik
    function pauseMusic() {
        if (isPlaying) {
            backgroundMusic.pause();
            isPlaying = false;
            console.log('Musik di-pause');
        }
    }

    // Function untuk start music dari luar
    window.startBackgroundMusic = function() {
        playMusic();
    };

    // Handle page visibility changes - pause saat tab tidak aktif
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    // Prevent any click action on music control
    musicControl.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        
        // Show brief message
        const originalBackground = musicControl.style.background;
        musicControl.style.background = 'var(--accent)';
        setTimeout(() => {
            musicControl.style.background = originalBackground;
        }, 300);
    });

    // Prevent context menu on music control
    musicControl.addEventListener('contextmenu', function(event) {
        event.preventDefault();
    });
}

// Video Intro Functionality dengan animasi keren
function initVideoIntro() {
    const videoIntro = document.getElementById('videoIntro');
    const introVideo = document.getElementById('introVideo');
    const mainContent = document.getElementById('mainContent');
    const skipBtn = document.getElementById('skipBtn');
    const playIntroBtn = document.getElementById('playIntroBtn');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.getElementById('progressFill');
    const loadingText = document.querySelector('.loading-text');
    const titleTexts = document.querySelectorAll('.loading-text h3');
    const instructionText = document.querySelector('.loading-text p');

    let videoLoaded = false;
    let progressInterval;

    // Update progress bar
    function updateProgress() {
        if (introVideo.duration) {
            const progress = (introVideo.currentTime / introVideo.duration) * 100;
            progressFill.style.width = progress + '%';
        }
    }

    // Animasi keren saat tombol diklik
    function playVideoWithAnimation() {
        // Animasi: hilangkan semua teks dan tombol dengan efek fade out
        playIntroBtn.style.transition = 'all 0.5s ease';
        playIntroBtn.style.opacity = '0';
        playIntroBtn.style.transform = 'scale(0.8)';
        
        titleTexts.forEach(title => {
            title.style.transition = 'all 0.5s ease';
            title.style.opacity = '0';
            title.style.transform = 'translateY(-20px)';
        });
        
        instructionText.style.transition = 'all 0.5s ease';
        instructionText.style.opacity = '0';
        instructionText.style.transform = 'translateY(-20px)';

        // Setelah animasi selesai, sembunyikan elemen dan tampilkan progress bar
        setTimeout(() => {
            playIntroBtn.style.display = 'none';
            titleTexts.forEach(title => title.style.display = 'none');
            instructionText.style.display = 'none';
            
            // Update teks loading
            const loadingMessage = document.createElement('p');
            loadingMessage.textContent = 'Memuat Undangan...';
            loadingMessage.style.color = 'white';
            loadingMessage.style.fontSize = '1.2rem';
            loadingMessage.style.marginTop = '20px';
            loadingMessage.style.opacity = '0';
            loadingMessage.style.transform = 'translateY(20px)';
            
            loadingText.appendChild(loadingMessage);
            
            // Tampilkan progress bar dengan efek fade in
            progressBar.style.display = 'block';
            progressBar.style.opacity = '0';
            progressBar.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                progressBar.style.transition = 'all 0.5s ease';
                progressBar.style.opacity = '1';
                progressBar.style.transform = 'translateY(0)';
                
                loadingMessage.style.transition = 'all 0.5s ease';
                loadingMessage.style.opacity = '1';
                loadingMessage.style.transform = 'translateY(0)';
            }, 50);

            // Play video setelah animasi selesai
            playVideo();

        }, 500);
    }

    // Play video dengan suara
    function playVideo() {
        // Set volume video
        introVideo.volume = 0.8;
        
        introVideo.play().then(() => {
            console.log('Video diputar dengan suara');
            
            // Start progress tracking
            progressInterval = setInterval(updateProgress, 100);
            
        }).catch(error => {
            console.log('Gagal memutar video dengan suara:', error);
            
            // Fallback: coba tanpa suara
            introVideo.muted = true;
            introVideo.play().then(() => {
                console.log('Video diputar tanpa suara');
                progressInterval = setInterval(updateProgress, 100);
            }).catch(error2 => {
                console.log('Fallback juga gagal:', error2);
                // Langsung skip ke main content
                showMainContent();
            });
        });
    }

    // Show main content and hide video
    function showMainContent() {
        // Stop video
        introVideo.pause();
        clearInterval(progressInterval);
        
        // Hide video intro dengan animasi
        videoIntro.style.transition = 'all 0.8s ease';
        videoIntro.style.opacity = '0';
        videoIntro.style.transform = 'scale(0.9)';
        
        setTimeout(() => {
            videoIntro.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Trigger show animation untuk main content
            setTimeout(() => {
                mainContent.classList.add('show');
                
                // Initialize main content features
                initMainContent();
                
                // ⭐ AUTO PLAY MUSIK WAJIB HIDUP ⭐
                window.startBackgroundMusic();
            }, 100);
        }, 800);
    }

    // Video event listeners
    introVideo.addEventListener('loadeddata', function() {
        videoLoaded = true;
        console.log('Video loaded successfully');
    });

    introVideo.addEventListener('ended', function() {
        clearInterval(progressInterval);
        showMainContent();
    });

    introVideo.addEventListener('error', function(e) {
        console.error('Video error:', e);
        showMainContent();
    });

    // Play button event
    playIntroBtn.addEventListener('click', playVideoWithAnimation);

    // Skip button
    skipBtn.addEventListener('click', function() {
        clearInterval(progressInterval);
        showMainContent();
    });

    // Auto-skip jika video takes too long to load
    setTimeout(() => {
        if (!videoLoaded) {
            console.log('Video loading timeout, skipping to main content');
            showMainContent();
        }
    }, 10000);
}

// Initialize main content features
function initMainContent() {
    // Update countdown immediately and every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Initialize animations and effects
    createCombatDoves();
    initInteractiveElements();

    // Auto load maps after 3 seconds
    setTimeout(() => {
        loadMaps();
    }, 3000);
}

// Countdown timer
function updateCountdown() {
    const targetDate = new Date("2025-11-26T17:00:00+07:00").getTime();
    const now = new Date().getTime();
    const distance = targetDate - now;

    const countdownElement = document.getElementById("countdown");

    if (distance < 0) {
        countdownElement.innerHTML = 
            '<div style="padding: 20px; font-size: 1.5em; font-weight: bold; color: white;">🎉 ACARA SEDANG BERLANGSUNG 🎉</div>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Add animation when numbers change
    const animateValue = (element, newValue) => {
        const oldValue = parseInt(element.textContent);
        if (oldValue !== newValue) {
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.textContent = newValue.toString().padStart(2, '0');
                element.style.transform = 'scale(1)';
            }, 150);
        } else {
            element.textContent = newValue.toString().padStart(2, '0');
        }
    };

    animateValue(document.getElementById("days"), days);
    animateValue(document.getElementById("hours"), hours);
    animateValue(document.getElementById("minutes"), minutes);
    animateValue(document.getElementById("seconds"), seconds);
}

// Fungsi untuk memuat peta
function loadMaps() {
    const overlay = document.getElementById('mapsOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Create combat doves
function createCombatDoves() {
    const backgroundAnimation = document.querySelector('.background-animation');
    const doveSymbols = ['🦅', '⚡', '🎯', '🛡️', '🚀', '✈️'];
    
    for (let i = 1; i <= 6; i++) {
        const dove = document.createElement('div');
        dove.className = `combat-dove dove-${i}`;
        dove.textContent = doveSymbols[i - 1];
        dove.style.animationDelay = `${(i - 1) * 3}s`;
        if (backgroundAnimation) {
            backgroundAnimation.appendChild(dove);
        }
    }
}

// Interactive elements
function initInteractiveElements() {
    // Add click effect to logos
    const logos = document.querySelectorAll('.logo');
    logos.forEach(logo => {
        logo.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.maps-button, .countdown-item, .load-maps-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Start everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMusicControl();
    initVideoIntro();
});
