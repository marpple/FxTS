"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3205],{1740:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>u,frontMatter:()=>c,metadata:()=>s,toc:()=>l});var r=t(4848),i=t(8453);const c={id:"intersectionBy"},o=void 0,s={id:"intersectionBy",title:"intersectionBy",description:"intersectionBy() function",source:"@site/docs/intersectionBy.md",sourceDirName:".",slug:"/intersectionBy",permalink:"/docs/intersectionBy",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"intersectionBy"},sidebar:"api",previous:{title:"intersection",permalink:"/docs/intersection"},next:{title:"keys",permalink:"/docs/keys"}},a={},l=[{value:"intersectionBy() function",id:"intersectionby-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"intersectionby-function",children:"intersectionBy() function"}),"\n",(0,r.jsxs)(n.p,{children:["Returns Iterable/AsyncIterable(i.e no duplicate) of all elements in the ",(0,r.jsx)(n.code,{children:"iterable2"})," contained in the ",(0,r.jsx)(n.code,{children:"iterable1"}),". Duplication is determined according to the value returned by applying the supplied ",(0,r.jsx)(n.code,{children:"f"})," to ",(0,r.jsx)(n.code,{children:"iterable2"}),"."]}),"\n",(0,r.jsx)("b",{children:"Signature:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"declare function intersectionBy<A, B = unknown>(f: (a: A) => B, iterable1: Iterable<A>, iterable2: Iterable<A>): IterableIterator<A>;\n\ndeclare function intersectionBy<A, B = unknown>(f: (a: A) => B, iterable1: AsyncIterable<A>, iterable2: Iterable<A>): AsyncIterableIterator<A>;\n\ndeclare function intersectionBy<A, B = unknown>(f: (a: A) => B, iterable1: Iterable<A>, iterable2: AsyncIterable<A>): AsyncIterableIterator<A>;\n\ndeclare function intersectionBy<A, B = unknown>(f: (a: A) => B, iterable1: AsyncIterable<A>, iterable2: AsyncIterable<A>): AsyncIterableIterator<A>;\n"})}),"\n",(0,r.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:"const iter = intersectionBy(a => a.x, [{ x: 1 }, { x: 4 }], [{ x: 1 },  { x: 2 },  { x: 3 }])\r\niter.next(); // {value: {x: 1, done: false}\r\niter.next(); // {value: undefined, done: true}\n"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/Lazy/intersectionBy.ts",children:"Open Source Code"})})]})}function u(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>s});var r=t(6540);const i={},c=r.createContext(i);function o(e){const n=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),r.createElement(c.Provider,{value:n},e.children)}}}]);