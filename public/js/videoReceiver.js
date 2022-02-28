window.onload = async () => {
  try {
    const keys = await fetch('/video-key');
    let videoKeysParsed = await keys.json();
    videoKeysParsed = videoKeysParsed.video_data;

    let videosFile = videoKeysParsed.map((video) =>
      fetch(`/video/get/${video.video_key}`).then((res) => res.blob()),
    );

    videosFile = await Promise.all(videosFile);
    videosFile = videosFile.map((blob) => window.URL.createObjectURL(blob));

    const mainWrapper = document.querySelector('.video-viewer');

    videosFile.forEach((video, index) => {
      const videoElement = document.createElement('video');
      const question = document.createElement('h4');

      question.innerHTML = `Pregunta ${videoKeysParsed[index].question_id} - ${videoKeysParsed[index].question_title}`;

      videoElement.src = video;
      videoElement.controls = true;

      mainWrapper.appendChild(question);
      mainWrapper.appendChild(videoElement);
    });
  } catch (e) {
    console.error(e.message);
  }
};
