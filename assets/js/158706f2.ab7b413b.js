"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2392],{5632:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>s,default:()=>d,frontMatter:()=>c,metadata:()=>a,toc:()=>u});var r=t(4848),o=t(8453);const c={id:"countBy"},s=void 0,a={id:"countBy",title:"countBy",description:"countBy() function",source:"@site/docs/countBy.md",sourceDirName:".",slug:"/countBy",permalink:"/docs/countBy",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"countBy"},sidebar:"api",previous:{title:"consume",permalink:"/docs/consume"},next:{title:"curry",permalink:"/docs/curry"}},i={},u=[{value:"countBy() function",id:"countby-function",level:2},{value:"Example",id:"example",level:2}];function l(e){const n={a:"a",code:"code",h2:"h2",p:"p",pre:"pre",...(0,o.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h2,{id:"countby-function",children:"countBy() function"}),"\n",(0,r.jsx)(n.p,{children:"Returns a count for the number of objects in each group. Similar to groupBy, but instead of returning a list of values, it returns a count for the number of values in that group."}),"\n",(0,r.jsx)("b",{children:"Signature:"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-typescript",children:"declare function countBy<A, B extends Key>(f: (a: A) => B, iterable: Iterable<A>): {\n    [K in B]: number;\n};\n\ndeclare function countBy<A, B extends Key>(f: (a: A) => B | Promise<B>, iterable: AsyncIterable<A>): Promise<{\n    [K in B]: number;\n}>;\n\ndeclare function countBy<A extends Iterable<unknown> | AsyncIterable<unknown>, B extends Key>(f: (a: IterableInfer<A>) => B | Promise<B>): (iterable: A) => ReturnValueType<A, {\n    [K in B]: number;\n}>;\n"})}),"\n",(0,r.jsx)(n.h2,{id:"example",children:"Example"}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-ts",children:'const given = [\r\n  { category: "clothes", desc: "good" },\r\n  { category: "pants", desc: "bad" },\r\n  { category: "shoes", desc: "not bad" },\r\n  { category: "shoes", desc: "great" },\r\n  { category: "pants", desc: "good" },\r\n];\r\n\r\ncountBy((a) => a.category, given);\r\n//{\r\n//  clothes: 1,\r\n//  pants: 2,\r\n//  shoes: 2,\r\n// };\n'})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://codesandbox.io/s/fxts-countby-09t7z",children:"Try It"})}),"\n",(0,r.jsx)(n.p,{children:(0,r.jsx)(n.a,{href:"https://github.com/marpple/FxTS/blob/main/src/countBy.ts",children:"Open Source Code"})})]})}function d(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>s,x:()=>a});var r=t(6540);const o={},c=r.createContext(o);function s(e){const n=r.useContext(c);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),r.createElement(c.Provider,{value:n},e.children)}}}]);