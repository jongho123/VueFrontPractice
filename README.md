# vuefrontpractice

## 모듈 설치
```sh
$ npm install
```

### 컴파일 및 실행.
```sh
$ npm run serve
```
현재는 서버를 같이 돌려야 함.  
Vue 만 돌리면 페이지는 보이나 로그인이나 Todo 컨텐츠를 가져올 수 없음.

서버의 포트를 변경했다면 vue.config.js 파일의 포트 변경 필요.
```javascript
//vue.config.js

      '/api': {
        // 이 부분의 포트 변경 필요.
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {

```

### 빌드
```sh
$ npm run build
```
나중에 서버에 빌드되도록 변경할 예정.


### 테스트 실행
```sh
$ npm run test:unit
```
