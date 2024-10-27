"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9664],{3343:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>a,contentTitle:()=>r,default:()=>p,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var t=i(4848),o=i(8453);const s={id:"function-composition"},r="Function Composition",c={id:"function-composition",title:"Function Composition",description:"We are going to introduce pipe.",source:"@site/docs/function-composition.md",sourceDirName:".",slug:"/function-composition",permalink:"/docs/function-composition",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{id:"function-composition"},sidebar:"docs",previous:{title:"Getting Started",permalink:"/docs/getting-started"},next:{title:"Lazy Evaluation",permalink:"/docs/lazy-evaluation"}},a={},d=[];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",li:"li",p:"p",pre:"pre",ul:"ul",...(0,o.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"function-composition",children:"Function Composition"}),"\n",(0,t.jsxs)(n.p,{children:["We are going to introduce ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/pipe",children:"pipe"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["A function named ",(0,t.jsx)(n.code,{children:"pipe"})," is already provided by several libraries, so you may be familiar with it."]}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["flow in ",(0,t.jsx)(n.a,{href:"https://lodash.com/",children:"lodash"})]}),"\n",(0,t.jsxs)(n.li,{children:["pipe in ",(0,t.jsx)(n.a,{href:"https://ramdajs.com/",children:"ramda"})]}),"\n",(0,t.jsxs)(n.li,{children:["pipe in ",(0,t.jsx)(n.a,{href:"https://rxjs.dev/",children:"rxjs"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.code,{children:"pipe"})," is a function that connects functions by passing the output of a function to the arguments of another function."]}),"\n",(0,t.jsxs)(n.p,{children:["Let's take a moment to see why we need ",(0,t.jsx)(n.code,{children:"pipe"}),"."]}),"\n",(0,t.jsxs)(n.p,{children:["There is an array, and you want to get the final result by doing ",(0,t.jsx)(n.code,{children:"filter"})," -> ",(0,t.jsx)(n.code,{children:"map"})," -> ",(0,t.jsx)(n.code,{children:"reduce"})," on this array."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"const sum = (a: number, b: number) => a + b;\nconst arr = [1, 2, 3, 4, 5];\n// filter\n// map\n// reduce\n"})}),"\n",(0,t.jsx)(n.p,{children:"All of the code is pure functions, so it's easy to create a function composition, but it seems to be very difficult to read."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"reduce(\n  sum,\n  map(\n    (a) => a + 10,\n    filter((a) => a % 2 === 0, arr);\n  ),\n)\n"})}),"\n",(0,t.jsxs)(n.p,{children:["We are providing ",(0,t.jsx)(n.code,{children:"pipe"})," to solve the above problem."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:'import { filter, map, pipe, reduce } from "@fxts/core";\n\npipe(\n  arr,\n  filter((a) => a % 2 === 0),\n  map((a) => a + 10),\n  reduce(sum),\n);\n'})}),"\n",(0,t.jsxs)(n.p,{children:["It looks easy to read when used with ",(0,t.jsx)(n.code,{children:"pipe"}),"."]}),"\n",(0,t.jsxs)(n.blockquote,{children:["\n",(0,t.jsxs)(n.p,{children:["Check out ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/lazy-evaluation",children:"this article"})," for a comparison with ",(0,t.jsx)(n.code,{children:"Array.prototype.[Function]"})]}),"\n"]}),"\n",(0,t.jsx)("br",{}),"\n",(0,t.jsxs)(n.p,{children:["Also, you don't have to deal with ",(0,t.jsx)(n.code,{children:"Promise"})," values directly."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"await pipe(\n  Promise.resolve(1),\n  (a /*: Awaited<number>*/) => a + 1,\n  async (b /*: Awaited<number>*/) => b + 1,\n  (c /*: Awaited<number>*/) => c + 1,\n); // 4\n"})}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsxs)(n.li,{children:["a : ",(0,t.jsx)(n.code,{children:"a"})," is inferred as number, and the actual value is also number, not ",(0,t.jsx)(n.code,{children:"Promise<number>"}),"."]}),"\n",(0,t.jsxs)(n.li,{children:["c : Even if the previous function is an asynchronous function, the argument is not c ",(0,t.jsx)(n.code,{children:"Promise<number>"}),"."]}),"\n"]}),"\n",(0,t.jsxs)(n.p,{children:["If you're not dealing with async values directly, it doesn't mean that errors can not be handled when occur.\nTo check for error handling, see the ",(0,t.jsx)(n.a,{href:"https://fxts.dev/docs/error-handling",children:"Error Handling"})]})]})}function p(e={}){const{wrapper:n}={...(0,o.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(l,{...e})}):l(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>r,x:()=>c});var t=i(6540);const o={},s=t.createContext(o);function r(e){const n=t.useContext(s);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),t.createElement(s.Provider,{value:n},e.children)}}}]);