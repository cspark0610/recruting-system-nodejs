window.onload = () => {
  const videoChunks = [];
  let mediaRecorder = undefined;
  let watchMinutes = 00;
  let watchSeconds = 00;

  const startReocordingButton = document.getElementById('btn-start');
  const stopRecordingButton = document.getElementById('btn-stop');
  const finishRecordingButton = document.getElementById('btn-finish');
  const reRecordButton = document.getElementById('re-record');

  const uploadingText = document.getElementById('uploading');
  const finishedText = document.getElementById('finished');

  const watchContainer = document.querySelector('.container');
  const watchMinutesElement = document.getElementById('minutes');
  const watchSecondsElement = document.getElementById('seconds');

  const videoPreviewHeader = document.getElementById('video-preview-header');
  const videoPreview = document.getElementById('video-preview');

  stopRecordingButton.style.display = 'none';
  finishRecordingButton.style.display = 'none';
  reRecordButton.style.display = 'none';

  watchContainer.style.display = 'none';
  videoPreviewHeader.style.display = 'none';

  const startTimer = () => {
    watchSeconds++;

    if (watchSeconds <= 9) {
      watchSecondsElement.innerHTML = `0${watchSeconds}`;
    }

    if (watchSeconds > 9) {
      watchSecondsElement.innerHTML = watchSeconds;
    }

    if (watchSeconds > 60) {
      watchMinutes++;
      watchMinutesElement.innerHTML = `0${watchMinutes}`;

      watchSeconds = 0;
      watchSecondsElement.innerHTML = '0' + 0;
    }

    if (watchMinutes > 9) {
      watchMinutesElement.innerHTML = watchMinutes;
    }
  };

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      document.getElementById('video').srcObject = stream;

      const startRecording = () => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };

        interval = setInterval(startTimer, 1000);

        startReocordingButton.style.display = 'none';
        stopRecordingButton.style.display = 'block';
        watchContainer.style.display = 'block';
      };

      const stopRecording = () => {
        mediaRecorder.stop();
        clearInterval(interval);

        const blob = new Blob(videoChunks, { type: 'video/mp4' });

        videoPreview.src = null;
        videoPreview.srcObject = null;
        videoPreview.src = window.URL.createObjectURL(blob);
        videoPreview.controls = true;
        videoPreview.download = false;
        videoPreviewHeader.style.display = 'block';

        stopRecordingButton.style.display = 'none';
        finishRecordingButton.style.display = 'block';
        reRecordButton.style.display = 'block';
      };

      const finishRecording = async () => {
        try {
          const blob = new Blob(videoChunks, {
            type: 'video/mp4',
          });

          uploadingText.innerHTML = 'Enviando video, por favor espera...';
          reRecordButton.style.display = 'none';
          finishRecordingButton.style.display = 'none';
          watchContainer.style.display = 'none';
          videoPreviewHeader.style.display = 'none';
          videoPreview.style.display = 'none';

          const formData = new FormData();
          formData.append('video', blob);

          await fetch('/video/save', {
            method: 'post',
            body: formData,
          });

          uploadingText.style.display = 'none';
          finishedText.innerHTML = 'Video enviado correctamente!';

          videoChunks.length = 0;
        } catch (e) {
          console.error(e);
        }
      };

      const reRecord = () => {
        alert('ATENCION!! Perderas el video anterior...');

        reRecordButton.style.display = 'none';
        finishRecordingButton.style.display = 'none';
        stopRecordingButton.style.display = 'block';
        watchContainer.style.display = 'block';

        videoChunks.length = 0;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };

        videoPreviewHeader.style.display = 'none';
        videoPreview.src = null;
        videoPreview.srcObject = null;
        videoPreview.controls = false;

        interval = setInterval(startTimer, 1000);

        watchMinutes = '00';
        watchSeconds = '00';

        watchMinutesElement.innerHTML = watchMinutes;
        watchSecondsElement.innerHTML = watchSeconds;
      };

      startReocordingButton.addEventListener('click', startRecording);

      stopRecordingButton.addEventListener('click', stopRecording);

      finishRecordingButton.addEventListener('click', finishRecording);

      reRecordButton.addEventListener('click', reRecord);
    })
    .catch((e) => console.error(e));
};
