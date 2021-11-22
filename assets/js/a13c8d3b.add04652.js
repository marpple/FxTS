"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9300],{3905:function(e,t,n){n.d(t,{Zo:function(){return s},kt:function(){return d}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var c=r.createContext({}),f=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},s=function(e){var t=f(e.components);return r.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),p=f(n),d=o,y=p["".concat(c,".").concat(d)]||p[d]||u[d]||a;return n?r.createElement(y,l(l({ref:t},s),{},{components:n})):r.createElement(y,l({ref:t},s))}));function d(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,l=new Array(a);l[0]=p;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:o,l[1]=i;for(var f=2;f<a;f++)l[f]=n[f];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},4782:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return i},contentTitle:function(){return c},metadata:function(){return f},toc:function(){return s},default:function(){return p}});var r=n(7462),o=n(3366),a=(n(7294),n(3905)),l=["components"],i={id:"filter"},c=void 0,f={unversionedId:"filter",id:"filter",isDocsHomePage:!1,title:"filter",description:"filter() function",source:"@site/docs/filter.md",sourceDirName:".",slug:"/filter",permalink:"/docs/filter",tags:[],version:"current",frontMatter:{id:"filter"},sidebar:"docs",previous:{title:"drop",permalink:"/docs/drop"},next:{title:"flat",permalink:"/docs/flat"}},s=[{value:"filter() function",id:"filter-function",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],u={toc:s};function p(e){var t=e.components,n=(0,o.Z)(e,l);return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"filter-function"},"filter() function"),(0,a.kt)("p",null,"Return Iterable/AsyncIterable of all elements ",(0,a.kt)("inlineCode",{parentName:"p"},"f")," returns truthy for"),(0,a.kt)("b",null,"Signature:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-typescript"},"declare function filter<A, B = unknown>(f: (a: A) => B, iterable: Iterable<A>): IterableIterator<A>;\n\ndeclare function filter<A>(f: BooleanConstructor, iterable: Iterable<A>): IterableIterator<TruthyTypesOf<A>>;\n\ndeclare function filter<A, B = unknown>(f: (a: A) => B, iterable: AsyncIterable<A>): AsyncIterableIterator<A>;\n\ndeclare function filter<A>(f: BooleanConstructor, iterable: AsyncIterable<A>): AsyncIterableIterator<TruthyTypesOf<A>>;\n\ndeclare function filter<A extends Iterable<unknown> | AsyncIterable<unknown>>(f: BooleanConstructor): (iterable: A) => ReturnIterableIteratorType<A, TruthyTypesOf<IterableInfer<A>>>;\n\ndeclare function filter<A extends Iterable<unknown> | AsyncIterable<unknown>, B = unknown>(f: (a: IterableInfer<A>) => B): (iterable: A) => ReturnIterableIteratorType<A, IterableInfer<A>>;\n")),(0,a.kt)("h2",{id:"example"},"Example"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts"},"const iter = filter((a)=> a % 2 === 0, [0, 1, 2, 3, 4, 5, 6]);\niter.next() // {done:false, value: 0}\niter.next() // {done:false, value: 2}\niter.next() // {done:false, value: 4}\niter.next() // {done:false, value: 6}\niter.next() // {done:true, value: undefined}\n\n// with pipe\npipe(\n [0, 1, 2, 3, 4, 5, 6],\n filter(a => a % 2 === 0),\n toArray,\n); // [0, 2, 4, 6]\n\nawait pipe(\n Promise.resolve([0, 1, 2, 3, 4, 5, 6]),\n filter(a => a % 2 === 0),\n toArray,\n); // [0, 2, 4, 6]\n\n// if you want to use asynchronous callback\nawait pipe(\n Promise.resolve([0, 1, 2, 3, 4, 5, 6]),\n toAsync,\n filter(async a => a % 2 === 0),\n toArray,\n); // [0, 2, 4, 6]\n\n// toAsync\nawait pipe(\n [Promise.resolve(0), Promise.resolve(1), Promise.resolve(2), Promise.resolve(3),\n  Promise.resolve(4), Promise.resolve(5), Promise.resolve(6)],\n toAsync,\n filter(a => a % 2 === 0),\n toArray,\n); // [0, 2, 4, 6]\n")),(0,a.kt)("p",null,(0,a.kt)("a",{parentName:"p",href:"https://codesandbox.io/s/fxts-filter-2ibz2"},"Try It")),(0,a.kt)("p",null,"see ",(0,a.kt)("a",{parentName:"p",href:"https://fxts.dev/docs/pipe"},"pipe"),", ",(0,a.kt)("a",{parentName:"p",href:"https://fxts.dev/docs/toAsync"},"toAsync"),", ",(0,a.kt)("a",{parentName:"p",href:"https://fxts.dev/docs/toArray"},"toArray")))}p.isMDXComponent=!0}}]);