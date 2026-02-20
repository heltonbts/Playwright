# 📋 Arquivos Essenciais do Projeto DETRAN

Data: 20/02/2026 | Status: Análise Completa

---

## 🎯 Resumo Executivo

Este projeto é um **sistema de 2 camadas**:
- **Backend:** API Python (FastAPI) que automação consultas no DETRAN
- **Frontend:** Interface Web (Next.js) para visualizar dados

Para funcionar **completamente**, você precisa de ambos. Para funcionar **parcialmente**, pode usar só o backend.

---

## 📦 ARQUIVOS CRÍTICOS DO BACKEND (Python)

### ✅ **ABSOLUTAMENTE NECESSÁRIOS:**

| Arquivo | Tamanho | Função | Dependências |
|---------|--------|--------|--------------|
| [`api_server.py`](api_server.py) | ~600 linhas | **ENTRY POINT** - Inicia API FastAPI na porta 8000 | detran_manual.py |
| [`detran_manual.py`](detran_manual.py) | ~1300 linhas | **CORAÇÃO** - Automação Playwright, extração de dados | requirements.txt |
| [`requirements.txt`](requirements.txt) | ~20 pacotes | **DEPENDÊNCIAS** - Todas as libs Python necessárias | pip install |

### ⚠️ **OPCIONAIS (Utilitários/Alternativas):**

| Arquivo | Função | Quando Usar |
|---------|--------|------------|
| `main.py` | Alternativa para rodar a API (redundante) | Se preferir ao invés de `api_server.py` |
| `app.py` | Alias para `main.py` (redundante) | Mesmo que `main.py` |
| `organizar_excel.py` | Reorganiza planilhas (standalone) | Após processar: `python organizar_excel.py` |
| `testar_excel.py` | Testa geração de Excel | Debug do módulo Excel |
| `diagnostico.py` | Verifica dependências | Troubleshooting inicial |

### 📁 **PASTAS ESSENCIAIS:**

| Pasta | Conteúdo | Função |
|-------|----------|--------|
| `boletos/` | PDFs baixados do DETRAN | Saída da automação |
| Nenhuma outra lib local | - | Tudo vem do `requirements.txt` |

### 🔐 **ARQUIVO DE CONFIGURAÇÃO:**

| Arquivo | Conteúdo | Função |
|---------|----------|--------|
| `.env` ou `.env.local` | `SUPABASE_URL`, `SUPABASE_KEY` | Credenciais do banco dados |

---

## 🎨 ARQUIVOS CRÍTICOS DO FRONTEND (Next.js)

### ✅ **ABSOLUTAMENTE NECESSÁRIOS:**

| Arquivo/Pasta | Tamanho | Função |
|--------|--------|--------|
| [`frontend/package.json`](frontend/package.json) | ~40 linhas | **DEPENDÊNCIAS** - Todas as libs Node.js |
| [`frontend/next.config.js`](frontend/next.config.js) | - | Configuração Next.js |
| [`frontend/tsconfig.json`](frontend/tsconfig.json) | - | Configuração TypeScript |
| [`frontend/src/app/layout.tsx`](frontend/src/app/layout.tsx) | - | Layout raiz do Next.js |
| [`frontend/src/app/page.tsx`](frontend/src/app/page.tsx) | ~15 linhas | Página inicial (redireciona para `/dashboard`) |

### ⚡ **FUNCIONALIDADES PRINCIPAIS:**

| Pasta | Arquivos-Chave | Função |
|-------|--------|--------|
| `src/app/` | `dashboard/`, `nova-consulta/`, `processamento/`, `resultados/`, `historico/` | **5 páginas principais** da interface |
| `src/components/` | `FileUpload.tsx`, `MultasTable.tsx`, `ProcessStatus.tsx`, etc | **Componentes reutilizáveis** |
| `src/lib/` | `api.ts`, `supabaseClient.ts` | **Integrações** com backend e banco dados |

### 🔐 **VARIÁVEIS DE AMBIENTE (.env.local):**

```plaintext
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_API_URL=/api/proxy
```

