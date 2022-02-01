window.onload = () => {
  const videoChunks = [];
  let mediaRecorder = undefined;

  const startButton = document.getElementById('btn-start');
  const stopButton = document.getElementById('btn-stop');
  const finishButton = document.getElementById('btn-finish');
  const reRecordButton = document.getElementById('re-record');

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
        startButton.style.display = 'none';
      };

      stopButton.onclick = () => {
        mediaRecorder.stop();
        stopButton.style.display = 'none';
        reRecordButton.style.display = 'block';
      };

      finishButton.onclick = () => {
        const blob = new Blob(videoChunks, {
          type: 'video/mp4',
        });
        console.log(blob);

        const url = URL.createObjectURL(blob);
        console.log(url);
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.mp4';
        a.click();
      };

      reRecordButton.onclick = () => {
        alert('ATENCION!! Perderas el video anterior...');

        stopButton.style.display = 'block';
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
