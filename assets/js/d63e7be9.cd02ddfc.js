"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2180],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return d}});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function u(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var a=r.createContext({}),l=function(e){var n=r.useContext(a),t=n;return e&&(t="function"==typeof e?e(n):u(u({},n),e)),t},c=function(e){var n=l(e.components);return r.createElement(a.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},f=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,o=e.originalType,a=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),f=l(t),d=i,m=f["".concat(a,".").concat(d)]||f[d]||p[d]||o;return t?r.createElement(m,u(u({ref:n},c),{},{components:t})):r.createElement(m,u({ref:n},c))}));function d(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var o=t.length,u=new Array(o);u[0]=f;var s={};for(var a in n)hasOwnProperty.call(n,a)&&(s[a]=n[a]);s.originalType=e,s.mdxType="string"==typeof e?e:i,u[1]=s;for(var l=2;l<o;l++)u[l]=t[l];return r.createElement.apply(null,u)}return r.createElement.apply(null,t)}f.displayName="MDXCreateElement"},7736:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return a},metadata:function(){return l},toc:function(){return c},default:function(){return f}});var r=t(7462),i=t(3366),o=(t(7294),t(3905)),u=["components"],s={id:"unless"},a=void 0,l={unversionedId:"unless",id:"unless",isDocsHomePage:!1,title:"unless",description:"unless() function",source:"@site/docs/unless.md",sourceDirName:".",slug:"/unless",permalink:"/docs/unless",tags:[],version:"current",frontMatter:{id:"unless"},sidebar:"api",previous:{title:"unicodeToArray",permalink:"/docs/unicodeToArray"}},c=[{value:"unless() function",id:"unless-function",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],p={toc:c};function f(e){var n=e.components,t=(0,i.Z)(e,u);return(0,o.kt)("wrapper",(0,r.Z)({},p,t,{components:n,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"unless-function"},"unless() function"),(0,o.kt)("p",null,"If the result of ",(0,o.kt)("inlineCode",{parentName:"p"},"predicate")," is true, ",(0,o.kt)("inlineCode",{parentName:"p"},"process")," will not be executed. ",(0,o.kt)("inlineCode",{parentName:"p"},"unless")," return the result of ",(0,o.kt)("inlineCode",{parentName:"p"},"process")," if it is executed, and if the ",(0,o.kt)("inlineCode",{parentName:"p"},"process")," is not executed, it returns the function argument as is."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Signature:")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-typescript"},"declare function unless<T, N extends T, U>(predicate: (input: T) => input is N, process: (input: Exclude<T, N>) => U): (input: T) => N | (U extends void ? undefined : U);\n")),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"Returns:")),(0,o.kt)("p",null,"(input: T) =",">"," N ","|"," (U extends void ? undefined : U)"),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-ts"},'// it will return only string\nconst unlessIsString: (input: string | undefined) => string = unless(isString, (input) => {\n   throw Error("input is undefiend.")\n});\n')))}f.isMDXComponent=!0}}]);