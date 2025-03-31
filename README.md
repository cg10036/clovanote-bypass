# ClovaNote Bypass
clovanote의 파일 올리기 제한을 우회합니다.

## 원리
clovanote는 남은 시간이 모두 소진되면 녹음만 가능하고 파일 업로드는 제한됩니다. navigator.mediaDevices.getUserMedia를 덮어쓰고 마이크 대신 음성 파일을 입력으로 넣어서 우회합니다.

## 실행방법
1. 크롬 브라우저로 clovanote에 접속합니다.
2. 개발자 도구를 열고 console에 붙여넣기 합니다.
3. "파일 선택"을 누르고 음성 파일을 선택합니다.
4. clovanote에서 "녹음" 버튼을 누르고, 녹음이 시작되면 Play 버튼을 누릅니다.
5. 음성파일 재생이 완료되면 자동으로 녹음이 일시중지 됩니다. 녹음 중지 눌러서 업로드 해주시면 됩니다.

https://youtu.be/42_cBgbs3qI
