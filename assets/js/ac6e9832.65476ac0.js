"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6752],{5128:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>a,default:()=>u,frontMatter:()=>s,metadata:()=>c,toc:()=>l});var r=t(4848),o=t(8453);const s={id:"sort"},a=void 0,c={id:"sort",title:"sort",description:"sort() function",source:"@site/docs/sort.md",sourceDirName:".",slug:"/sort",permalink:"/docs/sort",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"sort"},sidebar:"api",previous:{title:"some",permalink:"/docs/some"},next:{title:"sortBy",permalink:"/docs/sortBy"}},i={},l=[{value:"sort() function",id:"sort-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"sort-function",children:"sort() function"}),"\n",(0,r.jsxs)(n.p,{children:["Returns an array, sorted according to the comparator ",(0,r.jsx)(n.code,{children:"f"}),", which should accept two values"]}),"\n",(0,r.jsx)("b",{children:"Signature:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"declare function sort<T>(f: (a: T, b: T) => unknown, iterable: Iterable<T>): T[];\n\ndeclare function sort(f: (a: any, b: any) => unknown, iterable: readonly []): any[];\n\ndeclare function sort<T>(f: (a: T, b: T) => unknown, iterable: AsyncIterable<T>): Promise<T[]>;\n\ndeclare function sort<T extends Iterable<unknown> | AsyncIterable<unknown>>(f: (a: IterableInfer<T>, b: IterableInfer<T>) => unknown): (iterable: T) => ReturnValueType<T, IterableInfer<T>[]>;\n"})}),"\n",(0,r.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:'sort((a, b) => a > b, [3, 4, 1, 2, 5, 2]); // [1, 2, 2, 3, 4, 5]\r\nsort((a, b) => a.localeCompare(b), "bcdaef"); // ["a", "b", "c", "d", "e", "f"]\n'})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/sort.ts",children:"Open Source Code"})})]})}function u(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>a,x:()=>c});var r=t(6540);const o={},s=r.createContext(o);function a(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);