---

## 🏗️ ESTRUTURA MÍNIMA PARA FUNCIONAR

```
detran-main/
│
├── ✅ BACKEND (ESSENCIAL)
│   ├── requirements.txt          ⭐ CRÍTICO
│   ├── api_server.py             ⭐ CRÍTICO
│   ├── detran_manual.py          ⭐ CRÍTICO
│   ├── .env                      (opcional: credenciais Supabase)
│   └── boletos/                  (pasta criada automaticamente)
│
├── ✅ FRONTEND (ESSENCIAL)
│   ├── package.json              ⭐ CRÍTICO
│   ├── next.config.js            ⭐ CRÍTICO
│   ├── tsconfig.json             ⭐ CRÍTICO
│   └── src/
│       ├── app/
│       │   ├── page.tsx           ⭐ CRÍTICO
│       │   ├── layout.tsx         ⭐ CRÍTICO
│       │   ├── dashboard/
│       │   ├── nova-consulta/
│       │   ├── processamento/
│       │   ├── resultados/
│       │   └── historico/
│       ├── components/
│       │   ├── FileUpload.tsx
│       │   ├── MultasTable.tsx
│       │   ├── ProcessStatus.tsx
│       │   └── ... (outros)
│       └── lib/
│           ├── api.ts             ⭐ CRÍTICO
│           └── supabaseClient.ts
│
└── ❌ NÃO PRECISA
    ├── README*.md                (documentação)
    ├── *.txt (COMO_USAR, etc)    (documentação)
    ├── CORRECAO_* (documentação)  (notas)
    ├── DEPLOY.md                  (documentação)
    ├── testar_excel.py            (utilitário)
    ├── organizar_excel.py         (utilitário)
    └── diagnostico.py             (utilitário)
```

---

## 🚀 COMO RODAR COM MÍNIMO

### 1️⃣ **Preparar Backend**
```powershell
# Instalar dependências Python
pip install -r requirements.txt
playwright install chromium

# Configurar variáveis de ambiente
# (criar .env com SUPABASE_URL e SUPABASE_KEY)

# Iniciar API
python api_server.py
# Aguarde até ver: "Uvicorn running on http://localhost:8000"
```

### 2️⃣ **Preparar Frontend**
```powershell
cd frontend

# Instalar dependências Node
npm install

# Criar .env.local com:
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
# BACKEND_URL=http://localhost:8000

# Rodar desenvolvimento
npm run dev
# Acesse http://localhost:3000
```

---

## 📊 ÁRVORE DE DEPENDÊNCIAS

```
api_server.py
  ├── detran_manual.py
  │   ├── requirements.txt
  │   │   ├── playwright (automação web)
  │   │   ├── pandas (processamento dados)
  │   │   ├── openpyxl (geração Excel)
  │   │   ├── pdfplumber (leitura PDF)
  │   │   └── ... outros
  │   └── supabase (banco de dados)
  │
  └── .env (SUPABASE_URL, SUPABASE_KEY)

frontend/
  ├── package.json
  │   ├── next.js (framework)
  │   ├── axios (requisições HTTP)
  │   ├── @supabase/supabase-js (banco de dados)
  │   ├── @mui/material (componentes UI)
  │   └── ... outros
  │
  ├── src/app/*.tsx (páginas)
  ├── src/components/*.tsx (componentes)
  ├── src/lib/*.ts (integrações)
  │   ├── api.ts → http://localhost:8000
  │   └── supabaseClient.ts → Supabase
  │
  └── .env.local (SUPABASE_KEY, API_URL)
```

---

## 🗑️ ARQUIVOS QUE PODE DELETAR COM SEGURANÇA

❌ **Documentação** (redundante):
- `README.md`, `README_COMPLETO.md`, `RELATORIO_VERIFICACAO.md`
- `COMO_USAR.txt`, `DOCUMENTACAO.txt`, `SE_oriente.txt`
- Todas as `*.md` files (exceto este documento)

❌ **Scripts de utilitário**:
- `organizar_excel.py` (apenas se nunca usar)
- `testar_excel.py` (apenas se nunca usar)
- `diagnostico.py` (apenas se nunca usar)

