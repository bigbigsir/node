(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-267f68b8"],{"2a65":function(t,i,a){"use strict";a.r(i);var e=function(){var t=this,i=t.$createElement,a=t._self._c||i;return a("div",{staticClass:"promotions container"},[t.promoList.length?t._l(t.promoList,(function(i,e){return a("div",{key:e,staticClass:"promotions__item"},[a("a",{staticClass:"promotions__img-wrapper default-bg-small",attrs:{href:i.link,target:i.is_blank?"_blank":"_self"}},[a("img",{directives:[{name:"lazy",rawName:"v-lazy",value:i.pic,expression:"item.pic"}],staticClass:"promotions__img",attrs:{alt:i.title}})]),a("p",{staticClass:"promotions__title"},[t._v(t._s(i.title))]),a("p",{staticClass:"promotions__sub-title"},[t._v(t._s(i.label))]),a("p",{staticClass:"promotions__date"},[t._v(t._s(i.date))])])})):t._l(3,(function(i){return a("div",{key:i,staticClass:"promotions__item"},[a("a",{staticClass:"promotions__img-wrapper default-bg-small"}),a("p",{staticClass:"promotions__title"},[t._v("--")]),a("p",{staticClass:"promotions__sub-title"},[t._v("--")]),a("p",{staticClass:"promotions__date"},[t._v("-")])])}))],2)},n=[],s=a("c32d"),o=a.n(s),r=a("ca00"),l={name:"promotions",data:function(){return{promoList:[]}},created:function(){this.getPromoList()},methods:{getPromoList:function(){var t=this,i="/_promo/promo_list_new.txt?_="+Object(r["d"])();this.$api.getWmsStatic(i).then((function(i){var a,e=i.data,n=[],s=Date.now();Array.isArray(e)&&(e=e.filter((function(t){return"1"===t.retain1&&(t.time_begin===t.time_end?0===+t.time_begin:1e3*t.time_end>s)})),e=e.map((function(i){return a={title:i.title,label:i.label,link:i.link?"/h5".concat(i.link):null,is_blank:1===+i.is_blank,pic:"".concat(window.OMConfig.wmsServer,"/").concat(i.pic).concat(t.$useWebpImg("_"))},0===+i.time_begin?a.date="永久有效":a.date="".concat(t.formatDate(i.time_begin)," - ").concat(t.formatDate(i.time_end)),a})),n=e),t.promoList=n}))},formatDate:function(t){return o()(1e3*t).format("YYYY年MM月DD日")}}},c=l,_=(a("7b65"),a("2877")),m=Object(_["a"])(c,e,n,!1,null,"75f1fd6e",null);i["default"]=m.exports},"7b65":function(t,i,a){"use strict";var e=a("d9db"),n=a.n(e);n.a},d9db:function(t,i,a){}}]);