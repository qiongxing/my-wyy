# 项目：WyyApp（仿网易云web）

[Angular CLI](https://github.com/angular/angular-cli) version 8.3.9.

## 后端：网易云API

[地址](https://binaryify.github.io/NeteaseCloudMusicApi/#/)，为网上现有的网易云API

> 安装后默认启动路径: <http://localhost:3000>

## 前端

### 使用技术

- UI框架：`NG-ZORRO`
- CSS技术：`Less`
- 状态管理：`ngrx/store`

### 项目启动

``` json
 "start": "ng serve --port 4201",//项目启动
 "build": "ng build --prod --optimization --progress --extractCss",//项目构建
 "serve": "node serve.js" //服务启动
```

### 目前已知未完成功能

- [ ] 调用注册接口完成注册(目前只是给出提示)

### 目前存在的Bug

- [ ] 获取歌曲详情只有10条数据

## 最后

该项目为学习angular语法建立的项目，所以存在部分功能未完善，或因为网易云Api调整后未及时修复的bug，或者没有发现的问题
