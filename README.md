# svg mask moiton V1.0.0

## 실행

```javascript
// 첫번째 arg는 target canvas tag
// 두번째 arg는 option
const project = new SVGTEXT(element, option);
```

<br><br>

## 꼭 넣어야 하는 옵션

|option name|default|설명|
|------|---|---|
|src|''|svg 이미지 경로|
|bgSrc|''|배경 이미지 경로|
|viewBoxW|1|svg viewbox width|
|viewBoxH|1|svg viewbox height|

<br><br>

## 꼭 안넣어도 되는 공통 옵션

|option name|default|설명|
|------|---|---|
|reverse|false|모션 반대 여부 (반대 시 true)|
|bland|'source-out'|bland mode 명|
|bgColor|'#ffffff'|마스킹 외 영역 배경 컬러색|
|speed|0.01|play 시 speed 값|
|mode|'scale'|모션 모드 (scale, moveX, moveY) |

<br><br>

## mode - scale 옵션

|option name|default|설명|
|------|---|---|
|minScale|1|최소 스케일 값|
|maxScale|10|최대 스케일 값|
|positionX|0|position x 위치|
|positionY|0|position y 위치|
|alignX|'center'|x 좌표 정렬 (left, center, right)|
|alignY|'center'|y 좌표 정렬 (top, center, bottom)|
|originX|0|x 좌표 origin (center 기준 +-)|
|originY|0|y 좌표 origin (center 기준 +-)|

<br><br>

## mode - move x 옵션

|option name|default|설명|
|------|---|---|
|startP|0|스타트 지점|

<br><br>

## mode - move y 옵션

|option name|default|설명|
|------|---|---|
|startP|0|스타트 지점|

<br><br>

## callback

|callback name|설명|
|------|---|
|startEvent|start 시 실행|
|endEvent|end 시 실행|

<br><br>

## event

|event name|설명|
|------|---|
|load|리소스를 로드하여 첫번째 화면을 띄어줌|
|draw|로드가 된 상태에서 원하는 프레임에 화면을 그려줌 (0~1)|
|resize|resize 함수|
|scroll|scroll에 따라 화면을 그려줌 0~1 의 인자를 넣어줘야 함|
|play|모션 자동 재생|
|pause|play 상태일때 일시정지|
|stop|play 상태일때 정지|
|destroy|모듈 제거|
