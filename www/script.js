// Dark mode detection
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.classList.add('dark');
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Navigation functions
function openSubPage(cardNumber, title, icon) {
    document.getElementById('subPageTitle').textContent = title;
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('subPage').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('subPage').style.opacity = '1';
    }, 50);
}

function goBack() {
    document.getElementById('subPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('mainPage').style.opacity = '1';
    }, 50);
}

// Intro page handling
function proceedToMainPage() {
    const introPage = document.getElementById('introPage');
    introPage.classList.add('intro-fade-out');
    setTimeout(() => {
        introPage.style.display = 'none';
        document.getElementById('mainPage').classList.remove('hidden');
        showMainPageCards();
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    const introVideo = document.getElementById('introVideo');
    if (introVideo) {
        introVideo.addEventListener('play', function() {
            setTimeout(() => {
                introVideo.pause();
                proceedToMainPage();
            }, 8000);
        });
        
        introVideo.addEventListener('ended', function() {
            proceedToMainPage();
        });
        
        introVideo.addEventListener('error', function(e) {
            setTimeout(proceedToMainPage, 3000);
        });
    } else {
        setTimeout(proceedToMainPage, 3000);
    }
});

function showMainPageCards() {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 150);
}

document.addEventListener('click', function(e) {
    if (e.target.closest('.card-hover')) {
        addClickEffect(e.target.closest('.card-hover'));
    }
});

// Video page functions
let songVideo = null;

function openVideoPage() {
    document.getElementById('subPage').classList.add('hidden');
    document.getElementById('videoPage').classList.remove('hidden');
    setTimeout(() => {
        initializeVideoPlayer();
    }, 100);
}

function goBackToSubPage() {
    if (songVideo && !songVideo.paused) {
        songVideo.pause();
    }
    document.getElementById('videoPage').classList.add('hidden');
    document.getElementById('subPage').classList.remove('hidden');
}

function initializeVideoPlayer() {
    songVideo = document.getElementById('songVideo');
    const loadingOverlay = document.getElementById('videoLoading');
    
    if (!songVideo) return;
    
    loadingOverlay.style.display = 'flex';
    
    songVideo.addEventListener('loadstart', () => {
        console.log('Video loading started...');
        loadingOverlay.style.display = 'flex';
    });
    
    songVideo.addEventListener('canplay', () => {
        console.log('Video can play');
        loadingOverlay.style.display = 'none';
    });
    
    songVideo.addEventListener('loadeddata', () => {
        console.log('Video data loaded');
        loadingOverlay.style.display = 'none';
    });
    
    songVideo.addEventListener('loadedmetadata', () => {
        console.log('Video metadata loaded');
        loadingOverlay.style.display = 'none';
    });
    
    songVideo.addEventListener('timeupdate', updateProgress);
    songVideo.addEventListener('ended', onVideoEnded);
    songVideo.addEventListener('play', onVideoPlay);
    songVideo.addEventListener('pause', onVideoPause);
    songVideo.addEventListener('error', (e) => {
        console.error('Video error:', e);
        loadingOverlay.style.display = 'none';
        showVideoError('Sorry, this video format is not supported in your browser. Please try using Chrome or Safari for better compatibility with .mov files.');
    });
    
    songVideo.volume = 0.8;
    songVideo.load();
}

function togglePlayPause() {
    if (!songVideo) return;
    
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    
    if (songVideo.paused) {
        songVideo.play().then(() => {
            playPauseIcon.textContent = '⏸️';
            playPauseText.textContent = 'Pause';
        }).catch(error => {
            console.error('Error playing video:', error);
            showVideoError('Unable to play video. Please try again.');
        });
    } else {
        songVideo.pause();
        playPauseIcon.textContent = '▶️';
        playPauseText.textContent = 'Play';
    }
}

function onVideoPlay() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    playPauseIcon.textContent = '⏸️';
    playPauseText.textContent = 'Pause';
}

function onVideoPause() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    playPauseIcon.textContent = '▶️';
    playPauseText.textContent = 'Play';
}

function onVideoEnded() {
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseText = document.getElementById('playPauseText');
    playPauseIcon.textContent = '▶️';
    playPauseText.textContent = 'Play';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('currentTime').textContent = '0:00';
}

function updateProgress() {
    if (!songVideo) return;
    const progress = (songVideo.currentTime / songVideo.duration) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('currentTime').textContent = formatTime(songVideo.currentTime);
}

