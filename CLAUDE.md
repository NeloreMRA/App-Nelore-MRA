# App Nelore MRA

Portal único da Fazenda Paraíso (Nelore MRA): login, escolha do app e Configurações.
Site estático (GitHub Pages) + Firebase próprio (`app-nelore-mra`: Authentication + Firestore).

## Estrutura
- `index.html` — portal: login (usuário ou e-mail + senha), tela de apps, Configurações (só admin).
- `firestore.rules` — regras de segurança; precisam ser coladas e publicadas no console do Firebase (Firestore > Regras) sempre que mudarem.
- `logo.webp` — marca Nelore MRA.

## Regras do projeto
- Admin: `mandrade.gado@terra.com.br` (vê tudo e é o único que abre Configurações).
- Funcionários entram com **usuário + senha** (sem e-mail): por baixo o login vira `usuario@app-nelore-mra.firebaseapp.com`.
- Permissões em `users/{uid}`: `{nome, usuario, apps:{iatf,custos,contabil,gado}, ativo}`.
- Dados de cada app novo ficam em `apps/<id do app>/...` (as regras liberam por app).
- **Fase 1:** IATF, Custos e Contábil abrem os sistemas atuais (repositórios e Firebase próprios, NÃO mexer neles a partir daqui). Trazer pra dentro depois, um por vez, **copiando** os dados (o antigo fica intacto como reserva).
- Próximo app: **Gado & Caderneta** (estoque de gado + caderneta digital offline, dividida por mês).

## Fluxo de trabalho
- Testar no navegador antes de enviar; abrir PR e fazer o merge no `main` direto (autorizado pelo dono).
- Responder em português simples (usuário não é programador). Telas enxutas, sem textos longos.
