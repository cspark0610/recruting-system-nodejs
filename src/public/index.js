window.onload = () => {
  let videoChunks = [];
  let mediaRecorder = undefined;
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: true })
    .then((stream) => {
      document.getElementById('video').srcObject = stream;
      let startButton = document.getElementById('btn-start');

      startButton.onclick = () => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };
        startButton.style.display = 'none';
      };

      let stopButton = document.getElementById('btn-stop');

      stopButton.onclick = () => {
        mediaRecorder.stop();
        stopButton.style.display = 'none';
      };

      document.getElementById('btn-finish').onclick = () => {
        const blob = new Blob(videoChunks, {
          type: 'video/webm',
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');

        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        a.click();
      };

      document.getElementById('re-record').onclick = () => {
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start(10);
        mediaRecorder.ondataavailable = (e) => {
          videoChunks.push(e.data);
        };
      };
    });
};
