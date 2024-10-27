"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3464],{723:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>c,contentTitle:()=>s,default:()=>p,frontMatter:()=>o,metadata:()=>a,toc:()=>l});var t=r(4848),i=r(8453);const o={id:"join"},s=void 0,a={id:"join",title:"join",description:"join() function",source:"@site/docs/join.md",sourceDirName:".",slug:"/join",permalink:"/docs/join",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"join"},sidebar:"api",previous:{title:"isUndefined",permalink:"/docs/isUndefined"},next:{title:"juxt",permalink:"/docs/juxt"}},c={},l=[{value:"join() function",id:"join-function",level:2},{value:"Example",id:"example",level:2}];function d(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,i.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h2,{id:"join-function",children:"join() function"}),"\n",(0,t.jsx)(n.p,{children:"Returns all elements in the given iterable into a string separated by separator."}),"\n",(0,t.jsx)("b",{children:"Signature:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:'declare function join<A>(sep: string, iterable: Iterable<A>): string;\n\ndeclare function join<A extends readonly []>(sep: string, iterable: A): "";\n\ndeclare function join<A>(sep: string, iterable: AsyncIterable<A>): Promise<string>;\n\ndeclare function join<A extends Iterable<unknown> | AsyncIterable<unknown>>(sep: string): (iterable: A) => ReturnJoinType<A>;\n'})}),"\n",(0,t.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-ts",children:"const joined = join('~', ['a', 'b', 'c']); // 'a~b~c'\r\n\r\n// with pipe\r\npipe(\r\n [1, 2, 3, 4],\r\n map(a => a + 10),\r\n filter(a => a % 2 === 0)\r\n join('-'),\r\n); // '12-14'\r\n\r\nawait pipe(\r\n Promise.resolve([1, 2, 3, 4]),\r\n join('-'),\r\n); // '1-2-3-4'\r\n\r\n// with toAsync\r\nawait pipe(\r\n [Promise.resolve(1), Promise.resolve(2), Promise.resolve(3), Promise.resolve(4)],\r\n toAsync,\r\n join('-'),\r\n); // '1-2-3-4'\n"})}),"\n",(0,t.jsx)(n.p,{children:(0,t.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/join.ts",children:"Open Source Code"})})]})}function p(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>a});var t=r(6540);const i={},o=t.createContext(i);function s(e){const n=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:s(e.components),t.createElement(o.Provider,{value:n},e.children)}}}]);