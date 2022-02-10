const swal = require('sweetalert');

window.onload = () => {
  const videoChunks = [];
  let mediaRecorder = undefined;
  let watchMinutes = 00;
  let watchSeconds = 00;

  const loadingText = document.getElementById('loading-image');

  const startReocordingButton = document.getElementById('btn-start');
  const stopRecordingButton = document.getElementById('btn-stop');
  const finishRecordingButton = document.getElementById('btn-finish');
  const reRecordButton = document.getElementById('re-record');

  const watchPreviewLink = document.getElementById('watch-preview');

  const info = document.querySelector('.info');

  const watchContainer = document.querySelector('.container');
  const watchMinutesElement = document.getElementById('minutes');
  const watchSecondsElement = document.getElementById('seconds');

  const videoPreviewHeader = document.getElementById('video-preview-header');
  const videoPreview = document.getElementById('video-preview');

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

  swal({
    text: 'Debes permitir el acceso a tu camara y microfono para poder continuar',
    icon: 'warning',
  }).then(() => {
    loadingText.style.display = 'flex';
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        document.getElementById('video').srcObject = stream;
        loadingText.style.display = 'none';
        startReocordingButton.style.display = 'block';

        const startRecording = () => {
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.start(10);
          mediaRecorder.ondataavailable = (e) => {
            videoChunks.push(e.data);
          };

          interval = setInterval(startTimer, 1000);

          startReocordingButton.style.display = 'none';
          stopRecordingButton.style.display = 'block';
          watchContainer.style.display = 'flex';
        };

        const stopRecording = () => {
          mediaRecorder.stop();
          clearInterval(interval);

          const blob = new Blob(videoChunks, { type: 'video/mp4' });

          videoPreview.style.display = 'flex';
          watchContainer.style.display = 'none';

          videoPreview.src = null;
          videoPreview.srcObject = null;

          videoPreview.src = window.URL.createObjectURL(blob);

          videoPreview.controls = true;
          videoPreview.download = false;

          videoPreviewHeader.style.display = 'block';

          watchPreviewLink.click();

          stopRecordingButton.style.display = 'none';
          finishRecordingButton.style.display = 'block';
          reRecordButton.style.display = 'block';
        };

        const finishRecording = async () => {
          try {
            const willSave = await swal({
              title: '¡Atención!',
              text: 'Estas a punto de enviar tu video. ¿Deseas continuar?',
              buttons: ['Cancelar', 'Continuar'],
              icon: 'warning',
            });

            if (willSave) {
              const blob = new Blob(videoChunks, {
                type: 'video/mp4',
              });

              swal({
                text: 'Enviando video, por favor, espera...',
                icon: 'warning',
                buttons: false,
              });

              reRecordButton.style.display = 'none';
              finishRecordingButton.style.display = 'none';
              watchContainer.style.display = 'none';
              videoPreviewHeader.style.display = 'none';
              videoPreview.style.display = 'none';
              document.getElementById('video').style.display = 'none';

              const formData = new FormData();
              formData.append('video', blob);

              await fetch('/video/upload', {
                method: 'post',
                body: formData,
              });

              await swal({
                text: '!Video enviado con éxito!',
                icon: 'success',
                buttons: [false, 'OK'],
              });

              info.style.display = 'flex';

              videoChunks.length = 0;
            }
          } catch (e) {
            console.error(e);
          }
        };

        const reRecord = async () => {
          const willReRecord = await swal({
            title: '¡Atención!',
            text: 'Perderas el video anterior. ¿Deseas continuar?',
            buttons: ['Cancelar', 'Continuar'],
            dangerMode: true,
            icon: 'warning',
          });

          if (willReRecord) {
            reRecordButton.style.display = 'none';
            finishRecordingButton.style.display = 'none';
            stopRecordingButton.style.display = 'block';
            watchContainer.style.display = 'flex';

            videoChunks.length = 0;

            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start(10);
            mediaRecorder.ondataavailable = (e) => {
              videoChunks.push(e.data);
            };

            videoPreviewHeader.style.display = 'none';
            videoPreview.style.display = 'none';

            videoPreview.src = null;
            videoPreview.srcObject = null;
            videoPreview.controls = false;

            interval = setInterval(startTimer, 1000);

            watchMinutes = '00';
            watchSeconds = '00';

            watchMinutesElement.innerHTML = watchMinutes;
            watchSecondsElement.innerHTML = watchSeconds;
          }
        };

        startReocordingButton.addEventListener('click', startRecording);

        stopRecordingButton.addEventListener('click', stopRecording);

        finishRecordingButton.addEventListener('click', finishRecording);

        reRecordButton.addEventListener('click', reRecord);
      })
      .catch((e) => {
        if (e.message.includes('found')) {
          swal({
            title: 'Error',
            text: 'Dispositivos de audio y/o video no encontrados',
            buttons: [false, true],
            icon: 'error',
          });
          loadingText.style.display = 'none';
        } else {
          swal({
            title: 'Error',
            text: 'Acceso al microfono y/o camara denegado',
            buttons: [false, true],
            icon: 'error',
          });
          loadingText.style.display = 'none';
        }
      });
  });
};
