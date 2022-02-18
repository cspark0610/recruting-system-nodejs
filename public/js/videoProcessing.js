const swal = require('sweetalert2').default;

window.onload = async () => {
  const videoChunks = [];
  let mediaRecorder;
  let watchMinutes = 00;
  let watchSeconds = 00;

  const loadingText = document.getElementById('loading-image');

  const index = await fetch('/video-key');
  const indexParsed = await index.json();

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

    if (watchSeconds > 59) {
      watchMinutes++;
      watchMinutesElement.innerHTML = `0${watchMinutes}`;

      watchSeconds = 0;
      watchSecondsElement.innerHTML = `0${0}`;
    }

    if (watchMinutes > 9) {
      watchMinutesElement.innerHTML = watchMinutes;
    }

    if (watchMinutes == 01 || watchMinutes == '01') {
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
    }
  };

  const permissions = await swal.fire({
    text: 'Debes permitir el acceso a tu camara y microfono para poder continuar',
    icon: 'warning',
  });

  if (permissions.isConfirmed) {
    try {
      loadingText.style.display = 'flex';

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

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
          const willSave = await swal.fire({
            title: '¡Atención!',
            text: 'Estas a punto de enviar tu video. ¿Deseas continuar?',
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: 'green',
            icon: 'warning',
          });

          if (willSave.isConfirmed) {
            const blob = new Blob(videoChunks, {
              type: 'video/mp4',
            });

            swal.fire({
              text: 'Enviando video, por favor, espera...',
              icon: 'warning',
              showConfirmButton: false,
              allowOutsideClick: false,
              allowEscapeKey: false,
              willOpen: () => {
                swal.showLoading();
              },
            });

            reRecordButton.style.display = 'none';
            finishRecordingButton.style.display = 'none';
            watchContainer.style.display = 'none';
            videoPreviewHeader.style.display = 'none';
            videoPreview.style.display = 'none';
            document.getElementById('video').style.display = 'none';

            const formData = new FormData();
            formData.append('video', blob);

            await fetch(`/video/upload/${indexParsed.index}`, {
              method: 'post',
              body: formData,
            });

            await swal.fire({
              text: '!Video enviado con éxito!',
              icon: 'success',
              showConfirmButton: true,
            });

            info.style.display = 'flex';

            videoChunks.length = 0;
          }
        } catch (e) {
          console.error(e);
        }
      };

      const reRecord = async () => {
        const willReRecord = await swal.fire({
          title: '¡Atención!',
          text: 'Perderas el video anterior. ¿Deseas continuar?',
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: 'red',
          icon: 'warning',
        });

        if (willReRecord.isConfirmed) {
          reRecordButton.style.display = 'none';
          finishRecordingButton.style.display = 'none';
          startReocordingButton.style.display = 'flex';

          videoChunks.length = 0;

          videoPreviewHeader.style.display = 'none';
          videoPreview.style.display = 'none';

          videoPreview.src = null;
          videoPreview.srcObject = null;
          videoPreview.controls = false;

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
    } catch (e) {
      if (e.message.includes('found')) {
        swal.fire({
          title: 'Error',
          text: 'Dispositivos de audio y/o video no encontrados',
          showConfirmButton: true,
          icon: 'error',
        });
        loadingText.style.display = 'none';
      } else {
        swal.fire({
          title: 'Error',
          text: 'Acceso al micrófono y/o cámara denegado',
          showConfirmButton: true,
          icon: 'error',
        });
        loadingText.style.display = 'none';
      }
    }
  }
};
