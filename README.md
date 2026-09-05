# TNT 게임 파이널 런처

후니버스 **티엔티게임 파이널 (한글날 특집)** 전용 마인크래프트 런처.
[HeliosLauncher](https://github.com/dscalzi/HeliosLauncher) 포크.

이 게임은 **클라이언트 모드가 필수**다. 모드가 없으면 로비 셋업 화면이 열리지 않아
게임에 들어갈 수 없다. 런처가 모드를 자동으로 설치·갱신한다.

## 시청자용 — 설치

1. [최신 릴리스](https://github.com/donghune/tnt-final-launcher/releases/latest)에서
   `tnt-final-launcher-setup-*.exe` 다운로드
2. 설치 후 실행 → 마이크로소프트 계정 로그인 → **플레이**
3. 모드는 자동으로 받아지고, 서버에 바로 접속된다

## 구성

| | |
|---|---|
| 마인크래프트 | 26.1.2 (Fabric 0.19.3, Java 25) |
| 서버 | `game.donghune.kr:25572` |
| 모드 | `tnt_game_client`, `hunmin_client`, Fabric API 0.155.2+26.1.2 |

모드 소스는 [bitstone](https://github.com/donghune/bitstone) 리포의
`mod/app/hobaek/` 아래에 있다.

## 배포망 (distribution.json)

이 레포가 **Nebula 배포망 루트를 겸한다.** 런처는 실행할 때마다
`https://raw.githubusercontent.com/donghune/tnt-final-launcher/main/distribution.json`
을 원격으로 읽는다 — **서버 주소나 모드를 바꿔도 exe 재배포가 필요 없고, 커밋만 하면 된다.**

```
distribution.json                          # 런처가 읽는 것 (Nebula 생성물, 직접 수정 금지)
meta/distrometa.json                       # rss 등 배포망 메타 (여기를 고친다)
servers/tnt-26.1.2/servermeta.json         # 서버 주소·이름·javaOptions (여기를 고친다)
servers/tnt-26.1.2/fabricmods/required/    # 필수 모드 jar
repo/                                      # Fabric 로더 라이브러리
```

### 모드를 고친 뒤

bitstone 리포에서:

```bash
DISTRO_ROOT=~/MinecraftProjects/bitstone_launcher/tnt-final-launcher \
BASE_URL=https://raw.githubusercontent.com/donghune/tnt-final-launcher/main/ \
  ./launcher/build-distro.sh
```

그 다음 이 레포에서 커밋·푸시하면 끝이다. exe 재빌드 불필요.

> ⚠️ **jar 를 손으로 바꾸고 distro 재생성을 빼먹으면 안 된다.** `distribution.json` 에
> MD5 가 박혀 있어서, 안 맞으면 런처가 파일이 손상됐다고 보고 실행 직전에 죽는다.

### 서버 주소만 바꿀 때

`servers/tnt-26.1.2/servermeta.json` 의 `address` 를 고치고 위 명령을
`--skip-build` 로 돌린 뒤 커밋한다.

## exe 빌드

`v*` 태그를 push 하면 GitHub Actions(`.github/workflows/build.yml`)가
windows-latest 에서 nsis 설치본을 만들어 릴리스에 올린다.

```bash
git tag v1.0.1 && git push origin v1.0.1
```

## 원본 HeliosLauncher 대비 바꾼 곳

전체 설명은 bitstone 리포의 `launcher/README.md` 참조.

1. `app/assets/js/distromanager.js` — `REMOTE_DISTRO_URL` → 이 레포의 raw URL
2. `app/assets/js/configmanager.js` — natives 폴더 `TntNatives`, 데이터 폴더 `.tntfinallauncher`
   (다른 런처와 갈라야 서로의 mods 폴더를 안 덮어쓴다)
3. `app/assets/js/processbuilder.js` — 네이티브 추출 경로를 **매니페스트에서 읽어** 결정 + 동기 write
   - 버전마다 다르다. 26.2 는 `-Djava.library.path=${natives_directory}/java` 로 `java/` 하위를,
     26.1.2 는 `${natives_directory}` 로 루트를 기대한다. 어느 한쪽으로 하드코딩하면
     반대쪽이 `Failed to locate library: lwjgl.dll` 로 반드시 죽는다.
   - 비동기로 쓰면 추출이 끝나기 전에 게임이 스폰돼 같은 크래시가 난다.
4. `index.js` + `app/assets/js/scripts/uibinder.js` — `distributionIndexDone` 이벤트 재전송
   (배포망 응답이 빠르면 렌더러가 이벤트를 놓쳐 **로딩 화면에서 영원히 멈춘다**)
5. `electron-builder.yml` / `package.json` — 앱 이름·아이디·아티팩트명
6. `app/assets/lang/_custom.toml` — 브랜딩 문구

## 라이선스

원본과 동일 (`LICENSE.txt`).