❌ **Alternativas redundantes**:
- `main.py` (use `api_server.py` em seu lugar)
- `app.py` (use `api_server.py` em seu lugar)
- `api.py` (se houver, é duplicata)

❌ **Logs e outputs**:
- `*.log` files (`output.log`, `execucao.log`, etc)
- `resultado_detran_organizado.xlsx` (saída anterior)

❌ **Pastas de desenvolvimento**:
- `.git/` (se não usar versionamento)
- `__pycache__/` (criada automaticamente)
- `.venv/` ou venv/ (recriada com `pip install`)

---

## ⚙️ CHECKLIST DE INSTALAÇÃO

### Backend
- [ ] Python 3.9+ instalado
- [ ] `pip install -r requirements.txt` executado
- [ ] `playwright install chromium` executado
- [ ] `.env` com credenciais Supabase
- [ ] Porta 8000 disponível
- [ ] Executar: `python api_server.py`

### Frontend
- [ ] Node.js 18+ instalado
- [ ] `npm install` executado em `frontend/`
- [ ] `.env.local` com credenciais Supabase e API_URL
- [ ] Porta 3000 disponível
- [ ] Executar: `npm run dev` (em `frontend/`)

### Validação
- [ ] Backend: `curl http://localhost:8000/health` → `{"status": "OK"}`
- [ ] Frontend: `curl http://localhost:3000` → HTML
- [ ] Browser: `http://localhost:3000` → Dashboard

---

## 🎓 EXPLICAÇÃO TÉCNICA

### Backend
- **`api_server.py`** é a API que recebe requisições do frontend
- **`detran_manual.py`** faz o trabalho pesado (automação Playwright, extração de dados)
- **`requirements.txt`** lista todas as dependências Python necessárias
- **Supabase** é o banco de dados (credenciais no `.env`)

### Frontend
- **Next.js** é o framework que compila TypeScript → JavaScript
- **`src/app/`** contém as rotas (Next.js App Router)
- **`src/components/`** contém componentes reutilizáveis
- **`src/lib/api.ts`** faz chamadas HTTP para `http://localhost:8000`
- **Supabase** é acessado via `@supabase/supabase-js`

### Fluxo
1. Usuário acessa `http://localhost:3000` no navegador
2. Frontend (Next.js) renderiza página
3. Usuário carrega arquivo Excel ou preenche formulário
4. Frontend envia para `http://localhost:8000/processar`
5. Backend (FastAPI) processa com `detran_manual.py`
6. Resultado é armazenado em Supabase
7. Frontend busca dados do Supabase para exibir resultados

---

## 📞 TROUBLESHOOTING RÁPIDO

| Erro | Causa | Solução |
|-----|--------|---------|
| `ModuleNotFoundError: playwright` | `requirements.txt` não instalado | `pip install -r requirements.txt` |
| `Connection refused: 8000` | Backend não rodando | `python api_server.py` |
| `Cannot find module 'next'` | `package.json` não instalado | `cd frontend && npm install` |
| `env variables undefined` | `.env` faltando | Criar [arquivo](.env.example) |
| `SUPABASE_URL is required` | Credenciais Supabase faltando | Setar em `.env` |

---

## 📌 CONCLUSÃO

**Mínimo absoluto para funcionar:**

```
3 arquivos Python:
  ✅ requirements.txt
  ✅ api_server.py
  ✅ detran_manual.py

4 arquivos Frontend:
  ✅ package.json
  ✅ next.config.js
  ✅ tsconfig.json
  ✅ src/app/layout.tsx + src/app/page.tsx

2 pastas Frontend:
  ✅ src/app/
  ✅ src/components/ + src/lib/

2 arquivos configuração:
  ✅ .env (backend)
  ✅ .env.local (frontend)

Tudo mais é documentação, utilitários ou dados gerados.
```

**Total de arquivos essenciais: ~30-40 arquivos**
**Arquivos que pode deletar com segurança: ~100+ arquivos**

