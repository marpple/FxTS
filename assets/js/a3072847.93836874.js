"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8659],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return b}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var u=r.createContext({}),l=function(e){var t=r.useContext(u),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},s=function(e){var t=l(e.components);return r.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,c=e.originalType,u=e.parentName,s=a(e,["components","mdxType","originalType","parentName"]),f=l(n),b=i,m=f["".concat(u,".").concat(b)]||f[b]||p[b]||c;return n?r.createElement(m,o(o({ref:t},s),{},{components:n})):r.createElement(m,o({ref:t},s))}));function b(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var c=n.length,o=new Array(c);o[0]=f;var a={};for(var u in t)hasOwnProperty.call(t,u)&&(a[u]=t[u]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var l=2;l<c;l++)o[l]=n[l];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},9273:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return u},metadata:function(){return l},toc:function(){return s},default:function(){return f}});var r=n(7462),i=n(3366),c=(n(7294),n(3905)),o=["components"],a={id:"isObject"},u=void 0,l={unversionedId:"isObject",id:"isObject",isDocsHomePage:!1,title:"isObject",description:"isObject() function",source:"@site/docs/isObject.md",sourceDirName:".",slug:"/isObject",permalink:"/docs/isObject",tags:[],version:"current",frontMatter:{id:"isObject"},sidebar:"api",previous:{title:"isNumber",permalink:"/docs/isNumber"},next:{title:"isString",permalink:"/docs/isString"}},s=[{value:"isObject() function",id:"isobject-function",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],p={toc:s};function f(e){var t=e.components,n=(0,i.Z)(e,o);return(0,c.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,c.kt)("h2",{id:"isobject-function"},"isObject() function"),(0,c.kt)("p",null,"Checks if value is the type of object."),(0,c.kt)("p",null,(0,c.kt)("strong",{parentName:"p"},"Signature:")),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-typescript"},"isObject: <T>(a: T) => a is Include<T, object>\n")),(0,c.kt)("p",null,(0,c.kt)("strong",{parentName:"p"},"Returns:")),(0,c.kt)("p",null,"a is Include","<","T, object",">"),(0,c.kt)("h2",{id:"example"},"Example"),(0,c.kt)("pre",null,(0,c.kt)("code",{parentName:"pre",className:"language-ts"},"isObject({}); // true\nisObject([1, 2, 3]); // true\nisObject(() => {}); // true\nisObject(null); // false\nisObject(123); // false\n")))}f.isMDXComponent=!0}}]);