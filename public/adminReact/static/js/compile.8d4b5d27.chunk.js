(this.webpackJsonpreact_admin=this.webpackJsonpreact_admin||[]).push([[1],{70:function(e,t,n){"use strict";n.d(t,"b",(function(){return c})),n.d(t,"c",(function(){return r}));var o=n(5),c=function(e,t){return o.a.post("/project/getProjectList",e,t)},r=function(e,t){return o.a.post("/project/removeProject",e,t)};t.a={addProject:function(e,t){return o.a.post("/project/addProject",e,t)},getProjects:function(e,t){return o.a.post("/project/getProjects",e,t)},updateProject:function(e,t){return o.a.post("/project/updateProject",e,t)},removeProject:r,getProjectList:c}},84:function(e,t,n){e.exports={menu:"compile_menu__2ywfI",menu__header:"compile_menu__header__7qitU","menu__tree-select":"compile_menu__tree-select__QFRCn",log:"compile_log__20Hpu",log__content:"compile_log__content__17vNb",log__alert:"compile_log__alert__3g_n_"}},90:function(e,t,n){"use strict";n.r(t);var o=n(32),c=n(0),r=n.n(c),a=n(56),s=n.n(a),u=n(9),i=n(31),l=n(70),_=n(5),m=n(59),d=n.n(m),p=n(60),f=n.n(p),g=n(84),j=n.n(g),b=n(8),v=s.a.bind(j.a);t.default=function(){var e=Object(c.useRef)(null),t=Object(c.useState)(""),n=Object(o.a)(t,2),a=n[0],s=n[1],m=Object(c.useState)(!1),p=Object(o.a)(m,2),g=p[0],j=p[1],E=Object(c.useState)(),O=Object(o.a)(E,2),h=O[0],k=O[1],P=Object(c.useState)([]),N=Object(o.a)(P,2),S=N[0],y=N[1],w=Object(c.useState)(),H=Object(o.a)(w,2),C=H[0],L=H[1],R=Object(b.c)((function(e){return e.token}));function A(){var e=d()("https://60kg.top:3000/socket/webHooks",{autoConnect:!1,reconnection:!1,transportOptions:{polling:{extraHeaders:{token:R}}}});e.connect(),e.on("connect",(function(){e.connected&&function(e){var t=S.filter((function(e){return e.id===h}))[0],n={timeout:12e4,headers:{"socket-id":e,"X-Hub-Signature":"sha1="+f.a.HmacSHA1(JSON.stringify({}),t.secret).toString()}},o={web:"/webHooks/webProject/",node:"/webHooks/nodeProject/"}[t.type.toLowerCase()]+t.key;_.a.post(o,{_isNeedLoginName:!1},n).then((function(e){var t=e.success;j(!1),L(t?"success":"error")}))}(e.id)})),e.on("process_stdout",(function(e){s((function(t){return t+e}))})),e.on("process_stderr",(function(e){s((function(t){return t+e}))})),e.on("process_error",(function(e){s((function(t){return t+e}))})),e.on("process_close",(function(e){s((function(t){return t+e}))})),e.on("error",(function(e){j(!1),u.message.error(e),console.log("error=>",e)})),e.on("connect_error",(function(e){j(!1),u.message.error("Socket connect error"),console.log("connect_error=>",e)})),e.on("disconnect",(function(t){e.disconnect(),console.log("disconnect=>",t)}))}return Object(c.useEffect)((function(){l.a.getProjects().then((function(e){var t=e.success,n=e.data;t&&y(n)}))}),[]),Object(c.useEffect)((function(){var t=e.current;t&&(t.scrollTop=t.scrollHeight)}),[a,g]),r.a.createElement("div",{className:v("menu")},r.a.createElement("div",{className:v("menu__header")},r.a.createElement(u.Space,{direction:"vertical"},r.a.createElement("div",null,r.a.createElement("h4",null,"\u9879\u76ee\u5217\u8868"),r.a.createElement(u.Radio.Group,{onChange:function(e){k(e.target.value)},value:h},S.map((function(e){return r.a.createElement(u.Radio,{value:e.id,key:e.id},e.name)})))),r.a.createElement(u.Button,{loading:g,onClick:function(){h?(s(""),j(!0),A()):u.message.info("\u8bf7\u9009\u62e9\u9879\u76ee")},type:"primary",icon:r.a.createElement(i.CloudUploadOutlined,null)},"\u4e00\u952e\u90e8\u7f72"))),r.a.createElement(u.Space,{direction:"vertical",className:v("menu__header")}),r.a.createElement("div",{className:v("menu__header")},r.a.createElement(u.Card,{className:v("log"),type:"inner",title:"\u8fdb\u5ea6\u65e5\u5fd7"},r.a.createElement("div",{ref:e,className:v("log__content")},(g||a)&&r.a.createElement(u.Alert,{className:v("log__alert"),message:"\u5f00\u59cb\u90e8\u7f72",type:"info"}),a,!g&&a&&r.a.createElement(u.Alert,{className:v("log__alert"),message:"success"===C?"\u6210\u529f\u90e8\u7f72":"\u90e8\u7f72\u5931\u8d25",type:C})))))}}}]);
//# sourceMappingURL=compile.8d4b5d27.chunk.js.map