# 실전 ARTIK Cloud 활용 !

IoT 제품 & 서비스 만들기

---
## 소개
* Tuner 과제 사진 or 동영상
* 엑싯 실패 원인 공유
  * 핵심 부품을 구할 수 없어 나가서 만들 수 없었다.
  * 수많은 부품들에 대한 자재 관리도 감당이 안됨
  * 인력 부족 - 앱 만들기도 바쁜데 커널/BSP까지 신경써야 한다.
  * 하드웨어 기반 스타트업이 쉽지 않은 이유

---
## ARTIK
제품을 개발하는데 아틱&아틱클라우드를 사용 하면 어떤 이득이?

### 보드
* 현실적으로 스핀오프 후 부품수급/자재 관리 어려움. 아틱은 모듈에 다 들어있음.
* 프로토타입 개발 시간 절약 (커널/BSP 제공, API/SDK 제공)

### 클라우드
* 메시지(1K미만) 저장소로 바로 사용 가능 (서버 구축 비용/시간 절약)
* 외부 서비스와 연결/연동 가능 (IFTTT, Alexa, ...)
* 다양한 프로토콜 지원 (REST, WebSockets, MQTT, CoAP)
* 별도 서비스 구축해서 ARTIK Cloud와 연동 가능 (OAuth2 지원)

> 빈번히 바뀌는 아이디어에 대한 프로토타이핑을 빠르게 !
> 하드웨어기반 스타트업의 스핀오프 후 제품 상용화에 현실적인 대안

---
## 무엇을 만드려고 하십니까?
* 하드웨어 / 순수 소프트웨어
* 스핀오프를 원하는 비율
* IoT 연계 가능성

