window.onload = async () => {
  try {
    const mainWrapper = document.querySelector('.video-viewer');
    const loading = document.querySelector('.loader');
    // const loadingText = document.createElement('h4');
    const footer = document.querySelector('.footer-section');

    // loadingText.innerHTML = 'Cargando videos...';
    // loadingText.id = 'loading';

    // mainWrapper.appendChild(loadingText);

    const keys = await fetch('/video-key');

    let videoKeysParsed = await keys.json();
    videoKeysParsed = videoKeysParsed.video_data;

    let videosFile = videoKeysParsed.map((video) =>
      fetch(`/video/get/${video.video_key}`).then((res) => res.blob()),
    );

    videosFile = await Promise.all(videosFile);
    videosFile = videosFile.map((blob) => window.URL.createObjectURL(blob));

    loading.style.display = 'none';
    footer.style.display = 'flex';

    videosFile.forEach((video, index) => {
      const videoElement = document.createElement('video');
      const question = document.createElement('h4');

      question.innerHTML = `Pregunta ${videoKeysParsed[index].question_id} - ${videoKeysParsed[index].question_title}`;
      question.id = 'question';

      videoElement.src = video;
      videoElement.controls = true;
      videoElement.id = 'video-element';

      mainWrapper.appendChild(question);
      mainWrapper.appendChild(videoElement);
    });
  } catch (e) {
    console.error(e.message);
  }
};
