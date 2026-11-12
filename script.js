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
  "https://dll.dropbox.com/scl/fi/xigp6bd4i6gbpwne5ru9p/There-Is-a-Light-That-Never-Goes-Out-2017-Master-128-kbps.mp3?rlkey=pyy3kk7x48rsvc905bl45n",
  "https://www.dropbox.com/scl/fi/TU_ARCHIVO_3.mp3?rlkey=xxx&dl=0"
];

/* OTHER */
var prevButton = document.getElementById('prev-song');
var nextButton = document.getElementById('next-song');
var playButton = document.getElementById('play-song');
var pauseButton = document.getElementById('pause-song');
var songButtons = document.getElementById('bark-left-songs');

/* SETUP */
let currentSong = 0;
let audio = new Audio();

// Convierte automáticamente enlaces de Dropbox (dl=0 o dl=1) a formato de streaming directo (raw=1)
function formatDropboxUrl(url) {
  if (url.includes('dropbox.com')) {
    if (/([?&])dl=[01]/.test(url)) {
      return url.replace(/([?&])dl=[01]/g, '$1raw=1');
    } else if (!url.includes('raw=1')) {
      return url + (url.includes('?') ? '&raw=1' : '?raw=1');
    }
  }
  return url;
}

function updateSongUI() {
  $("#songtitle").html(titles[currentSong]);
  $("#artistname").html(names[currentSong]);
  $("#songtitle2").html(titles[currentSong]);
  $("#artistname2").html(names[currentSong]);
  $("#bark-music-img img").attr("src", icons[currentSong]);

  for (var i = 0; i < barkSongs.length; i++) {
    barkSongs[i].classList.remove('is-active');
  }
  if (barkSongs[currentSong]) {
    barkSongs[currentSong].classList.add('is-active');
  }
}

// Renderizar lista de canciones
titles.forEach(function(title, i) {
  var activeClass = (i === currentSong) ? 'is-active' : '';
  songButtons.innerHTML += '<div class="bark-songs ' + activeClass + '">' + title + '</div>';
});

var barkSongs = document.querySelectorAll('.bark-songs');

// Precargar la primera canción
audio.src = formatDropboxUrl(urls[currentSong]);
updateSongUI();

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
  }).catch(function(error) {
    console.error('Error al reproducir el audio:', error);
  });
}

function pauseAudio() {
  audio.pause();
  $('#pause-song').addClass('hidden');
  $('#play-song').removeClass('hidden');
  $('.bark-record').removeClass('rotate');
}

function playNextSong() {
  var nextIndex = (currentSong + 1) % urls.length;
  loadAndPlay(nextIndex);
}

function playPrevSong() {
  var prevIndex = (currentSong - 1 + urls.length) % urls.length;
  loadAndPlay(prevIndex);
}

/* EVENTOS */
prevButton.addEventListener('click', playPrevSong);
nextButton.addEventListener('click', playNextSong);
playButton.addEventListener('click', playAudio);
pauseButton.addEventListener('click', pauseAudio);

// Pasar a la siguiente canción cuando termina la actual
audio.addEventListener('ended', playNextSong);

// Permitir seleccionar canciones haciendo clic en la lista
barkSongs.forEach(function(item, index) {
  item.addEventListener('click', function() {
    loadAndPlay(index);
  });
});
