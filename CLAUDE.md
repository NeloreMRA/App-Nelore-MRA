# App Nelore MRA

Portal único da Fazenda Paraíso (Nelore MRA): login, escolha do app e Configurações.
Site estático (GitHub Pages) + Firebase próprio (`app-nelore-mra`: Authentication + Firestore).

## Estrutura
- `index.html` — portal: login (usuário ou e-mail + senha), tela de apps, Configurações (só admin).
- `firestore.rules` — regras de segurança; precisam ser coladas e publicadas no console do Firebase (Firestore > Regras) sempre que mudarem.
- `logo.webp` — marca Nelore MRA.
- `iatf/index.html` — IATF dentro do App (cópia do repositório IATF-MRA adaptada: Firebase novo, dados em `apps/iatf`, login do portal, telas por usuário em `users/{uid}.paginas.iatf`). Guardas do navegador com prefixo `app-nelore-mra-` pra não misturar com o IATF antigo (mesmo site github.io).
- `custos/index.html` — Custos Safra dentro do App (dados em `apps/custos/dados/{estado-atual,diesel}`; quem só tem telas de Diesel é bloqueado pelas regras de ler os custos da safra). Diesel: no Controle a Estação é obrigatória mas começa VAZIA (o dono não quer que venha pronta); o Estoque Diesel não tem estação. "Dashboard Diesel" filtra por mês e estação.
- `contabil/index.html` — Contábil dentro do App (dados em `apps/contabil/dados/{config,banco,caixa}` e `apps/contabil/partes/*`; IndexedDB `app_nelore_mra_contabil_db`).

## Regras do projeto
- Admin: `mandrade.gado@terra.com.br` (vê tudo e é o único que abre Configurações).
- Funcionários entram com **usuário + senha** (sem e-mail): por baixo o login vira `usuario@app-nelore-mra.firebaseapp.com`.
- Permissões em `users/{uid}`: `{nome, usuario, apps:{iatf,custos,contabil,gado}, paginas:{iatf:[telas]}, ativo}` (`paginas` vazio = todas as telas).
- `logins/{usuario}` → `{email}`: e-mail interno do login. Usuário excluído e recriado com o mesmo nome vira `usuario+2@...` (o login antigo não dá pra apagar pelo navegador).
- `config/apps`: `links` (sistemas antigos) e `usarNovo` (chave que faz o botão abrir a versão de dentro do App).
- Excluir usuário apaga o perfil (perde o acesso); o login continua existindo no Firebase, então o nome de usuário fica reservado.
- Dados de cada app novo ficam em `apps/<id do app>/...` (as regras liberam por app).
- **Tombamento feito em 01/10/2026**: os dados de IATF, Custos e Contábil foram copiados dos Firebase antigos e tudo roda aqui. Os repositórios antigos (IATF-MRA, custos-safra, Contabil-MRA) ficam só como arquivo — NÃO são mais usados nem alterados.
- `caderneta/index.html` — Caderneta com 2 abas: **Nascimentos** (RGD Mãe, N° Receptora, Sexo M/F, Data, Peso kg, Pelagem, Observação = lista Natimorto/Morte/Gêmeos + texto livre) e **Lançamento Geral** (Data Lançamento vazia pra preencher, RGD, Situação = Entrada/Saída/Morte/Abate/Outros, Observação, Fotos comprimidas; lançamentos antigos tinham `acontecimento`, mostrado como observação). Data de nascimento também vem vazia. Tudo em `apps/caderneta/lancamentos` com campo `aba` (`nasc`/`geral`) e `mes`; lançamentos antigos sem `aba` não aparecem. Filtro de Mês em cima (igual Custos; "Todos os meses" também) — o dono NÃO quer a lista de meses na lateral. Tabela com filtro ▾ por coluna (estilo Excel), linha verde de lançar e colunas ajustáveis; celular: lista + botão "+ Lançar".
- `estoque/index.html` — Estoque Gado POR MÊS em `apps/estoque/mensal` (campo `mes`): Classificação (livre), Qtd Inicial, Entrada, Saída, Morte, Abate, Total (= inicial+entrada−saída−morte−abate), Observação. Mês novo: botão "Puxar de <mês anterior>" copia classificações com Total → Qtd Inicial e NÃO leva as de total 0; se o mês anterior mudar depois, aparece "Atualizar Qtd Inicial". Aba "Dashboard" (KPIs do mês, por classificação, evolução mês a mês). Versões antigas (linhas/abas/historico) não são mais usadas.
- Sem internet: `sw.js` guarda as telas no aparelho e o Firestore usa `enablePersistence` (lança offline e envia depois). `manifest.webmanifest` + ícones permitem instalar no celular.

## Fluxo de trabalho
- Testar no navegador antes de enviar; abrir PR e fazer o merge no `main` direto (autorizado pelo dono).
- Responder em português simples (usuário não é programador). Telas enxutas, sem textos longos.
- `barra-app.js` — botão pequeno "← App Nelore MRA" igual em todos os apps, no topo do menu lateral (IATF/Custos/Contábil) ou à esquerda do cabeçalho (Caderneta/Estoque); `data-alvo` diz onde entra. O dono NÃO quer barra larga no topo (perde espaço). Não colocar outro botão de voltar dentro dos apps.
- Tela inicial tem o botão "🔄 Atualizar": apaga o cache do service worker e recarrega (pra pegar versão nova). Ao mudar telas, subir a versão do CACHE em `sw.js`.
