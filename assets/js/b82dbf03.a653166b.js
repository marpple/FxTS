"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7240],{3905:function(e,n,t){t.d(n,{Zo:function(){return p},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function l(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?l(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function a(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)t=l[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var u=r.createContext({}),c=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},p=function(e){var n=c(e.components);return r.createElement(u.Provider,{value:n},e.children)},s={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,l=e.originalType,u=e.parentName,p=a(e,["components","mdxType","originalType","parentName"]),f=c(t),d=i,m=f["".concat(u,".").concat(d)]||f[d]||s[d]||l;return t?r.createElement(m,o(o({ref:n},p),{},{components:t})):r.createElement(m,o({ref:n},p))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var l=t.length,o=new Array(l);o[0]=f;var a={};for(var u in n)hasOwnProperty.call(n,u)&&(a[u]=n[u]);a.originalType=e,a.mdxType="string"==typeof e?e:i,o[1]=a;for(var c=2;c<l;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},8525:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return a},contentTitle:function(){return u},metadata:function(){return c},toc:function(){return p},default:function(){return f}});var r=t(7462),i=t(3366),l=(t(7294),t(3905)),o=["components"],a={id:"isNil"},u=void 0,c={unversionedId:"isNil",id:"isNil",isDocsHomePage:!1,title:"isNil",description:"isNil() function",source:"@site/docs/isNil.md",sourceDirName:".",slug:"/isNil",permalink:"/docs/isNil",tags:[],version:"current",frontMatter:{id:"isNil"},sidebar:"api",previous:{title:"isEmpty",permalink:"/docs/isEmpty"},next:{title:"isNumber",permalink:"/docs/isNumber"}},p=[{value:"isNil() function",id:"isnil-function",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],s={toc:p};function f(e){var n=e.components,t=(0,i.Z)(e,o);return(0,l.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,l.kt)("h2",{id:"isnil-function"},"isNil() function"),(0,l.kt)("p",null,"Checks if the given value is ",(0,l.kt)("inlineCode",{parentName:"p"},"null")," or ",(0,l.kt)("inlineCode",{parentName:"p"},"undefined"),"."),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Signature:")),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-typescript"},"isNil: <T>(a: T) => a is Include<T, null | undefined>\n")),(0,l.kt)("p",null,(0,l.kt)("strong",{parentName:"p"},"Returns:")),(0,l.kt)("p",null,"a is Include","<","T, null ","|"," undefined",">"),(0,l.kt)("h2",{id:"example"},"Example"),(0,l.kt)("pre",null,(0,l.kt)("code",{parentName:"pre",className:"language-ts"},"isNil(1); // false\nisNil('1'); // false\nisNil(undefined); // true\nisNil(null); // true\n")))}f.isMDXComponent=!0}}]);