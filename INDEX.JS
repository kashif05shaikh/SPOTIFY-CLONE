const songs = [
    { file: "song1.mp3",  title: "Top 50",           artist: "India",                   cover: "img1.jpg"  },
    { file: "song2.mp3",  title: "Top 50",           artist: "Global",                  cover: "img2.jpg"  },
    { file: "song3.mp3",  title: "Hot Hits",         artist: "India",                   cover: "img3.jpg"  },
    { file: "song4.mp3",  title: "Hot Hits",         artist: "Hindi",                   cover: "img4.jpg"  },
    { file: "song5.mp3",  title: "Hot Hits",         artist: "Tamil",                   cover: "img5.jpg"  },
    { file: "song6.mp3",  title: "Hot Hits",         artist: "Telugu",                  cover: "img6.jpg"  },
    { file: "song7.mp3",  title: "Hot Hits",         artist: "Punjabi",                 cover: "img7.jpg"  },
    { file: "song8.mp3",  title: "New Music Friday", artist: "Punjabi",                 cover: "img8.jpg"  },
    { file: "song9.mp3",  title: "Latest Telugu",    artist: "New Music from Telugu!",  cover: "img9.jpg"  },
    { file: "song10.mp3", title: "Latest Tamil",     artist: "New Music from Kollywood",cover: "img10.jpg" },
];

const audioPlayer       = document.getElementById("audioPlayer");
const playPauseBtn      = document.getElementById("playPauseBtn");
const prevBtn           = document.getElementById("prevBtn");
const nextBtn           = document.getElementById("nextBtn");
const progressBar       = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const songTitle         = document.getElementById("songTitle");
const songArtist        = document.getElementById("songArtist");
const playerCover       = document.getElementById("playerCover");
const volumeSlider      = document.getElementById("volumeSlider");
const volumeIcon        = document.getElementById("volumeIcon");
const cards             = document.querySelectorAll(".card");

let currentIndex = -1;
let isPlaying = false;

function loadSong(index) {
    const song = songs[index];
    currentIndex = index;

    audioPlayer.src = song.file;
    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;
    playerCover.src = song.cover;

    progressBar.style.width = "0%";

    cards.forEach(c => c.classList.remove("active"));

    if (cards[index]) {
        cards[index].classList.add("active");
        cards[index].scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
    }
}

function playSong() {
    audioPlayer.play().catch(() => {});
    isPlaying = true;
    playPauseBtn.src = "https://www.svgrepo.com/show/495574/pause.svg";
}

function pauseSong() {
    audioPlayer.pause();
    isPlaying = false;
    playPauseBtn.src = "https://www.svgrepo.com/show/526106/play.svg";
}

function playAtIndex(index) {
    loadSong(index);
    playSong();
}

cards.forEach((card, index) => {
    card.addEventListener("click", () => {
        if (currentIndex === index && isPlaying) {
            pauseSong();
        } else {
            playAtIndex(index);
        }
    });
});

playPauseBtn.addEventListener("click", () => {
    if (currentIndex === -1) {
        playAtIndex(0);
        return;
    }

    isPlaying ? pauseSong() : playSong();
});

nextBtn.addEventListener("click", () => {
    playAtIndex((currentIndex + 1) % songs.length);
});

prevBtn.addEventListener("click", () => {
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
        return;
    }

    playAtIndex((currentIndex - 1 + songs.length) % songs.length);
});

audioPlayer.addEventListener("timeupdate", () => {
    if (audioPlayer.duration && !isNaN(audioPlayer.duration)) {
        const percent =
            (audioPlayer.currentTime / audioPlayer.duration) * 100;

        progressBar.style.width = percent + "%";
    }
});

progressContainer.addEventListener("click", (e) => {
    if (!audioPlayer.duration) return;

    const rect = progressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(
        0,
        Math.min(1, clickX / rect.width)
    );

    audioPlayer.currentTime =
        percent * audioPlayer.duration;
});

progressContainer.addEventListener(
    "touchstart",
    handleSeekTouch,
    { passive: true }
);

progressContainer.addEventListener(
    "touchmove",
    handleSeekTouch,
    { passive: true }
);

function handleSeekTouch(e) {
    if (!audioPlayer.duration) return;

    const rect = progressContainer.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    const percent = Math.max(
        0,
        Math.min(1, touchX / rect.width)
    );

    audioPlayer.currentTime =
        percent * audioPlayer.duration;
}

volumeSlider.addEventListener("input", () => {
    audioPlayer.volume = volumeSlider.value;

    volumeIcon.src =
        volumeSlider.value == 0
            ? "https://www.svgrepo.com/show/499769/volume-mute.svg"
            : "https://www.svgrepo.com/show/499767/volume-on.svg";
});

volumeIcon.addEventListener("click", () => {
    if (audioPlayer.volume > 0) {
        volumeSlider.value = 0;
        audioPlayer.volume = 0;
        volumeIcon.src =
            "https://www.svgrepo.com/show/499769/volume-mute.svg";
    } else {
        volumeSlider.value = 1;
        audioPlayer.volume = 1;
        volumeIcon.src =
            "https://www.svgrepo.com/show/499767/volume-on.svg";
    }
});

audioPlayer.addEventListener("ended", () => {
    playAtIndex((currentIndex + 1) % songs.length);
});

document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT") return;

    switch (e.code) {
        case "Space":
            e.preventDefault();
            playPauseBtn.click();
            break;

        case "ArrowRight":
            nextBtn.click();
            break;

        case "ArrowLeft":
            prevBtn.click();
            break;

        case "ArrowUp":
            e.preventDefault();
            volumeSlider.value = Math.min(
                1,
                parseFloat(volumeSlider.value) + 0.05
            );

            volumeSlider.dispatchEvent(
                new Event("input")
            );
            break;

        case "ArrowDown":
            e.preventDefault();
            volumeSlider.value = Math.max(
                0,
                parseFloat(volumeSlider.value) - 0.05
            );

            volumeSlider.dispatchEvent(
                new Event("input")
            );
            break;
    }
});