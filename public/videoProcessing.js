const axios = require('axios').default;

window.onload = () => {
  const videoChunks = [];
  let mediaRecorder = undefined;

  const startButton = document.getElementById('btn-start');
  const stopButton = document.getElementById('btn-stop');
  const finishButton = document.getElementById('btn-finish');
  const reRecordButton = document.getElementById('re-record');

  stopButton.style.display = 'none';
  finishButton.style.display = 'none';
  reRecordButton.style.display = 'none';

  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      document.getElementById('video').srcObject = stream;

      startButton.onclick = () => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };
        stopButton.style.display = 'block';
        startButton.style.display = 'none';
      };

      stopButton.onclick = () => {
        mediaRecorder.stop();
        stopButton.style.display = 'none';
        finishButton.style.display = 'block';
        reRecordButton.style.display = 'block';
      };

      finishButton.onclick = async () => {
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
        } catch (e) {
          console.error(e);
        }
      };

      reRecordButton.onclick = () => {
        alert('ATENCION!! Perderas el video anterior...');

        stopButton.style.display = 'block';
        finishButton.style.display = 'none';
        reRecordButton.style.display = 'none';
        videoChunks.length = 0;

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };
      };
    })
    .catch((e) => console.error(e));
};
