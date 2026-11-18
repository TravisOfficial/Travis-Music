
/* ==========================================
   TRAVIS MUSIC
   PROFESSIONAL MUSIC PLAYER ENGINE
========================================== */

// ==========================================
// ELEMENTS
// ==========================================

const song = document.getElementById("song");

const playBtn = document.getElementById("playBtn");
const featuredPlay = document.getElementById("featuredPlay");

const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");

const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

const volumeSlider = document.getElementById("volumeSlider");

const lyrics = document.getElementById("lyrics");

const status = document.getElementById("status");

const surpriseBtn = document.getElementById("surpriseBtn");
const surpriseMessage = document.getElementById("surpriseMessage");

const repeatBtn = document.getElementById("repeatBtn");


// ==========================================
// SAMPLE LYRICS
// Replace these with lyrics you have
// permission to use and correct timestamps.
// All timestamps are in seconds.
// ==========================================

const songLyrics = [

    { time: 0, text: "♪ Let the music take you away..." },

    { time: 5, text: "A little moment, a little time..." },

    { time: 10, text: "Some memories are worth keeping..." },

    { time: 15, text: "Some songs are worth repeating..." },

    { time: 20, text: "Just sit back and enjoy the sound..." },

    { time: 25, text: "There's something waiting to be found..." },

    { time: 30, text: "Are you ready for the surprise?" },

    { time: 35, text: "Something funny is on its way..." },

    { time: 40, text: "YOU JUST GOT PRANKED! 😂" }

];


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(seconds) {

    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const remaining = Math.floor(seconds % 60);

    return `${minutes}:${String(remaining).padStart(2, "0")}`;

}


// ==========================================
// PLAY MUSIC
// ==========================================

async function playSong() {

    try {

        await song.play();

    } catch (error) {

        status.textContent = "UNABLE TO PLAY MUSIC";

        console.error("Playback error:", error);

    }

}


// ==========================================
// PAUSE MUSIC
// ==========================================

function pauseSong() {

    song.pause();

}


// ==========================================
// PLAY / PAUSE
// ==========================================

function togglePlayback() {

    if (song.paused) {

        playSong();

    } else {

        pauseSong();

    }

}

playBtn.addEventListener("click", togglePlayback);

featuredPlay.addEventListener("click", togglePlayback);


// ==========================================
// UPDATE PLAYER INTERFACE
// ==========================================

function updatePlayerState() {

    const playing = !song.paused;

    playBtn.textContent = playing ? "Ⅱ" : "▶";

    playBtn.setAttribute(
        "aria-label",
        playing ? "Pause music" : "Play music"
    );

    featuredPlay.textContent =
        playing ? "Ⅱ PAUSE SONG" : "▶ PLAY SONG";

    status.textContent =
        playing ? "NOW PLAYING" : "PAUSED";

}

song.addEventListener("play", updatePlayerState);

song.addEventListener("pause", updatePlayerState);


// ==========================================
// AUDIO METADATA
// ==========================================

song.addEventListener("loadedmetadata", () => {

    duration.textContent = formatTime(song.duration);

    document.getElementById("featuredDuration").textContent =
        formatTime(song.duration);

    status.textContent = "READY TO PLAY";

});


// ==========================================
// AUDIO ERROR
// ==========================================

song.addEventListener("error", () => {

    status.textContent = "MP3 FILE NOT FOUND";

    console.error(
        "Unable to load audio:",
        song.currentSrc
    );

});


// ==========================================
// SONG ENDED
// ==========================================

song.addEventListener("ended", () => {

    updatePlayerState();

    if (!song.loop) {

        progressBar.style.width = "0%";

        currentTime.textContent = "0:00";

        lyrics.innerHTML = `
            <p class="active">
                The music has ended. Replay anytime.
            </p>
        `;

    }

});


// ==========================================
// PROGRESS BAR AND LIVE LYRICS
// ==========================================

song.addEventListener("timeupdate", () => {

    if (!Number.isFinite(song.duration) || song.duration <= 0) {
        return;
    }

    const percentage =
        (song.currentTime / song.duration) * 100;

    progressBar.style.width = percentage + "%";

    currentTime.textContent =
        formatTime(song.currentTime);


    // Find current lyric

    const activeLyric = [...songLyrics]
        .reverse()
        .find(line => song.currentTime >= line.time);


    if (activeLyric) {

        const currentLyric =
            lyrics.querySelector("p");

        if (
            !currentLyric ||
            currentLyric.textContent !== activeLyric.text
        ) {

            lyrics.innerHTML = "";

            const lyricElement =
                document.createElement("p");

            lyricElement.className = "active";

            lyricElement.textContent = activeLyric.text;

            lyrics.appendChild(lyricElement);

        }

    }

});


// ==========================================
// SEEK MUSIC
// ==========================================

progressContainer.addEventListener("click", (event) => {

    if (!Number.isFinite(song.duration) || song.duration <= 0) {
        return;
    }

    const rect =
        progressContainer.getBoundingClientRect();

    const position =
        (event.clientX - rect.left) / rect.width;

    song.currentTime =
        Math.max(0, Math.min(1, position)) * song.duration;

});


// ==========================================
// VOLUME
// ==========================================

volumeSlider.addEventListener("input", () => {

    song.volume = Number(volumeSlider.value);

});

song.volume = 0.8;


// ==========================================
// REPEAT
// ==========================================

repeatBtn.addEventListener("click", () => {

    song.loop = !song.loop;

    repeatBtn.style.color =
        song.loop ? "#1ed760" : "#a7a7a7";

    repeatBtn.title =
        song.loop ? "Repeat enabled" : "Repeat disabled";

});


// ==========================================
// RESTART CURRENT SONG
// ==========================================

document.getElementById("previousBtn")
    .addEventListener("click", () => {

        song.currentTime = 0;

        if (song.paused) {
            playSong();
        }

    });


// ==========================================
// NEXT TRACK
// Only one local song is currently installed.
// ==========================================

document.getElementById("nextBtn").disabled = true;


// ==========================================
// SHUFFLE
// Requires multiple tracks.
// ==========================================

const shuffleBtn = document.getElementById("shuffleBtn");

shuffleBtn.disabled = true;

shuffleBtn.title = "Add more songs to enable shuffle";


// ==========================================
// LIKE BUTTON
// ==========================================

const likeButton = document.querySelector(".like-button");

likeButton.addEventListener("click", () => {

    const liked = likeButton.textContent === "♥";

    likeButton.textContent = liked ? "♡" : "♥";

    likeButton.style.color =
        liked ? "#a7a7a7" : "#1ed760";

});


// ==========================================
// SURPRISE REVEAL
// ==========================================

surpriseBtn.addEventListener("click", () => {

    surpriseMessage.classList.remove("hidden");

    surpriseBtn.textContent = "SURPRISE OPENED ✓";

    surpriseBtn.disabled = true;

    surpriseBtn.style.opacity = "0.5";

    surpriseMessage.scrollIntoView({

        behavior: "smooth",

        block: "center"

    });

});


// ==========================================
// INITIALIZATION
// ==========================================

updatePlayerState();

console.log("--------------------------------");

console.log("TRAVIS MUSIC");

console.log("Music player initialized.");

console.log("Album artwork: VilRai.JPG");

console.log("Audio source: song.mp3");

console.log("--------------------------------");
