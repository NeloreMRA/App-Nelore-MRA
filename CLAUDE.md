# App Nelore MRA

Portal único da Fazenda Paraíso (Nelore MRA): login, escolha do app e Configurações.
Site estático (GitHub Pages) + Firebase próprio (`app-nelore-mra`: Authentication + Firestore).

## Estrutura
- `index.html` — portal: login (usuário ou e-mail + senha), tela de apps, Configurações (só admin).
- `firestore.rules` — regras de segurança; precisam ser coladas e publicadas no console do Firebase (Firestore > Regras) sempre que mudarem.
- `logo.webp` — marca Nelore MRA.
- `iatf/index.html` — IATF dentro do App (cópia do repositório IATF-MRA adaptada: Firebase novo, dados em `apps/iatf`, login do portal, telas por usuário em `users/{uid}.paginas.iatf`). Guardas do navegador com prefixo `app-nelore-mra-` pra não misturar com o IATF antigo (mesmo site github.io).
- `custos/index.html` — Custos Safra dentro do App (dados em `apps/custos/dados/{estado-atual,diesel}`; quem só tem telas de Diesel é bloqueado pelas regras de ler os custos da safra).
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
- `caderneta/index.html` — Caderneta: lançamentos em `apps/caderneta/lancamentos` (um por documento, campo `mes` = AAAA-MM), fotos comprimidas no aparelho em `apps/caderneta/fotos` (sem Storage pago), locais em `apps/caderneta/config/listas`. Só o tipo de acontecimento é lista fixa. Quem lançou (ou o admin) edita/apaga.
- `estoque/index.html` — Estoque Gado: tabela por pasto + categoria em `apps/estoque/linhas` (computador edita na tabela; celular lista por pasto). Filtro/ordenação estilo Excel em cada coluna (igual Custos), soma das células selecionadas (arrastar/Shift/Ctrl). "🕘 Mudanças": cada alteração fica anotada sozinha em `apps/estoque/historico` (quem, quando, de → para). O dono não gostou de "Fechar mês"/"Meses fechados" nem da versão "planilha livre" — removidos.
- Sem internet: `sw.js` guarda as telas no aparelho e o Firestore usa `enablePersistence` (lança offline e envia depois). `manifest.webmanifest` + ícones permitem instalar no celular.

## Fluxo de trabalho
- Testar no navegador antes de enviar; abrir PR e fazer o merge no `main` direto (autorizado pelo dono).
- Responder em português simples (usuário não é programador). Telas enxutas, sem textos longos.
- `barra-app.js` — barra igual em todos os apps ("← 🏠 App Nelore MRA › Nome do app"), incluída logo depois do `<body>` de cada app. Não colocar outro botão de voltar dentro dos apps.
