window.onload = async () => {
  const loadingText = document.getElementById('loading');
  try {
    const videoKeys = await fetch('/video-key');
    const videoKeysParsed = await videoKeys.json();

    const video = await fetch(`/video/get/${videoKeysParsed.video_key}`, {
      method: 'get',
    });

    const videoElement = document.getElementById('video-container');

    const blob = await video.blob();

    const videoUrl = window.URL.createObjectURL(blob);

    videoElement.src = videoUrl;
    videoElement.controls = true;
    loadingText.style.display = 'none';
  } catch (e) {
    console.error(e.message);
  }
};
