# Sistema EAD de Capacitação do Mecânico - PI3

Sistema de ensino a distância para capacitação de mecânicos, desenvolvido como projeto integrador do curso de Engenharia de Computação da UNIVESP.

## 🚀 Funcionalidades

- Sistema de login e autenticação
- Reprodução de vídeos do YouTube
- Rastreamento de progresso individual por vídeo
- Barra de progresso geral do curso
- Modo escuro/claro para melhor acessibilidade
- Interface responsiva e moderna

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm (geralmente vem com o Node.js)
- Conta no Supabase (para o banco de dados)

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/claudiane-art/Sistema-EAD-de-Capacitacao-do-Mecanico-PI3.git
```

2. Entre na pasta do projeto:
```bash
cd Sistema-EAD-de-Capacitacao-do-Mecanico-PI3/project
```

3. Instale as dependências:
```bash
npm install
```

4. Configure as variáveis de ambiente:
   - Crie um arquivo `.env` na pasta `project`
   - Adicione as seguintes variáveis (substitua com suas credenciais do Supabase):
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## 🎮 Como Rodar

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Abra seu navegador e acesse:
```
http://localhost:5173
```

## 📚 Estrutura do Projeto

```
project/
├── src/
│   ├── components/     # Componentes React
│   ├── data/          # Dados estáticos
│   ├── lib/           # Configurações e utilitários
│   └── types/         # Definições de tipos TypeScript
├── public/            # Arquivos estáticos
└── supabase/          # Migrações do banco de dados
```

## 🛠️ Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- YouTube Player API

## 👥 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autores

- **Claudiane Art** - *Desenvolvimento inicial* - [claudiane-art](https://github.com/claudiane-art)

## 🙏 Agradecimentos

- UNIVESP
- Professores e colegas que contribuíram com o projeto 