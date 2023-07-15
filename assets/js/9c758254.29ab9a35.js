"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5367],{3905:function(e,t,n){n.d(t,{Zo:function(){return l},kt:function(){return d}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function a(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),p=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},l=function(e){var t=p(e.components);return r.createElement(c.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,c=e.parentName,l=a(e,["components","mdxType","originalType","parentName"]),s=p(n),d=o,m=s["".concat(c,".").concat(d)]||s[d]||f[d]||i;return n?r.createElement(m,u(u({ref:t},l),{},{components:n})):r.createElement(m,u({ref:t},l))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,u=new Array(i);u[0]=s;var a={};for(var c in t)hasOwnProperty.call(t,c)&&(a[c]=t[c]);a.originalType=e,a.mdxType="string"==typeof e?e:o,u[1]=a;for(var p=2;p<i;p++)u[p]=n[p];return r.createElement.apply(null,u)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},9560:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return a},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return l},default:function(){return s}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),u=["components"],a={id:"throwIf"},c=void 0,p={unversionedId:"throwIf",id:"throwIf",isDocsHomePage:!1,title:"throwIf",description:"throwIf() function",source:"@site/docs/throwIf.md",sourceDirName:".",slug:"/throwIf",permalink:"/docs/throwIf",tags:[],version:"current",frontMatter:{id:"throwIf"},sidebar:"api",previous:{title:"throwError",permalink:"/docs/throwError"},next:{title:"toArray",permalink:"/docs/toArray"}},l=[{value:"throwIf() function",id:"throwif-function",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],f={toc:l};function s(e){var t=e.components,n=(0,o.Z)(e,u);return(0,i.kt)("wrapper",(0,r.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"throwif-function"},"throwIf() function"),(0,i.kt)("p",null,"throw return of ",(0,i.kt)("inlineCode",{parentName:"p"},"err")," if predicate function return true"),(0,i.kt)("p",null,"default throw function is ",(0,i.kt)("a",{parentName:"p",href:"https://fxts.dev/docs/identity"},"identity")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Signature:")),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-typescript"},"declare function throwIf<T, N extends T>(predicate: (input: T) => input is N, err?: (input: N) => unknown): (input: T) => Exclude<T, N>;\n")),(0,i.kt)("p",null,(0,i.kt)("strong",{parentName:"p"},"Returns:")),(0,i.kt)("p",null,"(input: T) =",">"," Exclude","<","T, N",">"),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-ts"},' pipe(\n   fn(), // return type is string | undefined\n\n   throwIf(isUndefined, (err) => Error("return of fn() is undefined")),\n   // err is undefined, and it is return of fn\n\n   (input) => input, // input is string\n )\n')))}s.isMDXComponent=!0}}]);