/* TECLADO IGUAL EXCEL nas tabelas do App (Estoque, Caderneta, Custos, Contábil — o IATF tem o seu).
   Em qualquer campo dentro de uma tabela:
   - Tab vai pra próxima célula da linha (pula botões); no fim da linha, primeira célula da próxima.
     Shift+Tab volta. Sem célula pra ir, fica na mesma — nunca sai da tabela.
   - Enter desce pra mesma coluna (Shift+Enter sobe). Se a tela já tem o seu Enter (ex.: lançar
     linha nova, criar linha no fim), o dela vale e este não faz nada.
   Ao entrar na célula o texto fica selecionado, pra digitar por cima. */
(function(){
  const NAO=/^(checkbox|radio|button|submit|reset|file|color|hidden|range)$/i;
  const editavel=el=>el&&!el.disabled&&!el.readOnly&&el.offsetParent!==null&&
    ((el.tagName==='INPUT'&&!NAO.test(el.type))||el.tagName==='SELECT'||el.tagName==='TEXTAREA');
  const celulaDe=el=>{const td=el&&el.closest&&el.closest('td');const tr=td&&td.parentElement;const tb=tr&&tr.parentElement;
    return td&&tb&&tb.tagName==='TBODY'?{td,tr,tb,table:tb.closest('table')}:null};
  const camposDa=tr=>[...tr.querySelectorAll('td')].filter(td=>td.parentElement===tr)
    .map(td=>[...td.querySelectorAll('input,select,textarea')].find(editavel)).filter(Boolean);
  const linhas=tb=>[...tb.children].filter(tr=>tr.tagName==='TR'&&tr.offsetParent!==null);
  function focar(el){if(!el)return;el.focus();try{if(el.tagName==='INPUT'&&el.select)el.select()}catch(e){}
    const td=el.closest('td');if(td)td.scrollIntoView({block:'nearest',inline:'nearest'})}
  // acha de novo a tabela depois do "change" (a tela pode ter redesenhado)
  function localizar(el){const c=celulaDe(el);if(!c)return null;const ts=[...document.querySelectorAll('table')];
    return {t:ts.indexOf(c.table),r:linhas(c.tb).indexOf(c.tr),col:[...c.tr.children].indexOf(c.td),k:camposDa(c.tr).indexOf(el),el}}
  function reachar(p){const table=document.querySelectorAll('table')[p.t];const tb=table&&table.tBodies[0];if(!tb)return null;return {tb,trs:linhas(tb)}}
  function destino(p,tab,volta){
    const x=reachar(p);if(!x)return null;const {trs}=x;
    if(!tab){const tr=trs[p.r+(volta?-1:1)];if(!tr)return null;const td=tr.children[p.col];
      return td?[...td.querySelectorAll('input,select,textarea')].find(editavel)||null:null}
    const tr=trs[p.r];const cs=tr?camposDa(tr):[];const k=p.k+(volta?-1:1);
    if(k>=0&&k<cs.length)return cs[k];
    const tr2=trs[p.r+(volta?-1:1)];if(!tr2)return null;const cs2=camposDa(tr2);
    return cs2.length?cs2[volta?cs2.length-1:0]:null;
  }
  function mover(e,tab){
    const el=document.activeElement;const p=localizar(el);if(!p)return;
    e.preventDefault();e.stopPropagation();
    const volta=e.shiftKey;
    if(el.blur)el.blur(); // grava a célula (dispara o change)
    setTimeout(()=>{const alvo=destino(p,tab,volta);
      if(alvo)focar(alvo);else{const x=reachar(p);const tr=x&&x.trs[p.r];const de=tr&&camposDa(tr)[p.k];focar(de&&document.contains(de)?de:(document.contains(p.el)?p.el:null))}},0);
  }
  // Tab: na captura (antes do navegador pular pra um botão)
  document.addEventListener('keydown',e=>{
    if(e.key!=='Tab'||e.ctrlKey||e.altKey||e.metaKey)return;
    const el=document.activeElement;if(!editavel(el)||!celulaDe(el))return;
    mover(e,true);
  },true);
  // Enter: só se a própria tela não tratou (o Enter dela vem antes)
  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'||e.defaultPrevented||e.ctrlKey||e.altKey||e.metaKey||e.isComposing)return;
    const el=document.activeElement;if(!editavel(el)||el.tagName==='TEXTAREA'||!celulaDe(el))return;
    mover(e,false);
  });
  document.addEventListener('focusin',e=>{const el=e.target;if(el&&el.tagName==='INPUT'&&editavel(el)&&celulaDe(el)&&/^(text|number|search|tel|)$/i.test(el.type))setTimeout(()=>{try{if(document.activeElement===el)el.select()}catch(x){}},0)});
})();
