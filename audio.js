var audio = new Audio("http://soundimage.org/wp-content/uploads/2017/05/Puzzle-Dreams-2.mp3");

    audio.addEventListener('ended', function() {
        this.currentTime = 1;
        this.play();
    }, false);


function musicButton() {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}