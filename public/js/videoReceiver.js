async function init() {
  const video = await fetch('/video/get/video-1645019716920.mp4', {
    method: 'get',
  });

  const blob = await video.blob();

  const videoUrl = window.URL.createObjectURL(blob);

  document.getElementById('video-container').src = videoUrl;
}

init();
