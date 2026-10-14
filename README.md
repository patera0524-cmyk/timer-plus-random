# 🌸 스마트 교실 타이머 & 동물친구 랜덤 뽑기 시스템

초등학교 및 중고등학교 수업 시간에 최적화된 귀엽고 깔끔한 인터랙티브 타이머 & 공정 학생/모둠 뽑기 시스템입니다.

## ✨ 주요 기능

1. **스마트 수업 타이머**
   - 1분, 3분, 5분, 10분, 15분 간편 설정 및 자유 커스텀 시간 설정
   - **종료 10초 전 시각 및 음성 카운트다운 알림**
   - 시각적 원형 프로그레스 바 및 편안한 차임벨 소리

2. **계절 및 수업 테마 배경 변경**
   - 🌸 봄 벚꽃 테마
   - ☀️ 여름 해변 테마
   - 🍁 가을 단풍 테마
   - ❄️ 겨울 눈꽃 테마
   - 🏫 클래식 칠판 테마
   - 🍰 산리오 파스텔 스위츠 테마

3. **동물의 숲 주민 캐릭터 랜덤 학생 뽑기**
   - 여울, 너굴, 토타케케, 잭슨, 미애, 쭈니, 사이다, 애플 등 인기 주민 고화질 일러스트 탑재
   - 중복 방지 모드(한 번 뽑힌 학생은 전원 완료 전까지 제외) 지원
   - 1명 뽑기 / 모둠 뽑기 / 자리 배치 지원

4. **칠판 알림판 (공지사항 메모)**
   - 오늘의 미션, 발표 순서 등을 크게 띄울 수 있는 전광판 알림 기능

---

## 🚀 GitHub 푸시 방법 (Push to GitHub)

### 방법 1. 자동 스크립트 실행 (가장 추천)
터미널에서 아래 한 줄 명령어를 입력하면 저장소 연결부터 푸시까지 한 번에 완료됩니다:
```bash
./push_to_github.sh https://github.com/본인아이디/저장소이름.git
```

### 방법 2. 직접 명령어로 푸시하기
새 저장소 생성 시 README나 LICENSE가 미리 생성되어 푸시가 거부(`failed to push some refs`)되는 현상을 방지하기 위해 `--force` 옵션을 권장합니다.

```bash
# 1. 브랜치를 main으로 지정
git branch -M main

# 2. 원격 저장소 URL 등록 (이미 origin이 있다면 set-url)
git remote add origin https://github.com/본인아이디/저장소이름.git || git remote set-url origin https://github.com/본인아이디/저장소이름.git

# 3. 모든 파일 스테이징 및 커밋
git add -A
git commit -m "feat: smart classroom timer and animal crossing lottery system"

# 4. GitHub로 원클릭 강제 푸시 (충돌 없이 한 번에 반영)
git push -u origin main --force
```

### 🔑 비밀번호 오류(`Authentication failed`) 발생 시
GitHub는 2021년부터 계정 비밀번호 대신 **Personal Access Token(PAT)**을 사용해야 합니다.
1. GitHub 웹사이트 우측 상단 프로필 ➡️ **Settings**
2. 맨 아래 좌측 **Developer settings** ➡️ **Personal access tokens** ➡️ **Tokens (classic)**
3. **Generate new token (classic)** 클릭
4. Token 이름 입력 후 **`repo`** 체크박스에 체크한 뒤 맨 아래 생성 클릭
5. 발급된 토큰(`ghp_...`)을 복사한 후 아래 형식으로 푸시하면 비밀번호를 묻지 않고 즉시 푸시됩니다:
```bash
git push https://<GITHUB_아이디>:<발급받은_토큰>@github.com/<GITHUB_아이디>/<저장소이름>.git main --force
```