function updateDuration() {
    if (!songVideo || isNaN(songVideo.duration)) return;
    document.getElementById('duration').textContent = formatTime(songVideo.duration);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function seekVideo(event) {
    if (!songVideo) return;
    const progressContainer = event.currentTarget;
    const clickX = event.offsetX;
    const width = progressContainer.offsetWidth;
    const percentage = clickX / width;
    songVideo.currentTime = songVideo.duration * percentage;
}

function toggleFullscreen() {
    if (!songVideo) return;
    
    try {
        if (!document.fullscreenElement) {
            if (songVideo.requestFullscreen) {
                songVideo.requestFullscreen();
            } else if (songVideo.webkitRequestFullscreen) {
                songVideo.webkitRequestFullscreen();
            } else if (songVideo.msRequestFullscreen) {
                songVideo.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    } catch (error) {
        console.error('Fullscreen error:', error);
        showVideoError('Fullscreen mode is not supported on this device.');
    }
}

function downloadVideo() {
    if (!songVideo || !songVideo.src) {
        showVideoError('No video source available for download.');
        return;
    }
    
    try {
        const link = document.createElement('a');
        link.href = songVideo.src;
        link.download = 'Wild_Animals_Song.mp4';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showVideoSuccess('Download started! Check your downloads folder.');
    } catch (error) {
        console.error('Download error:', error);
        showVideoError('Unable to download video. Please try right-clicking on the video and select "Save video as".');
    }
}

function showVideoError(message) {
    createVideoNotification(message, 'error');
}

function showVideoSuccess(message) {
    createVideoNotification(message, 'success');
}

function createVideoNotification(message, type) {
    const existingNotifications = document.querySelectorAll('.video-notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `video-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${
        type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="text-xl mr-2">${type === 'error' ? '❌' : '✅'}</span>
            <p class="text-sm">${message}</p>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

// Video keyboard controls
document.addEventListener('keydown', (e) => {
    if (document.getElementById('videoPage').classList.contains('hidden')) return;
    
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlayPause();
            break;
        case 'KeyF':
            e.preventDefault();
            toggleFullscreen();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            if (songVideo) songVideo.currentTime -= 10;
            break;
        case 'ArrowRight':
            e.preventDefault();
            if (songVideo) songVideo.currentTime += 10;
            break;
        case 'ArrowUp':
            e.preventDefault();
            if (songVideo) songVideo.volume = Math.min(1, songVideo.volume + 0.1);
            document.getElementById('volumeSlider').value = songVideo.volume * 100;
            break;
        case 'ArrowDown':
            e.preventDefault();
            if (songVideo) songVideo.volume = Math.max(0, songVideo.volume - 0.1);
            document.getElementById('volumeSlider').value = songVideo.volume * 100;
            break;
    }
});

// Animal Game functions
const animals = [
    { name: 'Lion', image: 'https://pfst.cf2.poecdn.net/base/image/ff55939c634b4c91c9445764242ede88c8fc9197674c8953548c381b9d0c5216?w=736&h=977', sound: 'Lion' },
    { name: 'Zebra', image: 'https://pfst.cf2.poecdn.net/base/image/2dd9a8b076581496f5ecbe1fc8ade798987b0fbc3b776581b7c6832b3b81650c?w=512&h=512', sound: 'Zebra' },
    { name: 'Monkey', image: 'https://pfst.cf2.poecdn.net/base/image/611919e519653db23c058fa61128b9e8d922303f0f9aebea46a29a803e017a1b?w=736&h=736', sound: 'Monkey' },
    { name: 'Giraffe', image: 'https://pfst.cf2.poecdn.net/base/image/f0fe919732bd90279a764815f3ec35d95b7d17c407d314b746d355a52fe73dc1?w=512&h=512', sound: 'Giraffe' },
    { name: 'Elephant', image: 'https://pfst.cf2.poecdn.net/base/image/340bb46a4273c8dc0392b08cb696936f32f8697a67db177cfcccffc3d43615cf?w=736&h=736', sound: 'Elephant' },
    { name: 'Crocodile', image: 'https://pfst.cf2.poecdn.net/base/image/59b1eb33afc9cfee3113c9b9c8776301dd10ff2dcfa885a06a2bb4045da2988c?w=1024&h=1024', sound: 'Crocodile' },
    { name: 'Cheetah', image: 'https://pfst.cf2.poecdn.net/base/image/bb6408fa314342f73cc844849d2ff2a08dc9c4ff872484cc389bb9517b794326?w=736&h=736', sound: 'Cheetah' },
    { name: 'Tiger', image: 'https://pfst.cf2.poecdn.net/base/image/b8d830c4826f1515d1a37f02286300e76513a85de5fee3a2cb7ced0f1ccf97cb?w=736&h=736', sound: 'Tiger' },
    { name: 'Kangaroo', image: 'https://pfst.cf2.poecdn.net/base/image/676a0f1f2086477b20dfadfb923b5315e8fb3daf939442aa4ca5b92749688db3?w=736&h=736', sound: 'Kangaroo' },
    { name: 'Bear', image: 'https://pfst.cf2.poecdn.net/base/image/78e93ce20ba4410c70d44c8f31811b0cc501775063d9529a6683ec50fd0c512b?w=686&h=681', sound: 'Bear' },
    { name: 'Gorilla', image: 'https://pfst.cf2.poecdn.net/base/image/b967027c10cd94da96ae500efaf1e3a45446bfc5f519066002acc09dc207e12c?w=736&h=977', sound: 'Gorilla' },
    { name: 'Fox', image: 'https://pfst.cf2.poecdn.net/base/image/2cb50a416a6af5a32c23d1114a86e39b1e8e37fc6d025585cc0b98a7cfcecdbf?w=736&h=977', sound: 'Fox' },
    { name: 'Wolf', image: 'https://pfst.cf2.poecdn.net/base/image/00c5bd042752adb9d01dd377664f8feafc6c664f36d66f5f294d46d9d474bf1b?w=768&h=768', sound: 'Wolf' },
    { name: 'Rhinoceros', image: 'https://pfst.cf2.poecdn.net/base/image/5c579590140cd1edc371d71e13498a20d0564b997cd5ab37db0eabb9ba5ef764?w=720&h=720', sound: 'Rhinoceros' },
    { name: 'Panda', image: 'https://pfst.cf2.poecdn.net/base/image/6c36fe0ec4dd99dcaf33b4a41fc9799160cbc5359cb57c9f28227e93790d3425?w=736&h=736', sound: 'Panda' },
    { name: 'Deer', image: 'https://pfst.cf2.poecdn.net/base/image/205b51cb58957cef0e4e2720dfffc0a1836522aadb15a7de75c9807a3120a143?w=462&h=640', sound: 'Deer' }
];

let currentAnimalIndex = 0;
let currentAudio = null;

function openAnimalGamePage() {
    document.getElementById('subPage').classList.add('hidden');
    document.getElementById('animalGamePage').classList.remove('hidden');
    currentAnimalIndex = 0;
    updateAnimalDisplay();
}

function goBackToSubPageFromGame() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    document.getElementById('animalGamePage').classList.add('hidden');
    document.getElementById('subPage').classList.remove('hidden');
}

function updateAnimalDisplay() {
    const animal = animals[currentAnimalIndex];
    document.getElementById('animalName').textContent = animal.name;
    document.getElementById('animalImage').src = animal.image;
    document.getElementById('animalImage').alt = animal.name;
    document.getElementById('animalCounter').textContent = `${currentAnimalIndex + 1} / ${animals.length}`;
    
    const prevButton = document.getElementById('prevAnimal');
    const nextButton = document.getElementById('nextAnimal');
    
    prevButton.style.opacity = currentAnimalIndex === 0 ? '0.5' : '1';
    nextButton.style.opacity = currentAnimalIndex === animals.length - 1 ? '0.5' : '1';
    
    prevButton.disabled = currentAnimalIndex === 0;
    nextButton.disabled = currentAnimalIndex === animals.length - 1;
}

function previousAnimal() {
    if (currentAnimalIndex > 0) {
        currentAnimalIndex--;
        updateAnimalDisplay();
        addAnimalTransition();
    }
}

function nextAnimal() {
    if (currentAnimalIndex < animals.length - 1) {
        currentAnimalIndex++;
        updateAnimalDisplay();
        addAnimalTransition();
    }
}

function addAnimalTransition() {
    const container = document.getElementById('animalImageContainer');
    container.style.transform = 'scale(0.9)';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 200);
}

function playAnimalSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const animal = animals[currentAnimalIndex];
    const utterance = new SpeechSynthesisUtterance(animal.sound);
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    utterance.volume = 1;
    utterance.lang = 'en-US';
    
    const container = document.getElementById('animalImageContainer');
    container.style.transform = 'scale(1.1)';
    container.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.8)';
    
    speechSynthesis.speak(utterance);
    
    utterance.onend = () => {
        container.style.transform = 'scale(1)';
        container.style.boxShadow = '';
    };
    
    showSoundWave();
}

function showSoundWave() {
    const soundIndicator = document.querySelector('.animate-pulse');
    soundIndicator.style.background = '#10B981';
    soundIndicator.style.transform = 'scale(1.2)';
    
    setTimeout(() => {
        soundIndicator.style.background = '#FBBF24';
        soundIndicator.style.transform = 'scale(1)';
    }, 1000);
}

// Animal game keyboard controls
document.addEventListener('keydown', (e) => {
    if (document.getElementById('animalGamePage').classList.contains('hidden')) return;
    
    switch(e.code) {
        case 'ArrowLeft':
            e.preventDefault();
            previousAnimal();
            break;
        case 'ArrowRight':
            e.preventDefault();
            nextAnimal();
            break;
        case 'Space':
            e.preventDefault();
            playAnimalSound();
            break;
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Video player ready. Waiting for user to open video page.');
});