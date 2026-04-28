StudyTrack é uma aplicação web desenvolvida para ajudar estudantes a organizar suas matérias, registrar sessões de estudo e acompanhar o progresso em relação às metas estabelecidas.

O sistema resolve um problema comum entre universitários: a dificuldade de controlar quanto tempo está sendo dedicado a cada disciplina e se as metas semanais estão sendo cumpridas. Com o StudyTrack, o aluno cadastra suas matérias, define metas de horas e registra cada sessão de estudo — a aplicação calcula automaticamente o progresso.

Público-alvo:
Estudantes universitários que desejam organizar e monitorar sua rotina de estudos.

Funcionalidades:
Matérias — Cadastro, edição e exclusão de matérias com nome, cor identificadora, descrição e carga horária

Sessões de Estudo — Registro, edição e exclusão de sessões com data, horário de início/fim (duração calculada automaticamente) e observações

Metas — Definição, edição e exclusão de metas de horas por matéria (diária, semanal ou mensal)

Progresso — Painel com total de horas estudadas, metas atingidas, progresso por matéria (barra visual) e histórico das últimas sessões

Pré-requisitos:
Antes de executar o projeto, certifique-se de ter instalado:

Node.js versão 18 ou superior → nodejs.org

npm versão 9 ou superior (já incluído com o Node.js)

Como Executar Localmente:
1. Clone o repositório   
git clone https://github.com/grupo10-psw/studytrack.git
cd studytrack

2. Instale as dependências
npm install
⚠️ Este passo é obrigatório após clonar. Sem ele, o projeto não irá funcionar.

3. Inicie o servidor de dados (JSON Server)
Abra um primeiro terminal e execute:
npm run server
O servidor de dados estará disponível em: http://localhost:3001

4. Inicie o frontend (Vite)
Abra um segundo terminal (sem fechar o primeiro) e execute:
npm run dev
O frontend estará disponível em: http://localhost:5173

5. Acesse a aplicação
Abra o navegador e acesse:
http://localhost:5173

Projeto desenvolvido pelo Grupo 10 na disciplina de Projeto de Software (PSW).
(Thiago Athanasio e José Luka)
