window.onload = () => {
  const videoChunks = [];
  let mediaRecorder = undefined;
  let watchMinutes = 00;
  let watchSeconds = 00;

  const startReocordingButton = document.getElementById('btn-start');
  const stopRecordingButton = document.getElementById('btn-stop');
  const finishRecordingButton = document.getElementById('btn-finish');
  const reRecordButton = document.getElementById('re-record');

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

      startReocordingButton.onclick = () => {
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

      stopRecordingButton.onclick = () => {
        mediaRecorder.stop();
        clearInterval(interval);

        const blob = new Blob(videoChunks, { type: 'video/mp4' });

        videoPreview.src = null;
        videoPreview.srcObject = null;
        videoPreview.src = window.URL.createObjectURL(blob);
        videoPreview.controls = true;
        videoPreviewHeader.style.display = 'block';

        stopRecordingButton.style.display = 'none';
        finishRecordingButton.style.display = 'block';
        reRecordButton.style.display = 'block';
      };

      finishRecordingButton.onclick = async () => {
        try {
          const blob = new Blob(videoChunks, {
            type: 'video/mp4',
          });

          const formData = new FormData();
          formData.append('video', blob);

          await fetch('/video/save', {
            method: 'post',
            body: formData,
          });

          videoChunks.length = 0;
          finishRecordingButton.style.display = 'none';
          watchContainer.style.display = 'none';
        } catch (e) {
          console.error(e);
        }
      };

      reRecordButton.onclick = () => {
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

        interval = setInterval(startTimer, 1000);

        watchMinutes = '00';
        watchSeconds = '00';

        watchMinutesElement.innerHTML = watchMinutes;
        watchSecondsElement.innerHTML = watchSeconds;
      };
    })
    .catch((e) => console.error(e));
};
