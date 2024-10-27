"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2257],{5957:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>p,frontMatter:()=>c,metadata:()=>i,toc:()=>l});var s=t(4848),r=t(8453);const c={id:"toAsync"},o=void 0,i={id:"toAsync",title:"toAsync",description:"toAsync() function",source:"@site/docs/toAsync.md",sourceDirName:".",slug:"/toAsync",permalink:"/docs/toAsync",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"toAsync"},sidebar:"api",previous:{title:"takeWhile",permalink:"/docs/takeWhile"},next:{title:"uniq",permalink:"/docs/uniq"}},a={},l=[{value:"toAsync() function",id:"toasync-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,r.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h2,{id:"toasync-function",children:"toAsync() function"}),"\n",(0,s.jsxs)(n.p,{children:["Returns AsyncIterable, ",(0,s.jsx)(n.code,{children:"toAsync"})," used when you want to handle Promise values inside Iterable."]}),"\n",(0,s.jsx)("b",{children:"Signature:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-typescript",children:"declare function toAsync<T>(iter: Iterable<T | Promise<T>>): AsyncIterableIterator<T>;\n"})}),"\n",(0,s.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-ts",children:"let acc = 0;\r\nfor await (const item of toAsync([1, 2, 3, 4, 5])) {\r\n  acc += item;\r\n}\r\n// acc: 15\r\n\r\n// with pipe\r\nawait pipe(\r\n [Promise.resolve(1),Promise.resolve(2),Promise.resolve(3)],\r\n toAsync,\r\n map(a => a + 10),\r\n toArray, // [11, 12, 13]\r\n);\n"})}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://codesandbox.io/s/fxts-toasync-00nxr",children:"Try It"})}),"\n",(0,s.jsxs)(n.p,{children:["see ",(0,s.jsx)(n.a,{href:"https://fxts.dev/docs/pipe",children:"pipe"}),", ",(0,s.jsx)(n.a,{href:"https://fxts.dev/docs/toAsync",children:"toAsync"}),", ",(0,s.jsx)(n.a,{href:"https://fxts.dev/docs/toArray",children:"toArray"})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/Lazy/toAsync.ts",children:"Open Source Code"})})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>i});var s=t(6540);const r={},c=s.createContext(r);function o(e){const n=s.useContext(c);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function i(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:o(e.components),s.createElement(c.Provider,{value:n},e.children)}}}]);