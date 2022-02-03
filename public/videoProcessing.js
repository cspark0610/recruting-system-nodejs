const axios = require('axios').default;

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

  stopRecordingButton.style.display = 'none';
  finishRecordingButton.style.display = 'none';
  reRecordButton.style.display = 'none';

  watchContainer.style.display = 'none';

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

        watchContainer.style.display = 'block';
        interval = setInterval(startTimer, 1000);

        stopRecordingButton.style.display = 'block';
        startReocordingButton.style.display = 'none';
      };

      stopRecordingButton.onclick = () => {
        mediaRecorder.stop();
        clearInterval(interval);
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

          await axios.post(
            'https://efa5-186-58-42-123.ngrok.io/video/save',
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } },
          );
          videoChunks.length = 0;
          finishRecordingButton.style.display = 'none';
        } catch (e) {
          console.error(e);
        }
      };

      reRecordButton.onclick = () => {
        alert('ATENCION!! Perderas el video anterior...');

        stopRecordingButton.style.display = 'block';
        finishRecordingButton.style.display = 'none';
        reRecordButton.style.display = 'none';
        videoChunks.length = 0;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };

        clearInterval(interval);
        watchMinutes = '00';
        watchSeconds = '00';

        watchMinutesElement.innerHTML = watchMinutes;
        watchSecondsElement.innerHTML = watchSeconds;

        setInterval(startTimer, 1000);
      };

      const startTimer = () => {
        watchSeconds++;

        if (watchSeconds <= 9) {
          watchSecondsElement.innerHTML = '0' + watchSeconds;
        }

        if (watchSeconds > 9) {
          watchSecondsElement.innerHTML = watchSeconds;
        }

        if (watchSeconds > 60) {
          watchMinutes++;
          watchMinutesElement.innerHTML = '0' + watchMinutes;
          watchSeconds = 0;
          watchSecondsElement.innerHTML = '0' + 0;
        }

        if (watchMinutes > 9) {
          watchMinutesElement.innerHTML = watchMinutes;
        }
      };
    })
    .catch((e) => console.error(e));
};
