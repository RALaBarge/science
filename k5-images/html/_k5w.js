/* Shared helpers for the small K-5 interactives. inject-images.mjs puts this once on every page that has one. */
window.K5W=window.K5W||(function(){
 var n=0;
 function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
 var C={ink:'var(--ink,#12172b)',muted:'var(--muted,#47506e)',line:'var(--line,#d0d8e8)',surf:'var(--surface,#fff)',surf2:'var(--surface-2,#e8edf6)',beam:'var(--beam,#f2a900)',blue:'var(--reflect,#2b66e8)',red:'var(--absorb,#d6450b)',teal:'var(--transmit,#0b7f70)',shade:'var(--shade,#222a4a)',bad:'#d93036'};
 function a(v){return v==null?'':v;}
 var S={
  c:function(x,y,r,f,s,w){return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(f||'none')+'" stroke="'+(s||'none')+'" stroke-width="'+(w||2)+'"/>';},
  r:function(x,y,w,hh,f,s,rx,sw){return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+hh+'" rx="'+(rx||0)+'" fill="'+(f||'none')+'" stroke="'+(s||'none')+'" stroke-width="'+(sw||2)+'"/>';},
  l:function(x1,y1,x2,y2,s,w,dash){return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+(s||C.ink)+'" stroke-width="'+(w||2)+'" stroke-linecap="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';},
  t:function(x,y,txt,sz,f,anc,wt){return '<text x="'+x+'" y="'+y+'" font-size="'+(sz||13)+'" fill="'+(f||C.ink)+'" text-anchor="'+(anc||'middle')+'"'+(wt?' font-weight="'+wt+'"':'')+'>'+txt+'</text>';},
  p:function(pts,f,s,w){return '<polygon points="'+pts+'" fill="'+(f||'none')+'" stroke="'+(s||'none')+'" stroke-width="'+(w||2)+'" stroke-linejoin="round"/>';},
  a:function(x1,y1,x2,y2,col,w,hd){w=w||4;hd=hd||11;var an=Math.atan2(y2-y1,x2-x1),hx=x2-Math.cos(an)*hd*.9,hy=y2-Math.sin(an)*hd*.9,px=-Math.sin(an)*hd*.55,py=Math.cos(an)*hd*.55;
   return '<line x1="'+x1+'" y1="'+y1+'" x2="'+hx.toFixed(1)+'" y2="'+hy.toFixed(1)+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/><polygon points="'+x2+','+y2+' '+(hx+px).toFixed(1)+','+(hy+py).toFixed(1)+' '+(hx-px).toFixed(1)+','+(hy-py).toFixed(1)+'" fill="'+col+'"/>';}
 };
 return {
  h:h,C:C,S:S,
  chips:function(box,labels,sel,fn,aria){
   var g=h('div','row');g.setAttribute('role','group');if(aria)g.setAttribute('aria-label',aria);box.appendChild(g);
   function draw(){g.innerHTML='';labels.forEach(function(l,i){var b=h('button',null,l);b.type='button';b.setAttribute('aria-pressed',String(i===sel));b.onclick=function(){sel=i;draw();fn(i);};g.appendChild(b);});}
   draw();return {set:function(i){sel=i;draw();},get:function(){return sel;}};},
  slider:function(box,label,min,max,step,val,fmt,fn){
   var id='k5s'+(++n),w=h('div'),l=h('label'),inp=h('input');l.setAttribute('for',id);inp.type='range';inp.id=id;inp.min=min;inp.max=max;inp.step=step;inp.value=val;
   function upd(){l.innerHTML=label+': <span>'+fmt(+inp.value)+'</span>';}
   inp.oninput=function(){upd();fn(+inp.value);};upd();w.appendChild(l);w.appendChild(inp);box.appendChild(w);inp.refresh=upd;return inp;},
  btn:function(box,label,fn){var r=box.querySelector('.row.btns');if(!r){r=h('div','row btns');box.appendChild(r);}var b=h('button',null,label);b.type='button';b.onclick=fn;r.appendChild(b);return b;},
  svg:function(box,vb,label){var s=document.createElementNS('http://www.w3.org/2000/svg','svg');s.setAttribute('viewBox',vb);s.setAttribute('role','img');s.setAttribute('aria-label',label||'');box.appendChild(s);return s;},
  say:function(box){var p=h('p');p.setAttribute('aria-live','polite');box.appendChild(p);return function(t){p.innerHTML=t;};},
  note:function(box,t){var p=h('p','small',t);box.appendChild(p);return p;}
 };
})();
