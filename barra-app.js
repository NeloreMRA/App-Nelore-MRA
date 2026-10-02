/* Botão "← App Nelore MRA" igual em todos os apps, pequeno, no canto esquerdo (topo do menu lateral / cabeçalho).
   Uso: <script src="../barra-app.js" data-alvo="seletor do menu ou cabeçalho"></script> */
(function(){
  var s=document.currentScript, alvo=(s&&s.dataset.alvo)||'body';
  var css='.voltar-app{display:inline-flex;align-items:center;gap:5px;align-self:flex-start;flex:none;box-sizing:border-box;margin:0 0 12px;padding:5px 10px;'+
    'border-radius:7px;border:1px solid #d9bd5f66;background:#d9bd5f1f;color:#f1dfa0;font:600 12px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;'+
    'text-decoration:none;white-space:nowrap;cursor:pointer}'+
    '.voltar-app:hover{background:#d9bd5f40;color:#fff}'+
    '@media print{.voltar-app{display:none!important}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  function por(){
    var c=document.querySelector(alvo);if(!c||c.querySelector('.voltar-app'))return;
    var a=document.createElement('a');a.className='voltar-app';a.href='../index.html';a.title='Voltar pro App Nelore MRA';
    a.innerHTML='<span class="va-seta">←</span><span class="va-txt">App Nelore MRA</span>';
    c.insertBefore(a,c.firstChild);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',por);else por();
})();
