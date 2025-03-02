"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9744],{6713:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>i,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var t=r(4848),c=r(8453);const o={id:"concurrent"},s=void 0,a={id:"concurrent",title:"concurrent",description:"concurrent() function",source:"@site/docs/concurrent.md",sourceDirName:".",slug:"/concurrent",permalink:"/docs/concurrent",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"concurrent"},sidebar:"api",previous:{title:"concat",permalink:"/docs/concat"},next:{title:"concurrentPool",permalink:"/docs/concurrentPool"}},i={},l=[{value:"concurrent() function",id:"concurrent-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,c.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"concurrent-function",children:"concurrent() function"}),"\n",(0,t.jsxs)(n.p,{children:["Concurrent is used to balance the load of multiple asynchronous requests. The first argument receives a number that controls the number of loads, and the second argument is an AsyncIterable. See ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/toAsync",children:"toAsync"})," to create an AsyncIterable ."]}),"\n",(0,t.jsx)("b",{children:"Signature:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"declare function concurrent<A>(length: number, iterable: AsyncIterable<A>): AsyncIterableIterator<A>;\n\ndeclare function concurrent<A>(length: number, iterable?: AsyncIterable<A>): (iterable: AsyncIterable<A>) => AsyncIterableIterator<A>;\n"})}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"await pipe(\r\n  [1, 2, 3, 4, 5, 6],\r\n  toAsync,\r\n  map((a) => delay(1000, a)),\r\n  concurrent(3),\r\n  each(console.log), // log 1, 2, 3, 4, 5, 6\r\n); // 2 seconds\r\n\r\n// evaluation\r\n//              \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510\r\n//              \u2502  1  \u2502\u2500\u2500\u2502  2  \u2502\u2500\u2500\u2502  3  \u2502\u2500\u2500\u2502  4  \u2502\u2500\u2500\u2502  5  \u2502\u2500\u2500\u2502  6  \u2502\r\n//              \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518\r\n//      map        \u2502        \u2502        \u2502        \u2502        \u2502        \u2502\r\n// concurrent(3)  (1)      (1)      (1)      (2)      (2)      (2)\r\n//                 \u2502        \u2502        \u2502        \u2502        \u2502        \u2502\r\n//                 \u25bc        \u25bc        \u25bc        \u25bc        \u25bc        \u25bc\r\n\r\nawait pipe(\r\n  [1, 2, 3, 4, 5, 6],\r\n  toAsync,\r\n  map((a) => delay(1000, a)),\r\n  each(console.log), // log 1, 2, 3, 4, 5, 6\r\n); // 6 seconds\r\n\r\n// evaluation\r\n//              \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510  \u250c\u2500\u2500\u2500\u2500\u2500\u2510\r\n//              \u2502  1  \u2502\u2500\u2500\u2502  2  \u2502\u2500\u2500\u2502  3  \u2502\u2500\u2500\u2502  4  \u2502\u2500\u2500\u2502  5  \u2502\u2500\u2500\u2502  6  \u2502\r\n//              \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518  \u2514\u2500\u2500\u252c\u2500\u2500\u2518\r\n//      map        \u2502        \u2502        \u2502        \u2502        \u2502        \u2502\r\n//                (1)      (2)      (3)      (4)      (5)      (6)\r\n//                 \u2502        \u2502        \u2502        \u2502        \u2502        \u2502\r\n//                 \u25bc        \u25bc        \u25bc        \u25bc        \u25bc        \u25bc\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://codesandbox.io/s/fxts-concurrent-4x58c",children:"Try It"})}),"\n",(0,t.jsxs)(n.p,{children:["see ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/pipe",children:"pipe"}),", ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/toAsync",children:"toAsync"}),", ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/toArray",children:"toArray"})," ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/each",children:"each"}),", ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/map",children:"map"})]}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/Lazy/concurrent.ts",children:"Open Source Code"})})]})}function u(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>a});var t=r(6540);const c={},o=t.createContext(c);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);