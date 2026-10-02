/* Barra igual em todos os apps: "← 🏠 App Nelore MRA › Nome do app".
   Uso: <script src="../barra-app.js" data-app="IATF"></script> logo depois do <body>. */
(function(){
  var s=document.currentScript, nome=(s&&s.dataset.app)||'';
  var css='.barra-app{height:34px;flex:none;width:100%;box-sizing:border-box;display:flex;align-items:center;gap:8px;padding:0 14px;'+
    'background:#efe7cc;border-bottom:1px solid #dccf9f;color:#8a7638;font:600 13px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;position:relative;z-index:50}'+
    '.barra-app a{display:inline-flex;align-items:center;gap:6px;color:#4a3d0f;text-decoration:none;padding:6px 10px;margin-left:-10px;border-radius:7px;white-space:nowrap}'+
    '.barra-app a:hover{background:#e2d6ad}.barra-app b{color:#1d3d2c;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'+
    '@media print{.barra-app{display:none!important}}';
  var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
  var b=document.createElement('div');b.className='barra-app';
  b.innerHTML='<a href="../index.html">← 🏠 App Nelore MRA</a><span>›</span><b></b>';
  b.querySelector('b').textContent=nome;
  document.body.insertBefore(b,document.body.firstChild);
})();
