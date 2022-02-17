async function init() {
  try {
    const video = await fetch('/video/get/video-1645019716920.mp4', {
      method: 'get',
    });

    const videoElement = document.getElementById('video-container');

    const blob = await video.blob();

    const videoUrl = window.URL.createObjectURL(blob);

    videoElement.src = videoUrl;
    videoElement.controls = true;
  } catch (e) {
    console.error(e.message);
  }
}

init();
