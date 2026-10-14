#!/usr/bin/env bash
set -e

# ==========================================
# 🚀 GitHub 원클릭 푸시 스크립트 (Push Helper)
# ==========================================

REPO_URL="$1"

if [ -z "$REPO_URL" ]; then
  echo "========================================================"
  echo "📌 GitHub 저장소 주소를 입력해주세요."
  echo "예시: https://github.com/사용자아이디/저장소이름.git"
  echo "========================================================"
  read -p "GitHub Repository URL: " REPO_URL
fi

if [ -z "$REPO_URL" ]; then
  echo "❌ 저장소 URL이 입력되지 않았습니다. 종료합니다."
  exit 1
fi

echo ""
echo "🚀 1. Git 브랜치 및 저장소 상태 확인 중..."
git branch -M main

echo "🚀 2. 원격 저장소(origin) 연결 설정 중..."
if git remote | grep -q "^origin$"; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

echo "🚀 3. 변경사항 스테이징 및 커밋 정리..."
git add -A
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
  git commit -m "feat: smart classroom timer and animal crossing lottery system"
else
  echo "   (모든 파일이 이미 커밋되어 있습니다)"
fi

echo ""
echo "🚀 4. GitHub로 푸시 시작 (main 브랜치)..."
echo "   * 원격 저장소에 이미 README나 파일이 있는 경우를 대비해 덮어쓰기(--force) 푸시를 진행합니다."
echo ""

if git push -u origin main --force; then
  echo ""
  echo "========================================================"
  echo "🎉 축하합니다! GitHub 푸시가 완벽하게 성공했습니다!"
  echo "저장소 주소: $REPO_URL"
  echo "========================================================"
else
  echo ""
  echo "========================================================"
  echo "⚠️ 푸시 중 인증 또는 권한 오류가 발생했습니다."
  echo ""
  echo "🔑 [해결 방법 - GitHub Personal Access Token 발급]"
  echo "1. GitHub 우측 상단 프로필 클릭 -> Settings"
  echo "2. 맨 아래 'Developer settings' -> 'Personal access tokens' -> 'Tokens (classic)'"
  echo "3. 'Generate new token (classic)' 클릭"
  echo "4. Note에 'my-app' 입력 후, [repo] 체크박스 선택 -> 하단 'Generate token' 클릭"
  echo "5. 생성된 ghp_... 토큰을 복사한 뒤, 다음 명령어를 실행해주세요:"
  echo ""
  echo "   git push https://<GITHUB_아이디>:<복사한_토큰>@github.com/<GITHUB_아이디>/<저장소이름>.git main --force"
  echo "========================================================"
  exit 1
fi
