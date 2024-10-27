"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[712],{300:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>o,toc:()=>l});var t=n(4848),s=n(8453);const a={id:"reverse"},i=void 0,o={id:"reverse",title:"reverse",description:"reverse() function",source:"@site/docs/reverse.md",sourceDirName:".",slug:"/reverse",permalink:"/docs/reverse",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"reverse"},sidebar:"api",previous:{title:"repeat",permalink:"/docs/repeat"},next:{title:"scan",permalink:"/docs/scan"}},c={},l=[{value:"reverse() function",id:"reverse-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const r={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.h2,{id:"reverse-function",children:"reverse() function"}),"\n",(0,t.jsxs)(r.p,{children:["Returns Iterable/AsyncIterable of the given elements in reverse order. Note",":Evaluates"," all Iterable, except for array, and returns a lazy-reversed iterator."]}),"\n",(0,t.jsx)("b",{children:"Signature:"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-typescript",children:"declare function reverse<T extends Iterable<unknown> | AsyncIterable<unknown>>(iterable: T): ReturnIterableIteratorType<T>;\n"})}),"\n",(0,t.jsx)(r.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:'const iter1 = reverse([1, 2, 3]);\r\niter1.next(); // {value: 3, done: false}\r\niter1.next(); // {value: 2, done: false}\r\niter1.next(); // {value: 1, done: false}\r\niter1.next(); // {value: undefined, done: true}\r\n\r\nconst iter2 = reverse("abc");\r\niter2.next(); // {value: "c", done: false}\r\niter2.next(); // {value: "b", done: false}\r\niter2.next(); // {value: "a", done: false}\r\niter2.next(); // {value: undefined, done: true}\r\n\r\n// with pipe\r\npipe(\r\n [1, 2, 3, 4, 5],\r\n reverse,\r\n toArray,\r\n); // [5, 4, 3, 2, 1]\r\n\r\npipe(\r\n "abcde",\r\n reverse,\r\n toArray,\r\n); // "edcba"\n'})}),"\n",(0,t.jsxs)(r.p,{children:["see ",(0,t.jsx)(r.a,{href:"https://fxts.dev/docs/pipe",children:"pipe"})," ",(0,t.jsx)(r.a,{href:"https://fxts.dev/docs/toArray",children:"toArray"})]}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.a,{href:"https://github.com/marpple/FxTS/blob/main/src/Lazy/reverse.ts",children:"Open Source Code"})})]})}function u(e={}){const{wrapper:r}={...(0,s.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>o});var t=n(6540);const s={},a=t.createContext(s);function i(e){const r=t.useContext(a);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function o(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:i(e.components),t.createElement(a.Provider,{value:r},e.children)}}}]);