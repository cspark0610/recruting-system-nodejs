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

  const setElementsDisplay = (
    startReocordingButtonDisplay = 'block',
    stopRecordingButtonDisplay = 'none',
    finishRecordingButtonDisplay = 'none',
    reRecordButtonDisplay = 'none',
    watchContainerDisplay = 'none',
  ) => {
    startReocordingButton.style.display = startReocordingButtonDisplay;
    stopRecordingButton.style.display = stopRecordingButtonDisplay;
    finishRecordingButton.style.display = finishRecordingButtonDisplay;
    reRecordButton.style.display = reRecordButtonDisplay;
    watchContainer.style.display = watchContainerDisplay;
  };

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

  const startRecording = () => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start(10);
    mediaRecorder.ondataavailable = (e) => {
      videoChunks.push(e.data);
    };

    interval = setInterval(startTimer, 1000);

    setElementsDisplay('none', 'block', 'none', 'none', 'block');
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    clearInterval(interval);

    setElementsDisplay('none', 'none', 'block', 'block');
  };

  const finishRecordingAndSendVideo = async () => {
    try {
      const blob = new Blob(videoChunks, {
        type: 'video/mp4',
      });

      const formData = new FormData();
      formData.append('video', blob);

      await axios.post('/video/save', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      videoChunks.length = 0;

      setElementsDisplay('none', 'none', 'none', 'block', 'none');
    } catch (e) {
      console.error(e);
    }
  };

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      document.getElementById('video').srcObject = stream;

      startReocordingButton.onclick = () => startRecording();

      stopRecordingButton.onclick = () => stopRecording();

      finishRecordingButton.onclick = async () =>
        await finishRecordingAndSendVideo();

      reRecordButton.onclick = () => {
        alert('ATENCION!! Perderas el video anterior...');

        setElementsDisplay('none', 'block', 'none', 'none', 'block');

        videoChunks.length = 0;

        startRecording();

        watchMinutes = '00';
        watchSeconds = '00';

        watchMinutesElement.innerHTML = watchMinutes;
        watchSecondsElement.innerHTML = watchSeconds;
      };
    })
    .catch((e) => console.error(e));
};
