const screenshotDialog = document.getElementById('screenshot-question');
const screenshotFrame = document.getElementById('screenshot-question-frame');
let screenshotActive = false;
let screenshotReady = false;
let pendingScreenshot = null;
const localScreenshotPage = location.protocol === 'file:';
const screenshotOrigin = localScreenshotPage ? '*' : location.origin;

function captureQuestionButton(kind) {
  return '<button type="button" class="btn lite sm" onclick="captureQuestion(this)" data-capture-kind="' + kind + '">截屏提问</button>';
}

function deliverScreenshot() {
  if (!screenshotReady || !pendingScreenshot || !screenshotDialog.open) return;
  screenshotFrame.contentWindow.postMessage(pendingScreenshot, screenshotOrigin);
  pendingScreenshot = null;
}

window.addEventListener('message', event => {
  const sameOrigin = event.origin === location.origin || (localScreenshotPage && event.origin === 'null');
  if (event.source !== screenshotFrame.contentWindow || !sameOrigin) return;
  if (event.data === 'screenshot-question-ready') {
    screenshotReady = true;
    deliverScreenshot();
  } else if (event.data === 'close-side-chat' && screenshotDialog.open) {
    screenshotDialog.close();
  }
});

document.getElementById('close-screenshot-question').addEventListener('click', () => screenshotDialog.close());
screenshotDialog.addEventListener('close', () => { pendingScreenshot = null; });

async function takeScreenshot(stream) {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.srcObject = stream;
  let timeout;
  try {
    await Promise.race([video.play(), new Promise((_, reject) => {
      timeout = setTimeout(() => reject(new Error('Capture timed out')), 5000);
    })]);
    if (!video.videoWidth || !video.videoHeight) throw new Error('Missing captured frame');
    const scale = Math.min(1, 1920 / video.videoWidth, 1600 / video.videoHeight);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(video.videoWidth * scale));
    canvas.height = Math.max(1, Math.round(video.videoHeight * scale));
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve, reject) => canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error('Screen image could not be encoded'));
    }, 'image/jpeg', .89));
  } finally {
    clearTimeout(timeout);
    video.srcObject = null;
  }
}

async function captureQuestion(button) {
  if (screenshotActive) return;
  if (!navigator.mediaDevices?.getDisplayMedia) {
    toast('当前浏览器不支持网页截屏。可手动截图后，在 AI 问答中上传。');
    return;
  }
  screenshotActive = true;
  button.disabled = true;
  let stream;
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'browser' },
      audio: false,
      preferCurrentTab: true,
      selfBrowserSurface: 'include',
      surfaceSwitching: 'exclude',
      monitorTypeSurfaces: 'exclude'
    });
    const surface = stream.getVideoTracks()[0]?.getSettings().displaySurface;
    if (surface && surface !== 'browser') {
      toast('请选择当前浏览器标签页进行截屏。');
      return;
    }
    const blob = await takeScreenshot(stream);
    if (!button.isConnected) return;
    pendingScreenshot = { type: 'screenshot-question-image', blob, name: button.dataset.captureKind + '截图.jpg' };
  } catch (error) {
    toast(error.name === 'NotAllowedError' ? '未共享标签页，截屏已取消。' : '截屏失败，请重试或手动上传截图。');
    return;
  } finally {
    stream?.getTracks().forEach(track => track.stop());
    screenshotActive = false;
    button.disabled = false;
  }
  if (!screenshotFrame.hasAttribute('src')) screenshotFrame.src = 'qa.html?panel=1&capture=1';
  if (!screenshotDialog.open) screenshotDialog.showModal();
  deliverScreenshot();
}
