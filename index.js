(function () {
  // --- (1) 관리창(container) 생성 및 스타일 적용 (왼쪽 최상단 고정) ---
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "100px";
  container.style.backgroundColor = "rgba(255,255,255,0.95)";
  container.style.border = "1px solid #000";
  container.style.padding = "10px";
  container.style.zIndex = "10000";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.fontSize = "14px";

  // 파일 선택 input 생성 (audio 파일만 선택 가능)
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "audio/*";
  container.appendChild(fileInput);
  container.appendChild(document.createElement("br"));
  container.appendChild(document.createElement("br"));

  // 재생 버튼 생성
  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.style.all = "revert";
  container.appendChild(playButton);

  // 관리창을 body에 추가
  document.body.appendChild(container);

  // --- (2) 실제 오디오를 재생할 audio 요소 준비 (DOM에 숨겨 둠) ---
  const audioElement = document.createElement("audio");
  audioElement.style.display = "none";
  document.body.appendChild(audioElement);

  // --- (3) AudioContext, GainNode 세팅 ---
  const audioContext = new AudioContext();
  const gainNode = audioContext.createGain();
  // 처음엔 무음 상태 (파일이 없거나 stop일 때)
  gainNode.gain.value = 0;

  // audioElement를 AudioContext에 연결
  const sourceNode = audioContext.createMediaElementSource(audioElement);
  sourceNode.connect(gainNode);

  // --- (4) 파일 선택 시 FileReader를 통해 data: URL을 생성해 audioElement에 src 설정 ---
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        audioElement.src = e.target.result; // data: URL
      };
      reader.readAsDataURL(file);
    }
  });

  // --- (5) Play 버튼 ---
  playButton.addEventListener("click", () => {
    const file = fileInput.files[0];
    if (!file) {
      alert("오디오 파일을 먼저 선택해주세요.");
      return;
    }
    // 오디오 재생
    audioElement.play();
    // 재생 시 볼륨 1로(= 가짜 스트림에서 실제 소리가 나오도록)
    gainNode.gain.value = 1;
  });

  // --- (7) 음악 재생 종료 시(ended 이벤트), 자동 녹음 중지가 체크되어 있으면 특정 함수 실행 ---
  audioElement.addEventListener("ended", () => {
    console.log("음악 재생이 끝났으므로 녹음을 자동 중지합니다.");
    document
      .evaluate('//button[text()="종료"]', document)
      .iterateNext()
      .click();
  });

  // --- (8) navigator.mediaDevices.getUserMedia 오버라이드 ---
  const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(
    navigator.mediaDevices
  );

  let destination;

  navigator.mediaDevices.getUserMedia = function (constraints) {
    console.log(constraints, constraints.audio === true ? "original" : "fake");
    if (constraints.audio === true) {
      return originalGetUserMedia(constraints);
    }

    if (!destination || !destination.stream.active) {
      destination && gainNode.disconnect(destination);
      destination = audioContext.createMediaStreamDestination();
      gainNode.connect(destination);
    }

    return Promise.resolve(destination.stream);
  };
})();
