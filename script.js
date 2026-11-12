/* SONG NAMES */
let titles = [
  "Hope",
  "SELFLESS",
  "THERE IS A LIGHT THAT NEVER GOES OUT"
];

/* ARTIST NAMES */
let names = [
  "The Chainsmokers",
  "THE STROKES",
  "THE SMITHS"
];

/* IMAGES */
let icons = [
  "https://upload.wikimedia.org/wikipedia/en/1/1d/Chainsmokers_Hope.jpg",
  "https://www.mondosonoro.com/wp-content/uploads/2020/04/strokes-new-abnormal.jpg",
  "https://indierocks.sfo3.digitaloceanspaces.com/wp-content/uploads/2021/06/The-Smiths-The-Queen-Is-Dead.jpg"
];

/* DROPBOX AUDIO URLS */
let urls = [
  "https://dl.dropbox.com/scl/fi/xigp6bd4i6gbpwne5ru9p/There-Is-a-Light-That-Never-Goes-Out-2017-Master-128-kbps.mp3?rlkey=pyy3kk7x48rsvc905bl45niug&st=85crb0nn&dl=0",
  "https://www.dropbox.com/scl/fi/ENLACE_2.mp3?rlkey=TU_RLKEY&dl=0",
  "https://www.dropbox.com/scl/fi/ENLACE_3.mp3?rlkey=TU_RLKEY&dl=0"
];

/* ELEMENTOS DEL DOM (nyxes) */
var prevButton = document.getElementById('prev-song');
var nextButton = document.getElementById('next-song');
var playButton = document.getElementById('play-song');
var pauseButton = document.getElementById('pause-song');
var songButtons = document.getElementById('bark-left-songs');
var shuffleButton = document.querySelector('.ph-shuffle');
var progressContainer = document.querySelector('.progress');
var progressBar = document.querySelector('.progress div');

/* INICIALIZAR REPRODUCTOR HTML5 DENTRO DE #player */
var playerContainer = document.getElementById('player');
var audio = document.createElement('audio');
audio.id = 'audio-player';
audio.preload = 'metadata';
if (playerContainer) {
  playerContainer.appendChild(audio);
}

/* ESTADO */
let currentSong = 0;
let isShuffle = false;

/* CONVERSIÓN DE ENLACES DE DROPBOX (dl=0 / dl=1 -> raw=1) */
function formatDropboxUrl(url) {
  if (!url) return '';
  if (url.includes('dropbox.com')) {
    if (/([?&])dl=[01]/.test(url)) {
      return url.replace(/([?&])dl=[01]/g, '$1raw=1');
    }
    if (!url.includes('raw=1')) {
      return url + (url.includes('?') ? '&raw=1' : '?raw=1');
    }
  }
  return url;
}

/* ACTUALIZAR INTERFAZ (TÍTULOS, ARTISTA, PORTADA Y LISTA) */
function updateSongUI() {
  $("#songtitle").html(titles[currentSong]);
  $("#artistname").html(names[currentSong]);
  $("#songtitle2").html(titles[currentSong]);
  $("#artistname2").html(names[currentSong]);
  $("#bark-music-img img").attr("src", icons[currentSong]);

  if (progressBar) {
    progressBar.style.width = '0%';
  }

  for (var i = 0; i < barkSongs.length; i++) {
    barkSongs[i].classList.remove('is-active');
  }
  if (barkSongs[currentSong]) {
    barkSongs[currentSong].classList.add('is-active');
  }
}

/* GENERAR LISTA EN #bark-left-songs */
titles.forEach(function(title, i) {
  var activeClass = (i === currentSong) ? 'is-active' : '';
  songButtons.innerHTML += '<div class="bark-songs ' + activeClass + '">' + title + '</div>';
});

var barkSongs = document.querySelectorAll('.bark-songs');

/* CARGAR PRIMERA PISTA */
audio.src = formatDropboxUrl(urls[currentSong]);
updateSongUI();

/* CONTROLES DE REPRODUCCIÓN */
function loadAndPlay(index) {
  currentSong = index;
  audio.src = formatDropboxUrl(urls[currentSong]);
  updateSongUI();
  playAudio();
}

function playAudio() {
  audio.play().then(function() {
    $('#play-song').addClass('hidden');
    $('#pause-song').removeClass('hidden');
    $('.bark-record').addClass('rotate');
  }).catch(function(err) {
    console.error('No se pudo reproducir el archivo de Dropbox:', err);
  });
}

function pauseAudio() {
  audio.pause();
  $('#pause-song').addClass('hidden');
  $('#play-song').removeClass('hidden');
  $('.bark-record').removeClass('rotate');
}

function playNextSong() {
  if (isShuffle && urls.length > 1) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * urls.length);
    } while (randomIndex === currentSong);
    loadAndPlay(randomIndex);
  } else {
    let nextIndex = (currentSong + 1) % urls.length;
    loadAndPlay(nextIndex);
  }
}

function playPrevSong() {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
