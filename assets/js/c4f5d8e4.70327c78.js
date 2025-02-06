"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[2634],{8655:(e,s,t)=>{t.r(s),t.d(s,{default:()=>v});var i=t(8774),n=t(4586),l=t(4561);function a(e){var s,t,i="";if("string"==typeof e||"number"==typeof e)i+=e;else if("object"==typeof e)if(Array.isArray(e))for(s=0;s<e.length;s++)e[s]&&(t=a(e[s]))&&(i&&(i+=" "),i+=t);else for(s in e)e[s]&&(i&&(i+=" "),i+=s);return i}const o=function(){for(var e,s,t=0,i="";t<arguments.length;)(e=arguments[t++])&&(s=a(e))&&(i&&(i+=" "),i+=s);return i};var c=t(6540),r=t(6025),d=t(4696);const h={features:"features_xdhU",featureSvg:"featureSvg__8YW",titleSection:"titleSection_k2Fh",title:"title_sO48",subtitle:"subtitle_zs9b"};var u=t(4848);const m=()=>(0,u.jsx)("div",{className:"container",children:(0,u.jsxs)("div",{className:o("row",h.titleSection),children:[(0,u.jsx)("div",{className:"col col--4",children:(0,u.jsxs)("div",{className:"container",children:[(0,u.jsx)("h1",{className:o("hero__title",h.title),children:"Lazy evaluation"}),(0,u.jsx)("p",{className:o("hero__subtitle",h.subtitle),children:'Lazy evaluation is possible, It will consume "Iterable/asyncIterable" when it needs to be evaluated. so efficient calculation is attainable in declaratively written code.'})]})}),(0,u.jsxs)("div",{className:"col col--6 col--offset-2",children:[(0,u.jsx)(d.A,{className:"language-ts",children:"pipe(\n  [1, 2, 3, 4, 5],\n  map(a => a + 10),\n  filter(a => a % 2 === 0),\n  take(2),\n  toArray\n); // [12, 14]"}),(0,u.jsx)("h2",{children:"Evaluation Order"}),(0,u.jsx)("img",{src:(0,r.A)("/img/lazy.gif")})]})]})}),x=()=>(0,u.jsx)("div",{className:"container",children:(0,u.jsxs)("div",{className:o("row",h.titleSection),children:[(0,u.jsx)("div",{className:"col col--4",children:(0,u.jsxs)("div",{className:"container",children:[(0,u.jsx)("h1",{className:o("hero__title",h.title),children:"Type Inference"}),(0,u.jsx)("p",{className:o("hero__subtitle",h.subtitle),children:"Easily infer composed functions, FxTS makes it simple for you to build complex logic through functional composition."})]})}),(0,u.jsx)("div",{className:"col col--6 col--offset-2",children:(0,u.jsx)("img",{width:"100%",src:(0,r.A)("/img/typeinfer.png")})})]})}),f=()=>(0,u.jsx)("div",{className:"container",children:(0,u.jsxs)("div",{className:o("row",h.titleSection),children:[(0,u.jsx)("div",{className:"col col--8",children:(0,u.jsx)("iframe",{src:"https://codesandbox.io/embed/fxts-concurrent-4x58c?fontsize=14&hidenavigation=1&expanddevtools=1",style:{width:"100%",height:500,border:0,borderRadius:4,overflow:"hidden"},title:"serene-booth-be4ic",allow:"accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking",sandbox:"allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"})}),(0,u.jsx)("div",{className:"col col--4",children:(0,u.jsxs)("div",{className:"container",children:[(0,u.jsx)("h1",{className:o("hero__title",h.title),children:"Concurrent"}),(0,u.jsx)("p",{className:o("hero__subtitle",h.subtitle),children:"Simultaneous requests are possible, and concurrent situations can be created."})]})})]})});function b(){return(0,u.jsxs)("section",{className:h.features,children:[(0,u.jsx)(m,{}),(0,u.jsx)(f,{}),(0,u.jsx)(x,{})]})}const j={heroBanner:"heroBanner_qdFl",buttons:"buttons_AeoN",button:"button_JGCe"};function p(){const{siteConfig:e}=(0,n.A)();return c.useEffect((()=>{console.log("%cHello FxTS!\n%cExperience the FxTS functions through `window._` in this console.","color: #8f52fa; font-weight: bold; font-size: 36px;","color: gray; font-size: 16px;")}),[]),(0,u.jsx)("header",{className:o("hero hero--primary",j.heroBanner),children:(0,u.jsxs)("div",{className:"container",children:[(0,u.jsx)("h1",{className:"hero__title",children:e.title}),(0,u.jsx)("p",{className:"hero__subtitle",children:e.tagline}),(0,u.jsxs)("div",{className:j.buttons,children:[(0,u.jsx)("div",{className:j.button,children:(0,u.jsx)(i.A,{className:"button button--secondary button--lg",to:"/docs/getting-started",children:"GETTING STARTED"})}),(0,u.jsx)("div",{className:j.button,children:(0,u.jsx)(i.A,{className:"button button--secondary button--lg",to:"/docs",children:"API DOCS"})})]})]})})}function v(){return(0,u.jsxs)(l.A,{children:[(0,u.jsx)(p,{}),(0,u.jsx)("main",{children:(0,u.jsx)(b,{})})]})}}}]);