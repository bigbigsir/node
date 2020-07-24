(this.webpackJsonpreact_admin=this.webpackJsonpreact_admin||[]).push([[7],{70:function(e,t,a){"use strict";a.d(t,"b",(function(){return r})),a.d(t,"c",(function(){return c}));var n=a(5),r=function(e,t){return n.a.post("/project/getProjectList",e,t)},c=function(e,t){return n.a.post("/project/removeProject",e,t)};t.a={addProject:function(e,t){return n.a.post("/project/addProject",e,t)},getProjects:function(e,t){return n.a.post("/project/getProjects",e,t)},updateProject:function(e,t){return n.a.post("/project/updateProject",e,t)},removeProject:c,getProjectList:r}},77:function(e,t,a){e.exports={page:"projects_page__WyTXV",page__header:"projects_page__header__1MdNG"}},95:function(e,t,a){"use strict";a.r(t);var n=a(1),r=a(32),c=a(0),l=a.n(c),o=a(56),i=a.n(o),u=a(9),s=a(31),d=a(70),m=a(63),p=a(77),f=a.n(p),b=(i.a.bind(f.a),function(e){var t=Object(m.a)(),a=e.role,n=e.modalVisible,o=e.onCancel,i=e.onSuccess,s=Object(c.useState)(t.formatMessage({id:"add"})),p=Object(r.a)(s,2),f=p[0],b=p[1],j=u.Form.useForm(),g=Object(r.a)(j,1)[0],h=[{required:!0}];function E(e){e.id?function(e){d.a.updateProject(e).then((function(e){e.success&&(o(),i())}))}(e):function(e){d.a.addProject(e).then((function(e){e.success&&(o(),i())}))}(e),console.log(e)}return Object(c.useEffect)((function(){a?(g.setFieldsValue(a),b(t.formatMessage({id:"update"}))):(g.resetFields(),b(t.formatMessage({id:"add"})))}),[n,a]),l.a.createElement(u.Modal,{title:f,onOk:function(){return g.submit()},visible:n,onCancel:o,maskClosable:!1},l.a.createElement(u.Form,{name:"menu",form:g,labelCol:{span:4},onFinish:function(e){return E(e)}},l.a.createElement(u.Form.Item,{name:"id",noStyle:!0},l.a.createElement(u.Input,{hidden:!0,type:"text"})),l.a.createElement(u.Form.Item,{name:"type",rules:h,label:"\u7c7b\u578b"},l.a.createElement(u.Select,{placeholder:"\u7c7b\u578b"},l.a.createElement(u.Select.Option,{value:"Web"},"Web"),l.a.createElement(u.Select.Option,{value:"Node"},"Node"))),l.a.createElement(u.Form.Item,{name:"name",rules:h,label:"\u540d\u79f0"},l.a.createElement(u.Input,{maxLength:16,placeholder:"\u540d\u79f0"})),l.a.createElement(u.Form.Item,{name:"key",rules:h,label:"\u6807\u8bc6"},l.a.createElement(u.Input,{placeholder:"\u6807\u8bc6"})),l.a.createElement(u.Form.Item,{name:"projectDir",rules:h,label:"\u9879\u76ee\u76ee\u5f55"},l.a.createElement(u.Input,{placeholder:"\u9879\u76ee\u76ee\u5f55"})),l.a.createElement(u.Form.Item,{name:"secret",rules:h,label:"\u79d8\u94a5"},l.a.createElement(u.Input,{placeholder:"\u79d8\u94a5"})),l.a.createElement(u.Form.Item,{name:"shellPath",rules:h,label:"shell\u8def\u5f84"},l.a.createElement(u.Input,{placeholder:"shell\u8def\u5f84"})),l.a.createElement(u.Form.Item,{name:"describe",label:"\u63cf\u8ff0"},l.a.createElement(u.Input.TextArea,{placeholder:"\u63cf\u8ff0",rows:4}))))}),j=i.a.bind(f.a);t.default=function(){var e=Object(m.a)(),t=Object(c.useState)(null),a=Object(r.a)(t,2),o=a[0],i=a[1],p=Object(c.useState)(!1),f=Object(r.a)(p,2),g=f[0],h=f[1],E=Object(c.useState)({total:0,current:1,pageSize:10}),O=Object(r.a)(E,2),I=O[0],S=O[1],v=Object(c.useState)([]),P=Object(r.a)(v,2),x=P[0],F=P[1],_=Object(c.useState)(!1),w=Object(r.a)(_,2),y=w[0],k=w[1],C=[{title:"\u540d\u79f0",width:150,fixed:"left",dataIndex:"name"},{title:"\u6807\u8bc6",width:150,dataIndex:"key"},{title:"\u7c7b\u578b",width:150,dataIndex:"type",render:function(e){return l.a.createElement(u.Tag,{color:"blue"},e)}},{title:"\u9879\u76ee\u76ee\u5f55",dataIndex:"projectDir"},{title:"shell\u8def\u5f84",dataIndex:"shellPath"},{title:"\u79d8\u94a5",dataIndex:"secret"},{title:"\u63cf\u8ff0",dataIndex:"describe"},{title:"\u64cd\u4f5c",key:"action",fixed:"right",width:150,render:function(t,a){return l.a.createElement(l.a.Fragment,null,l.a.createElement("a",{onClick:function(){return function(e){i(e),h(!0)}(a)},href:"javascript:void (0);"},e.formatMessage({id:"update"})),l.a.createElement(u.Divider,{type:"vertical"}),l.a.createElement(u.Popconfirm,{title:e.formatMessage({id:"deleteTips"}),onConfirm:function(){return function(e){d.c({id:e.id}).then((function(e){e.success&&M()}))}(a)}},l.a.createElement("a",{href:"javascript:void (0);"},e.formatMessage({id:"delete"}))))}}];function M(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};e=Object(n.a)({page:I.current,pageSize:I.pageSize},e),k(!0),d.b(e).then((function(e){var t=e.success,a=e.data;t&&(S({total:a.total,current:a.page,pageSize:a.pageSize}),F(a.rows)),k(!1)}))}return Object(c.useEffect)(M,[]),l.a.createElement("div",{className:j("page")},l.a.createElement(u.Space,{align:"center",className:j("page__header")},l.a.createElement(u.Button,{onClick:function(){i(null),h(!0)},type:"primary",icon:l.a.createElement(s.PlusOutlined,null)},e.formatMessage({id:"add"}))),l.a.createElement(u.Table,{rowKey:"id",scroll:{x:"100vw"},loading:y,pagination:Object(n.a)(Object(n.a)({},I),{},{showTotal:function(e){return"\u5171 ".concat(e," \u6761")}}),onChange:function(e){M({page:e.current,pageSize:e.pageSize})},columns:C,defaultExpandAllRows:!0,dataSource:x}),l.a.createElement(b,{role:o,modalVisible:g,onSuccess:function(){return M()},onCancel:function(){return h(!1)}}))}}}]);
//# sourceMappingURL=projects.ef7cbdc1.chunk.js.map