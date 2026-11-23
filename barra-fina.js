/* BARRA FINA no PC (teste, 23/11/2026): o menu da esquerda fica só com os ícones; ☰ abre o menu completo por cima.
   Passando o mouse num ícone aparece o nome. No celular não muda nada.
   PRA VOLTAR AO MENU ANTIGO: apagar a linha <script src="../barra-fina.js" ...> do iatf/index.html e do custos/index.html.
   Uso: <script src="../barra-fina.js" data-alvo="seletor do menu" data-nav="seletor dos botões" data-pc="largura mínima do PC" data-grade="seletor da grade (se tiver)"></script> */
(function(){
  var s=document.currentScript,d=(s&&s.dataset)||{};
  var A=d.alvo||'aside',N=d.nav||'button',PC=Number(d.pc||761),G=d.grade||'';
  var mq='@media (min-width:'+PC+'px){';
  var fecha='body.bf:not(.bf-aberta) ';
  var css=mq+
    // fechada: 72px, só ícones
    fecha+A+'{width:72px!important;min-width:72px!important;padding:14px 10px!important;overflow:visible!important}'+
    (G?fecha+G+'{grid-template-columns:72px 1fr!important}':'')+
    fecha+A+' .brand,'+fecha+A+' .voltar-app,'+fecha+A+' .side-season,'+fecha+A+' .side-safra,'+fecha+A+' .user-badge,'+fecha+A+' .nav-grupo,'+fecha+A+' .sidebar-foot span:last-child,'+fecha+A+' .sync-status span:last-child{display:none!important}'+
    fecha+A+' '+N+'{justify-content:center!important;padding:12px 0!important;gap:0!important;font-size:0!important;width:100%}'+
    fecha+A+' '+N+' span{display:none!important}'+
    // aberta: menu completo por cima da tela
    'body.bf-aberta '+A+'{position:fixed!important;left:0;top:0;bottom:0;height:100vh!important;width:250px!important;z-index:1300;box-shadow:8px 0 24px #0003;overflow-y:auto!important}'+
    (G?'body.bf-aberta '+G+'{grid-template-columns:72px 1fr!important}body.bf-aberta '+G+'>main{grid-column:2}':'body.bf-aberta main{margin-left:72px}')+
    '.bf-fundo{position:fixed;inset:0;background:#0003;z-index:1290}'+
    '.bf-tog{display:grid;place-items:center;flex:none;width:44px;height:40px;margin:0 auto 14px;border-radius:10px;border:0;background:#ffffff22;color:#fff;font-size:20px;line-height:1;cursor:pointer}'+
    'body.bf-aberta .bf-tog{margin:0 0 14px 4px}.bf-tog:hover{background:#ffffff33}'+
    '.bf-dica{position:fixed;background:#17211c;color:#fff;padding:6px 11px;border-radius:8px;font:600 13px/1.2 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;white-space:nowrap;z-index:1400;pointer-events:none}'+
    '}'+
    '.bf-tog,.bf-dica,.bf-fundo{display:none}'+mq+'.bf-tog{display:grid}.bf-fundo{display:block}.bf-dica{display:block}}'+
    '@media print{.bf-tog,.bf-dica,.bf-fundo{display:none!important}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var dica=null;
  function tiraDica(){if(dica){dica.remove();dica=null}}
  function fechar(){document.body.classList.remove('bf-aberta');var f=document.querySelector('.bf-fundo');if(f)f.remove()}
  function abrir(){tiraDica();document.body.classList.add('bf-aberta');if(!document.querySelector('.bf-fundo')){var f=document.createElement('div');f.className='bf-fundo';f.onclick=fechar;document.body.appendChild(f)}}
  function por(){
    var c=document.querySelector(A);if(!c||c.querySelector('.bf-tog'))return;
    document.body.classList.add('bf');
    var b=document.createElement('button');b.type='button';b.className='bf-tog';b.title='Menu';b.textContent='☰';
    b.onclick=function(){document.body.classList.contains('bf-aberta')?fechar():abrir()};
    c.insertBefore(b,c.firstChild);
    // escolheu uma tela: fecha o menu
    c.addEventListener('click',function(e){var n=e.target.closest(N);if(n&&document.body.classList.contains('bf-aberta'))setTimeout(fechar,0)});
    // nome do ícone ao passar o mouse (só com a barra fechada)
    c.addEventListener('mouseover',function(e){
      var n=e.target.closest(N);if(!n||document.body.classList.contains('bf-aberta')||innerWidth<PC){tiraDica();return}
      var t=(n.textContent||'').trim()||n.title;if(!t)return;tiraDica();
      var r=n.getBoundingClientRect();dica=document.createElement('div');dica.className='bf-dica';dica.textContent=t;
      dica.style.left=(r.right+8)+'px';dica.style.top=(r.top+r.height/2-14)+'px';document.body.appendChild(dica);
    });
    c.addEventListener('mouseleave',tiraDica);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')fechar()});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',por);else por();
})();
