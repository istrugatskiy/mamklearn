(self.webpackChunkmamklearn=self.webpackChunkmamklearn||[]).push([[137],{584:e=>{e.exports=function(e,t){return Array.prototype.slice.call(e,t)}},514:(e,t,n)=>{"use strict";var r=n(115);e.exports=function(e,t,n){e&&r((function(){e.apply(n||null,t||[])}))}},229:(e,t,n)=>{"use strict";var r=n(584),o=n(514);e.exports=function(e,t){var n=t||{},i={};return void 0===e&&(e={}),e.on=function(t,n){return i[t]?i[t].push(n):i[t]=[n],e},e.once=function(t,n){return n._once=!0,e.on(t,n),e},e.off=function(t,n){var r=arguments.length;if(1===r)delete i[t];else if(0===r)i={};else{var o=i[t];if(!o)return e;o.splice(o.indexOf(n),1)}return e},e.emit=function(){var t=r(arguments);return e.emitterSnapshot(t.shift()).apply(this,t)},e.emitterSnapshot=function(t){var u=(i[t]||[]).slice(0);return function(){var i=r(arguments),c=this||e;if("error"===t&&!1!==n.throws&&!u.length)throw 1===i.length?i[0]:i;return u.forEach((function(r){n.async?o(r,i,c):r.apply(c,i),r._once&&e.off(t,r)})),e}},e}},808:(e,t,n)=>{"use strict";var r=n(638),o=n(874),i=n.g.document,u=function(e,t,n,r){return e.addEventListener(t,n,r)},c=function(e,t,n,r){return e.removeEventListener(t,n,r)},a=[];function l(e,t,n){var r=function(e,t,n){var r,o;for(r=0;r<a.length;r++)if((o=a[r]).element===e&&o.type===t&&o.fn===n)return r}(e,t,n);if(r){var o=a[r].wrapper;return a.splice(r,1),o}}n.g.addEventListener||(u=function(e,t,r){return e.attachEvent("on"+t,function(e,t,r){var o=l(e,t,r)||function(e,t,r){return function(t){var o=t||n.g.event;o.target=o.target||o.srcElement,o.preventDefault=o.preventDefault||function(){o.returnValue=!1},o.stopPropagation=o.stopPropagation||function(){o.cancelBubble=!0},o.which=o.which||o.keyCode,r.call(e,o)}}(e,0,r);return a.push({wrapper:o,element:e,type:t,fn:r}),o}(e,t,r))},c=function(e,t,n){var r=l(e,t,n);if(r)return e.detachEvent("on"+t,r)}),e.exports={add:u,remove:c,fabricate:function(e,t,n){var u=-1===o.indexOf(t)?new r(t,{detail:n}):function(){var e;return i.createEvent?(e=i.createEvent("Event")).initEvent(t,!0,!0):i.createEventObject&&(e=i.createEventObject()),e}();e.dispatchEvent?e.dispatchEvent(u):e.fireEvent("on"+t,u)}}},874:(e,t,n)=>{"use strict";var r=[],o="",i=/^on/;for(o in n.g)i.test(o)&&r.push(o.slice(2));e.exports=r},638:(e,t,n)=>{var r=n.g.CustomEvent;e.exports=function(){try{var e=new r("cat",{detail:{foo:"bar"}});return"cat"===e.type&&"bar"===e.detail.foo}catch(e){}return!1}()?r:"undefined"!=typeof document&&"function"==typeof document.createEvent?function(e,t){var n=document.createEvent("CustomEvent");return t?n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail):n.initCustomEvent(e,!1,!1,void 0),n}:function(e,t){var n=document.createEventObject();return n.type=e,t?(n.bubbles=Boolean(t.bubbles),n.cancelable=Boolean(t.cancelable),n.detail=t.detail):(n.bubbles=!1,n.cancelable=!1,n.detail=void 0),n}},425:e=>{"use strict";var t={};function n(e){var n=t[e];return n?n.lastIndex=0:t[e]=n=new RegExp("(?:^|\\s)"+e+"(?:\\s|$)","g"),n}e.exports={add:function(e,t){var r=e.className;r.length?n(t).test(r)||(e.className+=" "+t):e.className=t},rm:function(e,t){e.className=e.className.replace(n(t)," ").trim()}}},137:(e,t,n)=>{"use strict";var r=n(229),o=n(808),i=n(425),u=document,c=u.documentElement;function a(e,t,r,i){n.g.navigator.pointerEnabled?o[t](e,{mouseup:"pointerup",mousedown:"pointerdown",mousemove:"pointermove"}[r],i):n.g.navigator.msPointerEnabled?o[t](e,{mouseup:"MSPointerUp",mousedown:"MSPointerDown",mousemove:"MSPointerMove"}[r],i):(o[t](e,{mouseup:"touchend",mousedown:"touchstart",mousemove:"touchmove"}[r],i),o[t](e,r,i))}function l(e){if(void 0!==e.touches)return e.touches.length;if(void 0!==e.which&&0!==e.which)return e.which;if(void 0!==e.buttons)return e.buttons;var t=e.button;return void 0!==t?1&t?1:2&t?3:4&t?2:0:void 0}function f(e){var t=e.getBoundingClientRect();return{left:t.left+v("scrollLeft","pageXOffset"),top:t.top+v("scrollTop","pageYOffset")}}function v(e,t){return void 0!==n.g[t]?n.g[t]:c.clientHeight?c[e]:u.body[e]}function s(e,t,n){var r,o=(e=e||{}).className||"";return e.className+=" gu-hide",r=u.elementFromPoint(t,n),e.className=o,r}function d(){return!1}function m(){return!0}function p(e){return e.width||e.right-e.left}function g(e){return e.height||e.bottom-e.top}function h(e){return e.parentNode===u?null:e.parentNode}function b(e){return"INPUT"===e.tagName||"TEXTAREA"===e.tagName||"SELECT"===e.tagName||y(e)}function y(e){return!!e&&"false"!==e.contentEditable&&("true"===e.contentEditable||y(h(e)))}function E(e){return e.nextElementSibling||function(){var t=e;do{t=t.nextSibling}while(t&&1!==t.nodeType);return t}()}function S(e,t){var n=function(e){return e.targetTouches&&e.targetTouches.length?e.targetTouches[0]:e.changedTouches&&e.changedTouches.length?e.changedTouches[0]:e}(t),r={pageX:"clientX",pageY:"clientY"};return e in r&&!(e in n)&&r[e]in n&&(e=r[e]),n[e]}e.exports=function(e,t){var n,v,y,C,w,x,T,N,O,X,Y,B=arguments.length;1===B&&!1===Array.isArray(e)&&(t=e,e=[]);var P,k=null,I=t||{};void 0===I.moves&&(I.moves=m),void 0===I.accepts&&(I.accepts=m),void 0===I.invalid&&(I.invalid=$),void 0===I.containers&&(I.containers=e||[]),void 0===I.isContainer&&(I.isContainer=d),void 0===I.copy&&(I.copy=!1),void 0===I.copySortSource&&(I.copySortSource=!1),void 0===I.revertOnSpill&&(I.revertOnSpill=!1),void 0===I.removeOnSpill&&(I.removeOnSpill=!1),void 0===I.direction&&(I.direction="vertical"),void 0===I.ignoreInputTextSelection&&(I.ignoreInputTextSelection=!0),void 0===I.mirrorContainer&&(I.mirrorContainer=u.body);var M=r({containers:I.containers,start:H,end:q,cancel:Z,remove:W,destroy:F,canMove:z,dragging:!1});return!0===I.removeOnSpill&&M.on("over",oe).on("out",ie),R(),M;function D(e){return-1!==M.containers.indexOf(e)||I.isContainer(e)}function R(e){var t=e?"remove":"add";a(c,t,"mousedown",K),a(c,t,"mouseup",J)}function A(e){a(c,e?"remove":"add","mousemove",U)}function L(e){var t=e?"remove":"add";o[t](c,"selectstart",j),o[t](c,"click",j)}function F(){R(!0),J({})}function j(e){P&&e.preventDefault()}function K(e){if(x=e.clientX,T=e.clientY,1===l(e)&&!e.metaKey&&!e.ctrlKey){var t=e.target,n=_(t);n&&(P=n,A(),"mousedown"===e.type&&(b(t)?t.focus():e.preventDefault()))}}function U(e){if(P)if(0!==l(e)){if(!(void 0!==e.clientX&&Math.abs(e.clientX-x)<=(I.slideFactorX||0)&&void 0!==e.clientY&&Math.abs(e.clientY-T)<=(I.slideFactorY||0))){if(I.ignoreInputTextSelection){var t=S("clientX",e)||0,n=S("clientY",e)||0;if(b(u.elementFromPoint(t,n)))return}var r=P;A(!0),L(),q(),V(r);var o=f(y);C=S("pageX",e)-o.left,w=S("pageY",e)-o.top,i.add(X||y,"gu-transit"),ue(),re(e)}}else J({})}function _(e){if(!(M.dragging&&n||D(e))){for(var t=e;h(e)&&!1===D(h(e));){if(I.invalid(e,t))return;if(!(e=h(e)))return}var r=h(e);if(r&&!I.invalid(e,t)&&I.moves(e,r,t,E(e)))return{item:e,source:r}}}function z(e){return!!_(e)}function H(e){var t=_(e);t&&V(t)}function V(e){fe(e.item,e.source)&&(X=e.item.cloneNode(!0),M.emit("cloned",X,e.item,"copy")),v=e.source,y=e.item,N=O=E(e.item),M.dragging=!0,M.emit("drag",y,v)}function $(){return!1}function q(){if(M.dragging){var e=X||y;Q(e,h(e))}}function G(){P=!1,A(!0),L(!0)}function J(e){if(G(),M.dragging){var t=X||y,r=S("clientX",e)||0,o=S("clientY",e)||0,i=ne(s(n,r,o),r,o);i&&(X&&I.copySortSource||!X||i!==v)?Q(t,i):I.removeOnSpill?W():Z()}}function Q(e,t){var n=h(e);X&&I.copySortSource&&t===v&&n.removeChild(y),te(t)?M.emit("cancel",e,v,v):M.emit("drop",e,t,v,O),ee()}function W(){if(M.dragging){var e=X||y,t=h(e);t&&t.removeChild(e),M.emit(X?"cancel":"remove",e,t,v),ee()}}function Z(e){if(M.dragging){var t=arguments.length>0?e:I.revertOnSpill,n=X||y,r=h(n),o=te(r);!1===o&&t&&(X?r&&r.removeChild(X):v.insertBefore(n,N)),o||t?M.emit("cancel",n,v,v):M.emit("drop",n,r,v,O),ee()}}function ee(){var e=X||y;G(),ce(),e&&i.rm(e,"gu-transit"),Y&&clearTimeout(Y),M.dragging=!1,k&&M.emit("out",e,k,v),M.emit("dragend",e),v=y=X=N=O=Y=k=null}function te(e,t){var r;return r=void 0!==t?t:n?O:E(X||y),e===v&&r===N}function ne(e,t,n){for(var r=e;r&&!o();)r=h(r);return r;function o(){if(!1===D(r))return!1;var o=ae(r,e),i=le(r,o,t,n);return!!te(r,i)||I.accepts(y,r,v,i)}}function re(e){if(n){e.preventDefault();var t=S("clientX",e)||0,r=S("clientY",e)||0,o=t-C,i=r-w;n.style.left=o+"px",n.style.top=i+"px";var u=X||y,c=s(n,t,r),a=ne(c,t,r),l=null!==a&&a!==k;(l||null===a)&&(k&&p("out"),k=a,l&&p("over"));var f=h(u);if(a!==v||!X||I.copySortSource){var d,m=ae(a,c);if(null!==m)d=le(a,m,t,r);else{if(!0!==I.revertOnSpill||X)return void(X&&f&&f.removeChild(u));d=N,a=v}(null===d&&l||d!==u&&d!==E(u))&&(O=d,a.insertBefore(u,d),M.emit("shadow",u,a,v))}else f&&f.removeChild(u)}function p(e){M.emit(e,u,k,v)}}function oe(e){i.rm(e,"gu-hide")}function ie(e){M.dragging&&i.add(e,"gu-hide")}function ue(){if(!n){var e=y.getBoundingClientRect();(n=y.cloneNode(!0)).style.width=p(e)+"px",n.style.height=g(e)+"px",i.rm(n,"gu-transit"),i.add(n,"gu-mirror"),I.mirrorContainer.appendChild(n),a(c,"add","mousemove",re),i.add(I.mirrorContainer,"gu-unselectable"),M.emit("cloned",n,y,"mirror")}}function ce(){n&&(i.rm(I.mirrorContainer,"gu-unselectable"),a(c,"remove","mousemove",re),h(n).removeChild(n),n=null)}function ae(e,t){for(var n=t;n!==e&&h(n)!==e;)n=h(n);return n===c?null:n}function le(e,t,n,r){var o,i="horizontal"===I.direction;return t!==e?(o=t.getBoundingClientRect(),u(i?n>o.left+p(o)/2:r>o.top+g(o)/2)):function(){var t,o,u,c=e.children.length;for(t=0;t<c;t++){if(u=(o=e.children[t]).getBoundingClientRect(),i&&u.left+u.width/2>n)return o;if(!i&&u.top+u.height/2>r)return o}return null}();function u(e){return e?E(t):t}}function fe(e,t){return"boolean"==typeof I.copy?I.copy:I.copy(e,t)}}},115:e=>{var t;t="function"==typeof setImmediate?function(e){setImmediate(e)}:function(e){setTimeout(e,0)},e.exports=t}}]);
//# sourceMappingURL=137.chonk.js.map