---
## 실습 목표
![piedpiper](https://pbs.twimg.com/profile_images/453002109768589313/dFwynoZy_400x400.png)
GeekRedLed.com 만들어 보기

* IoT Button - Amazon Dash
* IoT LED Light (Red color) - Philips Hue

  ![Dash](http://www.wowfreesamples.com/landing/muestrasacasa_master/items/UK/home-03.png)
  ![Hue](http://willtheywork.com/images/philips/B01C5C9ZLK.png)

---
## ARTIK 710 Board 설명

![ARTIK7](slides/ARTIK-7-platform.jpg)
[Board Reference](https://developer.artik.io/documentation/artik/getting-started/in-the-box.html#board-reference)

---
## ARTIK 710 Board 설명

![ARTIK7](slides/ARTIK-7-interposer.jpg)
[Board Reference](https://developer.artik.io/documentation/artik/getting-started/in-the-box.html#board-reference)

---
## 실습 환경 설정

* ARTIK 710 보드 WiFi 설정(wpa_supplicant)
  * [WiFi Guide](https://developer.artik.io/documentation/developer-guide/ethernet-wifi/wifi.html#select-an-access-point)
* Serial Terminal (PuTTY / TeraTerm)
  * [Serial Setup Guide](https://developer.artik.io/documentation/artik/getting-started/communicating-pc.html#communicating-with-artik-windows)
* Board Test: GPIO(Button, LED)
  * [Blink an LED](https://developer.artik.io/documentation/artik/tutorials/blink-an-led.html#artik-530-and-710-boards)
  * [Reading a button](https://developer.artik.io/documentation/artik/tutorials/read-a-button.html#artik-530710-board)
* 샘플 코드 받기
```bash
dnf install git npm
git clone https://github.com/webispy/akc101.git
cd akc101/board
npm install
```

---
## 1부
* ARTIK Cloud 사이트 기본 활용법
* Device type 생성
* 데이터 주고 받기
* 룰 활용하기

---
## Getting started

### 기본
 * 회원 가입 (구글 계정으로 로그인)
   * https://my.artik.cloud/
 * 사용자 - 디바이스 / 룰 / 차트 / 데이터 로그 보기
   * https://my.artik.cloud/devices
     * Device info: Device ID(DID), Device Type ID(DTID), Device TOKEN
   * https://my.artik.cloud/rules
   * https://my.artik.cloud/messages
 * 개발자 - 디바이스 타입 / 애플리케이션 등록
   * https://developer.artik.cloud/dashboard/devicetypes
   * https://developer.artik.cloud/dashboard/applications

---
### Device 정의
 * 목표
   * 원격으로 제어되는 LED Light (ARTIK 710 보드 내장 LED400)
   * 만능 버튼 (ARTIK 710 보드 내장 SW403)
 * Device Type 등록
   * Manifest for 'GEEK Light'
     * fields: state (string: 'on', 'off')
     * actions: setOn, setOff
   * Manifest for 'GEEK Button'
     * fields: state (string: 'pressed', 'released')
     * actions: none
 * Device 생성하기
 * Token 생성하기

---
### 클라우드에 Message 보내기
만능 버튼 누르면 ARTIK Cloud에 메시지 보내기

 * [ARTIK Cloud API reference](https://developer.artik.cloud/documentation/api-reference/rest-api.html#post-a-message-or-action)
 * JSON (JavaScript Object Notation)
 * curl로 보내기 테스트 (GEEK Button)
```bash
curl -X POST -H "Content-Type:application/json" \
  -H "Authorization:Bearer 8b38d4d3326b4a74803909f560b150d8" \
  "https://api.artik.cloud/v1.1/messages" \
  -d '{ "sdid": "842f9c4bafc84c8f9bd79f95684aa23f", "type": "message", "data": "{ \"state\": \"pressed\"}" }'
```
 * GPIO 처리
   * [ARTIK 710 Headers document]( https://developer.artik.io/documentation/developer-guide/gpio/gpio-mapping.html#artik-710-headers)
   * SW404 == sysfs 30
 * Node.js로 구현하기 (GPIO + HTTP Request)
```bash
cd akc101/board/button
node button.js
```

---
### 룰 작성해보기
 * 만능 버튼 눌렀다 떼면(state == 'released') Email 보내기
```
IF any GEEK Button state is released
THEN Send Email with to = webispy@gmail.com,
  subject = Hey !, body = Button pressed ‌
```
---
### Action 받아보기
GEEK Light에 Action을 보내면 불 켜기/끄기

 * curl로 최근 Action 가져오기 (24시간 사이의 최신 메시지)
```bash
curl -X GET -H "Content-Type:application/json" \
   -H "Authorization:Bearer bf946bc4366d4ef98ed18d089673cbe5" \
   "https://api.artik.cloud/v1.1/actions?count=1&endDate=$(($(date +"%s")*1000))&startDate=$(($(date +"%s")*1000-24*3600*1000))&order=desc&ddid=b809f9e73ebb4a5ab022233253398199"
```
 * 실시간으로 Action 받기 (Websockets)
```bash
cd akc101/board/light
node test_recv.js
```
 * GPIO 처리
   * LED400(Red) == sysfs 28
 * Node.js로 구현하기 ('on' / 'off' 인자 받아서 불 켜고/끄고 상태를 ARTIK Cloud로 보내기)
```bash
cd akc101/board/light
node light.js
```

---
### 룰 업데이트 하기
* 만능 버튼 눌렀다 떼고(state == 'released') Light의 state가 off 이면, Light에 setOn Action 보내기
* 만능 버튼 눌렀다 떼고(state == 'released') Light의 state가 on 이면, Light에 setOff Action 보내기

---
## 2부
 * 디바이스 공유
 * 외부 서비스와 연동
 * 직접 구축한 서비스와 연동

---
### 디바이스 공유해보기
 * 컨셉: 가족끼리 디바이스 공유, 사무실 공용기기를 직원들간에 공유
 * 옆 사람의 GEEK Light를 공유해보기
   * Device type: Private -> Public 으로 변경
   * Devices에서 GEEK Light 아래에 있는 Share Device 선택하고 옆 사람 Email로 초청 보내기
   * 초청 메일 받으면 수락
 * 버튼을 눌러서 옆 사람의 Light를 제어해보기
   * 룰 변경하기 (GEEK Light를 공유받은 GEEK Light로 변경)

---
### 외부 서비스와 연동해보기 (IFTTT, LINE Messenger)
 * 불이 켜지면 IFTTT로 다른 동작 수행시키기
   * IFTTT My Applets에 등록: if light is on, then send a notification
   * GEEK Light 디바이스에 state='on' 메시지가 오면, notification을 보냄
 * 보드의 불이 켜지면 내 라인 메신저로 이벤트 받기 (Sample-Code/03)
   * LINE Notify OAuth2 (https://notify-bot.line.me/)
   * Cloud Connector 제작
     * OAuth2 Configuration: Client ID/Secret, ARTIK Cloud Callback URL
   * Groovy code
     * [MyCloudConnector.groovy](https://github.com/webispy/artikcloud-cloudconnector-sdk/blob/master/linenotify/src/main/groovy/cloudconnector/MyCloudConnector.groovy)
   * LINE Notify Device 추가하기, AUTHORIZE 하기
   * 룰 연동하여 LINE 메신저로 불 상태 이벤트 받기

---
### 직접 구축한 서비스/웹사이트에서 사용자의 아틱 클라우드 디바이스/데이터 연동하기
 * GeekRedLed.com 사이트에서 아틱 클라우드의 데이터 연동하기
 * http://geekredled.com/  
 * 회원가입, ARTIK Cloud OAuth2 인증, User token
 
---
### 기타 사용/구현 가능한 시나리오들 설명 (시연은 하지 않음)
 * 예) 아마존 에코에 음성 명령을 내리면 보드의 불이 On/Off
 * 예) 버튼 누르면 Hue on/off

---
## Q&A
