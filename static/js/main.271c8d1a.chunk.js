(this["webpackJsonpfields-simulation"]=this["webpackJsonpfields-simulation"]||[]).push([[0],{119:function(e,t,r){"use strict";r.r(t);var n=r(0),c=r(20),a=r.n(c),o=r(13),i=r(58),s=r(18),l=r(21),u=r(55),j=r(2),d=r(165),b=r(94),f=r.n(b),v=r(34),h=r(6),p=r(28),O=r(4),m=r(5),x=r(3),w=function(e){Object(O.a)(r,e);var t=Object(m.a)(r);function r(e,n,c,a,o,i,s,l){var u;return Object(x.a)(this,r),(u=t.call(this,e,n,c,a,o,i)).mass=s,u.charge=l,i.AddParticle(Object(p.a)(u)),u}return Object(h.a)(r,[{key:"CalculateGravField",value:function(e){var t=new j.Vector3;if(t.subVectors(e,this.position),0===t.length())return new j.Vector3;var r=t.clone();return r.multiplyScalar(-6674e-14*this.mass),r.divideScalar(Math.pow(t.length(),3)),r}},{key:"CalculateElecField",value:function(e){var t=new j.Vector3;if(t.subVectors(e,this.position),0===t.length())return new j.Vector3;var r=t.clone();return r.multiplyScalar(8988e6*this.charge),r.divideScalar(Math.pow(t.length(),3)),r}},{key:"GetInspectorInfo",value:function(){var e=this;return{vectors:{Position:this.position},scalars:{Mass:{get:function(){return e.mass},set:function(t){return e.mass=t}},Charge:{get:function(){return e.charge},set:function(t){return e.charge=t}}}}}}]),r}((function e(t,r,n,c,a,o){Object(x.a)(this,e),this.key=t,this.position=r,this.rotation=n,this.scale=c,this.onClick=a,this.scene=o,this.selected=!1})),g=function(){function e(t){Object(x.a)(this,e),this.particles=t}return Object(h.a)(e,[{key:"AddParticle",value:function(e){this.particles.push(e)}},{key:"RemoveParticle",value:function(e){var t=this.particles.findIndex((function(t){return t.key===e}));this.particles.splice(t,t+1)}},{key:"CalculateTotalGravField",value:function(e){var t,r=new j.Vector3,n=Object(v.a)(this.particles);try{for(n.s();!(t=n.n()).done;){var c=t.value;r.add(c.CalculateGravField(e))}}catch(a){n.e(a)}finally{n.f()}return r}},{key:"CalculateTotalElecField",value:function(e){var t,r=new j.Vector3,n=Object(v.a)(this.particles);try{for(n.s();!(t=n.n()).done;){var c=t.value;r.add(c.CalculateElecField(e))}}catch(a){n.e(a)}finally{n.f()}return r}}]),e}(),y=r(152),k=r(155),M=r(156),C=r(167),E=r(173),V=(r(86),r(11));function A(e){var t=Object(n.useState)("N"),r=Object(s.a)(t,2),c=r[0],a=r[1];return Object(V.jsx)(y.a,{position:"absolute",children:Object(V.jsxs)(k.a,{children:[Object(V.jsx)(M.a,{variant:"h5",style:{margin:"10px"},children:"Simulation"}),Object(V.jsxs)(C.a,{style:{padding:"6px",background:"royalblue",color:"white"},value:c,onChange:function(t){a(t.target.value),e.setFieldArrowMode(t.target.value)},children:[Object(V.jsx)(E.a,{value:"G",children:"Gravitational Field"}),Object(V.jsx)(E.a,{value:"E",children:"Electric Field"}),Object(V.jsx)(E.a,{value:"N",children:"No Field Arrows"})]})]})})}var F=r(160),P=r(161),z=r(169),R=r(170),S=r(166),I=r(162),G=r(163),X=r(164),L=r(159);function Y(e){var t=Object(n.useState)(e),r=Object(s.a)(t,2),c=r[0],a=r[1],o=Object(n.useRef)(c);return[o,function(e){o.current=e,a(e)}]}var N=Object(L.a)({title:{background:"dodgerblue",color:"white",padding:"10px"},removeBtn:{background:"red",color:"white","&:hover":{backgroundColor:"darkred"}}});function Z(e){return null!==e.match(/^-?[0-9]*\.?[0-9]*$/)}function K(e){var t=Y(!1),r=Object(s.a)(t,2),c=r[0],a=r[1];function o(){a(!c.current)}var i=N(),u=Object(n.useRef)(e.selection.GetInspectorInfo()),j=Object(n.useRef)({}),d=Object(n.useRef)({});function b(t){if("Enter"===t.code){var r=t.target.id.split(" ");switch(r[0]){case"v":if(Z(t.target.value)){var n=u.current.vectors[r[1]],c=j.current[r[1]];switch(r[2]){case"x":n.set(parseFloat(t.target.value),n.y,n.z),c[0]=Math.round(100*parseFloat(t.target.value))/100;break;case"y":n.set(n.x,parseFloat(t.target.value),n.z),c[1]=Math.round(100*parseFloat(t.target.value))/100;break;case"z":n.set(n.x,n.y,parseFloat(t.target.value)),c[2]=Math.round(100*parseFloat(t.target.value))/100}e.forceCanvasUpdate()}else j.current[r[1]]=[u.current.vectors[r[1]].x,u.current.vectors[r[1]].y,u.current.vectors[r[1]].z].map((function(e){return Math.round(100*e)/100})),o();break;case"s":!Z(t.target.value)||parseFloat(t.target.value)<0&&"Mass"===r[1]?(d.current[r[1]]=u.current.scalars[r[1]].get(),o()):(u.current.scalars[r[1]].set(parseFloat(t.target.value)),e.forceCanvasUpdate())}}}Object(n.useEffect)((function(){u.current=e.selection.GetInspectorInfo(),d.current={};for(var t=0,r=Object.entries(u.current.scalars);t<r.length;t++){var n=Object(s.a)(r[t],2),c=n[0],a=n[1];d.current[c]=a.get()}o()}),[e.selection]),Object(n.useEffect)((function(){for(var e in u.current.vectors)j.current[e]=[u.current.vectors[e].x,u.current.vectors[e].y,u.current.vectors[e].z].map((function(e){return Math.round(100*e)/100}))}),[e.selection].concat(Object(l.a)(Object.entries(u.current.vectors).map((function(e){return e[1].toArray()})).flat())));var f=[],v=function(e){f.push(Object(V.jsx)(F.a,{children:Object(V.jsx)(P.a,{colSpan:"3",children:Object(V.jsx)(M.a,{variant:"body1",align:"center",children:Object(V.jsx)("b",{children:e})})})})),f.push(Object(V.jsxs)(F.a,{children:[Object(V.jsx)(P.a,{children:Object(V.jsx)(z.a,{id:"v ".concat(e," x"),style:{width:"70px"},onKeyPress:b,onChange:function(t){j.current[e][0]=t.target.value,o()},variant:"outlined",size:"small",value:j.current[e][0]})}),Object(V.jsx)(P.a,{children:Object(V.jsx)(z.a,{id:"v ".concat(e," y"),style:{width:"70px"},onKeyPress:b,onChange:function(t){j.current[e][1]=t.target.value,o()},variant:"outlined",size:"small",value:j.current[e][1]})}),Object(V.jsx)(P.a,{children:Object(V.jsx)(z.a,{id:"v ".concat(e," z"),style:{width:"70px"},onKeyPress:b,onChange:function(t){j.current[e][2]=t.target.value,o()},variant:"outlined",size:"small",value:j.current[e][2]})})]}))};for(var h in j.current)v(h);var p=[],O=function(e){p.push(Object(V.jsxs)(F.a,{children:[Object(V.jsx)(P.a,{children:Object(V.jsx)(M.a,{variant:"body1",children:Object(V.jsx)("b",{children:e})})}),Object(V.jsx)(P.a,{children:Object(V.jsx)(z.a,{id:"s ".concat(e),style:{width:"70px"},onKeyPress:b,onChange:function(t){d.current[e]=t.target.value,o()},variant:"outlined",size:"small",value:d.current[e]})})]}))};for(var m in d.current)O(m);return Object(V.jsxs)(R.a,{anchor:"right",variant:"permanent",children:[Object(V.jsx)(S.a,{className:i.title,children:Object(V.jsx)(M.a,{align:"center",variant:"h6",children:"Inspector window"})}),Object(V.jsx)(I.a,{children:Object(V.jsxs)(G.a,{children:[f,p]})}),Object(V.jsx)(X.a,{className:i.removeBtn,onClick:function(){e.selection.scene.RemoveParticle(e.selection.key),e.deselect()},children:"Remove"})]})}function B(e){var t=Object(n.useRef)();return Object(n.useEffect)((function(){t.current.position.copy(e.position)}),[e.position.x,e.position.y,e.position.z]),Object(V.jsxs)("mesh",{position:e.position?e.position:[0,0,0],scale:e.scale?e.scale:[1,1,1],onClick:e.onClick,ref:t,children:[Object(V.jsx)("sphereBufferGeometry",{args:[.5]}),Object(V.jsx)("meshStandardMaterial",{color:e.selected?"gray":"green"})]})}var T=r(171);function U(e){var t=Object(T.a)("/arrow_model.glb"),r=t.nodes,c=(t.materials,Object(n.useRef)());Object(n.useEffect)((function(){c.current.position.copy(e.position)}),[e.position.x,e.position.y,e.position.z]);var a={geometry:r.Cylinder.geometry,position:e.position?e.position:[0,0,0],rotation:e.rotation?e.rotation:[0,0,0],scale:"undefined"!==typeof e.scale?[.187,1.4,.187].map((function(t){return t*e.scale})):[.187,1.4,.187],onClick:e.onClick};return Object(V.jsx)("group",{dispose:null,children:Object(V.jsx)("mesh",Object(o.a)(Object(o.a)({},a),{},{ref:c,children:Object(V.jsx)("meshStandardMaterial",{color:e.color?e.color:"purple",ref:e.meshMaterial})}))})}function Q(e){for(var t=[],r=0;r<6;r++)for(var n=0;n<6;n++)for(var c=0;c<6;c++){var a=new j.Vector3(r-3+.5,n-3+.5,c-3+.5);a.multiplyScalar(3);var o=new j.Vector3,i=0;switch(e.fieldArrowMode){case"G":o=e.scene.CalculateTotalGravField(a),i=Math.max(Math.min(1e11*o.length(),.4),0);break;case"E":o=e.scene.CalculateTotalElecField(a),i=Math.max(Math.min(o.length()/1e9,.4),0)}o.normalize();var s=new j.Quaternion;s.setFromUnitVectors(new j.Vector3(0,-1,0),o);var l=new j.Euler;l.setFromQuaternion(s),t.push(Object(V.jsx)(U,{position:a,scale:e.cameraZoom*i,rotation:l,color:"darkblue"},"".concat(r," ").concat(n," ").concat(c)))}return t}function D(e){var t=Object(n.useRef)(null),r=Object(n.useRef)(null),c=Object(n.useRef)(null);return Object(n.useEffect)((function(){switch(e.movingArrow){case"X":r.current.color.set("yellow"),c.current.color.set("green"),t.current.color.set("blue");break;case"Y":r.current.color.set("red"),c.current.color.set("yellow"),t.current.color.set("blue");break;case"Z":r.current.color.set("red"),c.current.color.set("green"),t.current.color.set("yellow");break;default:r.current.color.set("red"),c.current.color.set("green"),t.current.color.set("blue")}}),[e.movingArrow]),Object(V.jsxs)("group",{children:[Object(V.jsx)(U,{color:"X"===e.movingArrow?"yellow":"red",scale:e.scale?e.scale:.5,rotation:new j.Euler(0,0,Math.PI/2),position:e.position,onClick:function(){return e.selectArrow("X")},meshMaterial:r}),Object(V.jsx)(U,{hidden:e.mode2D,color:"Y"===e.movingArrow?"yellow":"green",scale:e.scale?e.scale:.5,rotation:new j.Euler(0,0,Math.PI),position:e.position,onClick:function(){return e.selectArrow("Y")},meshMaterial:c}),Object(V.jsx)(U,{color:"Z"===e.movingArrow?"yellow":"blue",scale:e.scale?e.scale:.5,rotation:new j.Euler(-Math.PI/2,0,0),position:e.position,onClick:function(){return e.selectArrow("Z")},meshMaterial:t})]})}function J(e){return Object(u.b)((function(t){var r,n=t.camera;(r=n.position).set.apply(r,Object(l.a)(e.cameraPos)),n.lookAt.apply(n,Object(l.a)(e.focus))})),null}T.a.preload("/arrow_model.glb");var _=function(){var e=Y([0,0,5]),t=Object(s.a)(e,2),r=t[0],c=t[1],a=Object(n.useState)([0,0,0]),b=Object(s.a)(a,2),v=b[0],h=(b[1],Y(!1)),p=Object(s.a)(h,2),O=p[0],m=p[1],x=Y(!0),y=Object(s.a)(x,2),k=y[0],M=(y[1],Y(null)),C=Object(s.a)(M,2),E=C[0],F=C[1],P=Y(new j.Vector3),z=Object(s.a)(P,2),R=z[0],S=(z[1],Y(0)),I=Object(s.a)(S,2),G=I[0],X=I[1],L=Object(n.useState)("N"),N=Object(s.a)(L,2),Z=N[0],T=N[1],U=Y(null),_=Object(s.a)(U,2),$=_[0],q=_[1],H=Object(n.useRef)(),W=Y(new g([])),ee=Object(s.a)(W,2),te=ee[0],re=(ee[1],Y(!1)),ne=Object(s.a)(re,2),ce=ne[0],ae=ne[1];function oe(){ae(!ce.current)}function ie(){var e=new w(G.current,Object(i.a)(j.Vector3,Object(l.a)(v)),new j.Quaternion,new j.Vector3(1,1,1),null,te.current,0,0);e.onClick=function(){return t=e,void(E.current||($.current&&($.current.selected=!1),t===$.current?q(null):(t.selected=!0,q(t))));var t},X(G.current+1)}function se(e){m(!1),E.current&&(e.shiftKey&&$.current.position.copy(R.current),R.current.set(0,0,0),F(null))}Object(n.useEffect)((function(){return H.current.addEventListener("mousemove",je)}),[]),Object(n.useEffect)((function(){return H.current.addEventListener("mousedown",(function(){return m(!0)}))}),[]),Object(n.useEffect)((function(){return H.current.addEventListener("mouseup",se)}),[]),Object(n.useEffect)((function(){return H.current.addEventListener("wheel",(function(e){return function(e,t){var n=[v[0]-r.current[0],v[1]-r.current[1],v[2]-r.current[2]].map((function(r){return r*(t*(e.deltaY/1e3))}));n=[r.current[0]+n[0],r.current[1]+n[1],r.current[2]+n[2]],Math.pow(n[0],2)+Math.pow(n[1],2)+Math.pow(n[2],2)>.05&&Math.pow(n[0],2)+Math.pow(n[1],2)+Math.pow(n[2],2)<900&&c(n)}(e,.9)}))}),[]),Object(n.useEffect)((function(){return H.current.addEventListener("mouseleave",(function(){return m(!1)}))}),[]);var le=new j.Vector3(0,1,0),ue=new j.Vector3(1,0,0);function je(e){if(O.current&&k.current&&!E.current){var t=new j.Vector3(r.current[0]-v[0],r.current[1]-v[1],r.current[2]-v[2]);ue.crossVectors(le,t),ue.normalize(),t.applyAxisAngle(le,e.movementX/-300),t.applyAxisAngle(ue,e.movementY/-300),t=[(t=t.toArray())[0]+v[0],t[1]+v[1],t[2]+v[2]],c(t)}else if(E.current){switch(E.current){case"X":v[2]>r.current[2]?$.current.position.add(new j.Vector3(e.movementX/-300,0,0)):$.current.position.add(new j.Vector3(e.movementX/300,0,0));break;case"Y":$.current.position.add(new j.Vector3(0,e.movementY/-300,0));break;case"Z":v[0]>r.current[0]?$.current.position.add(new j.Vector3(0,0,e.movementX/300)):$.current.position.add(new j.Vector3(0,0,e.movementX/-300))}oe()}}function de(e){T(e)}var be=.1*Object(i.a)(j.Vector3,Object(l.a)(r.current.map((function(e,t){return e-v[t]})))).length(),fe=$.current?Object(V.jsx)(D,{position:$.current.position?$.current.position:new j.Vector3,scale:be,movingArrow:E.current,selectArrow:function(e){return function(e){E.current||(R.current.copy($.current.position),F(e))}(e)}}):null;return Object(V.jsxs)("div",{style:{display:"flex",flexDirection:"column",height:"100%"},children:[Object(V.jsx)("div",{ref:H,style:{flex:1},id:"canvas",children:Object(V.jsxs)(u.a,{children:[Object(V.jsx)(J,{cameraPos:r.current,focus:v}),Object(V.jsx)("ambientLight",{intensity:.5}),Object(V.jsx)("pointLight",{position:[-10,10,-10]}),fe,te.current.particles.map((function(e){return Object(V.jsx)(B,Object(o.a)({},e))})),Object(V.jsx)(Q,{scene:te.current,cameraZoom:be,fieldArrowMode:Z})]})}),Object(V.jsx)(A,{addParticle:ie,setFieldArrowMode:function(e){return de(e)}}),Object(V.jsx)(d.a,{onClick:ie,style:{background:"skyblue",position:"absolute",bottom:"20px",left:"20px"},children:Object(V.jsx)(f.a,{})}),$.current?Object(V.jsx)(K,{deselect:function(){q(null)},selection:$.current,forceCanvasUpdate:oe}):null]})};a.a.render(Object(V.jsx)(_,{}),document.getElementById("root"))}},[[119,1,2]]]);
//# sourceMappingURL=main.271c8d1a.chunk.js.map