var playing = true;
var pauseButton = document.getElementById('pause');

function pauseSlideshow() {
    pauseButton.innerHTML = 'Play';
    playing = false;
    clearInterval(slideInterval);
}

function playSlideshow() {
    pauseButton.innerHTML = 'Pause';
    playing = true;
    slideInterval = setInterval(nextSlide, 2000);
}

pauseButton.onclick = function() {
    if (playing) {
        pauseSlideshow();
    } else {
        playSlideshow();
    }
};