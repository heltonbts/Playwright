# 🚀 Guia Completo de Deploy - Vercel + Render

**Data:** 20/02/2026 | **Status:** Pronto para produção

---

## 🎯 Resumo Rápido

| Componente | Plataforma | Limite Grátis | Perfeito Para |
|-----------|-----------|--------------|-------------|
| **Frontend (Next.js)** | ✅ **Vercel** | Unlimited | Deploy automático do GitHub |
| **Backend (Python)** | ✅ **Render** | 750h/mês | API contínua com automação |
| **Banco de Dados** | ✅ **Supabase** | Unlimited | PostgreSQL + Auth |
| ❌ **GitHub Pages** | Static only | - | NÃO funciona (sem backend Python) |

---

## ⚠️ Importante: GitHub Pages NÃO Funciona!

❌ GitHub Pages só hospeda **arquivos estáticos** (HTML, CSS, JS)

❌ **Não pode** rodar Python, Node.js backend, ou qualquer servidor

✅ **Use Vercel para frontend** (melhor escolha)

✅ **Use Render para backend** (suporta Python)

---

## 📋 PASSO A PASSO COMPLETO

### 🔧 PRÉ-REQUISITOS

Você precisa ter:
1. ✅ Conta GitHub (crie em github.com se não tiver)
2. ✅ Código enviado para GitHub (git push)
3. ✅ Conta Supabase (crie em supabase.com)
4. ✅ Credenciais Supabase (**SUPABASE_URL** e **SUPABASE_KEY**)

---

## PARTE 1️⃣: PREPARAR CÓDIGO PARA GITHUB

### Passo 1: Criar repositório GitHub

Se ainda não tem, crie em: https://github.com/new

```powershell
# No seu terminal
cd C:\Users\Samuel\Downloads\detran-main
git init
git add .
git commit -m "Initial commit - DETRAN system"
git branch -M main
git remote add origin https://github.com/SEUUSER/detran-main.git
git push -u origin main
```

### Passo 2: Criar arquivo `.gitignore` (se não tiver)

Adicione na raiz do projeto:

```
# Python
__pycache__/
*.py[cod]
*$py.class
.env
.env.local
.venv/
venv/
result_detran_organizado.xlsx
output.log
*.log

# Node
node_modules/
.next/
dist/
build/

# IDE
.vscode/
.idea/
*.swp

# Dados sensíveis
auth/
```

---

## PARTE 2️⃣: DEPLOY DO FRONTEND (Vercel)

### Passo 1: Criar conta Vercel

1. Acesse: https://vercel.com/signup
2. Clique em **"Continue with GitHub"**
3. Autorize Vercel acessar seu GitHub
4. Pronto! ✅

### Passo 2: Fazer deploy

**Opção A: Via Interface Vercel (Recomendado)**

1. No painel Vercel, clique em **"Add New"** → **"Project"**
2. Selecione o repositório `detran-main` do seu GitHub
3. Configure:
   - **Framework:** `Next.js`
   - **Root Directory:** `detran-main/frontend`
   - Clique **"Deploy"**

4. Aguarde 2-5 minutos

5. Acesse: `https://seu-projeto.vercel.app` ✅

**Opção B: Via Terminal (Vercel CLI)**

```powershell
npm install -g vercel
cd detran-main/frontend
vercel --prod
```

### Passo 3: Configurar Variáveis de Ambiente

No painel Vercel → **Settings** → **Environment Variables**

Adicione:
```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = xxxxxxx
NEXT_PUBLIC_API_URL = (deixar em branco por enquanto)
BACKEND_URL = (mesmo acima)
```

### Passo 4: Redesploy

No painel Vercel → **Deployments** → **Redeploy**

Ou no terminal:
```powershell
vercel --prod
```

---

## PARTE 3️⃣: DEPLOY DO BACKEND (Render)

### Passo 1: Criar conta Render

1. Acesse: https://render.com
2. Clique em **"Sign up"**
3. Escolha **"Continue with GitHub"**
4. Autorize Render
5. Pronto! ✅

### Passo 2: Criar Web Service

1. No painel Render, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub:
   - Procure por `detran-main`
   - Clique em **"Connect"**

### Passo 3: Configurar Build

Preencha os campos:

| Campo | Valor |
|-------|------|
| **Name** | `detran-api` |
| **Environment** | `Python 3` |
| **Build Command** | `pip install -r detran-main/requirements.txt && playwright install chromium && playwright install-deps` |
| **Start Command** | `cd detran-main && python api_server.py` |
| **Region** | Seu país mais próximo |
| **Plan** | `Free` |

### Passo 4: Configurar Variáveis de Ambiente

Clique em **"Environment"** e adicione:

```
SUPABASE_URL = https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY = sua_chave_service_role
PYTHON_VERSION = 3.11.0
```

⚠️ **IMPORTANTE:** Use `SUPABASE_SERVICE_KEY` (chave de servidor), NÃO a chave anônima!

### Passo 5: Deploy

Clique em **"Create Web Service"**

⏳ Aguarde 5-10 minutos (vai lentidão, é normal)

Quando terminar, você verá: ✅ **"Deployed"**

Acesse a URL gerada (tipo: `https://detran-api.onrender.com`)

Teste: `https://detran-api.onrender.com/docs`

---

## PARTE 4️⃣: CONECTAR FRONTEND AO BACKEND

### Passo 1: Obter URL do Render

No painel Render → Selecione seu serviço → Copie a URL

Exemplo: `https://detran-api.onrender.com`

### Passo 2: Atualizar Variáveis Vercel

No painel Vercel → **Settings** → **Environment Variables**

Atualize:
- `NEXT_PUBLIC_API_URL = https://detran-api.onrender.com`
- `BACKEND_URL = https://detran-api.onrender.com`

### Passo 3: Redesploy Vercel

```powershell
vercel --prod
```

Ou no painel Vercel → **Deployments** → **Redeploy**

---

## PARTE 5️⃣: CONFIGURAR CORS DO BACKEND

O backend precisa aceitar requisições do domínio Vercel.

### Editar `api_server.py`

Localize a seção CORS (linhas ~30-40):

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://seu-projeto.vercel.app",  # ← ADICIONAR AQUI
        "*",  # ou remover isso se quiser ser mais restritivo
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Fazer Push

```powershell
git add detran-main/api_server.py
git commit -m "Add Vercel domain to CORS"
git push
```

Render fará redeploy automaticamente ✅

---

## ✅ CHECKLIST FINAL

### Backend (Render)
- [ ] Conta Render criada
- [ ] Repositório GitHub conectado
- [ ] Build Command configurado
- [ ] Start Command: `cd detran-main && python api_server.py`
- [ ] `SUPABASE_URL` adicionado
- [ ] `SUPABASE_SERVICE_KEY` adicionado
- [ ] Deploy concluído
- [ ] URL do Render acessível (verifica `/health`)

### Frontend (Vercel)
- [ ] Conta Vercel criada
- [ ] Repositório GitHub conectado
- [ ] Root Directory: `detran-main/frontend`
- [ ] `NEXT_PUBLIC_SUPABASE_URL` adicionado
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` adicionado
- [ ] `NEXT_PUBLIC_API_URL` = URL do Render
- [ ] Deploy concluído
- [ ] Site acessível em Vercel

### CORS
- [ ] `api_server.py` atualizado com domínio Vercel
- [ ] Render redeployado

---

## 🧪 TESTAR O SISTEMA

### 1️⃣ Verificar Backend

```powershell
# Teste health check
curl https://detran-api.onrender.com/health
# Deve retornar: {"status":"OK"}

# Teste Swagger UI
https://detran-api.onrender.com/docs
```

### 2️⃣ Verificar Frontend

```powershell
# Acesse
https://seu-projeto.vercel.app

# Você deve ver o Dashboard
# Se sim, parabéns! 🎉
```

### 3️⃣ Testar Integração

1. No dashboard, clique em "Nova Consulta"
2. Preencha dados de um veículo
3. Clique em "Processar"
4. Verifique se aparece "Processando..." e depois resultados

---

## 🔌 ALTERNATIVAS PARA BACKEND

Se Render não funcionar bem, teste:

### Option 1: **Railway** ⭐ Excelente
- https://railway.app
- Melhor UX que Render
- Mesmo plano grátis
- Deploy direto do GitHub

### Option 2: **PythonAnywhere** (mais específico para Python)
- https://www.pythonanywhere.com
- UI mais antiga
- Plano grátis limitado

### Option 3: **AWS Elastic Beanstalk**
- Poderoso mas complexo
- 750h grátis por mês

---

## 📊 ARQUITETURA FINAL

```
┌─────────────────────────────────────────────────────────────┐
│                        SEU USUÁRIO                          │
│         (Acessando sua-app.vercel.app no navegador)         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────┐
        │    VERCEL (Frontend Next.js)    │
        │    sua-app.vercel.app           │
        │  ✅ Static + Dynamic Routes     │
        │  ✅ React Components            │
        │  ✅ Tailwind + MUI              │
        └──────────┬──────────────────────┘
                   │ (HTTP Requests)
                   ▼
        ┌─────────────────────────────────┐
        │  RENDER (Backend FastAPI)       │
        │  detran-api.onrender.com        │
        │  ✅ API Endpoints               │
        │  ✅ Automação Playwright        │
        │  ✅ Processamento de dados      │
        └──────────┬──────────────────────┘
                   │ (SQL Queries)
                   ▼
        ┌─────────────────────────────────┐
        │    SUPABASE (Database)          │
        │    PostgreSQL + Real-time       │
        │  ✅ Multas                      │
        │  ✅ Veículos                    │
        │  ✅ Consultas                   │
        └─────────────────────────────────┘
```

---

## ⚡ DICAS DE PERFORMANCE

### 🚀 Evitar sleep do Render

Render coloca apps em sleep se não receber requisições em 15 minutos. Para evitar:

1. Configure um Keep-Alive:

```python
# No backend, adicione em api_server.py:
@app.get("/health")
def health_check():
    return {"status": "OK"}
```

2. Configure monitoramento no painel Render:
   - **Settings** → **Health Check Path** → `/health`

### 📈 Otimizar Build

O build pode demorar por causa do Playwright. Para agilizar:

1. Use binários pré-compilados:
```bash
playwright install chromium
playwright install-deps
```

2. Use image Docker otimizada (avançado):
Criar `Dockerfile` customizado.

---

## 🆘 TROUBLESHOOTING

### ❌ "Backend not responding"
- [ ] Verificar variáveis de ambiente no Render
- [ ] Verificar CORS em `api_server.py`
- [ ] Render está "spinning up"? Aguarde 30s

### ❌ "404 not found"
- [ ] Verificar URL correta da API em Vercel
- [ ] Verificar `NEXT_PUBLIC_API_URL`

### ❌ "Database connection failed"
- [ ] Verificar `SUPABASE_URL` e `SUPABASE_KEY`
- [ ] Verificar se é chave de **serviço** (não anônima)

### ❌ Playwright timeout no Render
- [ ] Aumentar timeout em `detran_manual.py`
- [ ] Render pode estar com recursos limitados

---

## 📞 LINKS ÚTEIS

| Recurso | Link |
|---------|------|
| Vercel | https://vercel.com |
| Render | https://render.com |
| Supabase | https://supabase.com |
| Docs Vercel | https://vercel.com/docs |
| Docs Render | https://render.com/docs |
| Railway (alternativa) | https://railway.app |

---

## 🎓 EXPLICAÇÃO TÉCNICA

### Por que Vercel + Render?

**Frontend (Vercel):**
- Otimizado para Next.js
- Deploy automático ao fazer push no GitHub
- Edge Functions para performance
- SSL grátis
- Plano free excelente

**Backend (Render):**
- Suporta Python nativo
- Executa scripts/bots (Playwright)
- Free tier com 750h/mês (suficiente)
- Deploy automático do GitHub
- Variáveis de ambiente seguras

**Banco (Supabase):**
- PostgreSQL gerenciado
- Auth integrada
- Real-time subscriptions
- Plano free generoso

### Fluxo de Requisição
1. Usuário acessa `https://seu-app.vercel.app`
2. Next.js renderiza a página (no navegador)
3. Usuário clica em "Processar"
4. Frontend faz POST para `https://detran-api.onrender.com/processar`
5. Backend executa Playwright (consulta DETRAN)
6. Backend salva em Supabase
7. Frontend busca dados do Supabase para exibir

---

## 🎉 PRÓXIMAS AÇÕES

Depois de fazer deploy:

1. ✅ Adicionar domain customizado (opcional)
2. ✅ Configurar SSL/HTTPS (automático)
3. ✅ Monitorar logs (Render → Logs)
4. ✅ Configurar alertas (Render → Alerts)
5. ✅ Documentar credenciais em lugar seguro

---

## 📌 TL;DR

```powershell
# 1. Enviar para GitHub
git push

# 2. Vercel (Frontend)
# Via Web: conectar GitHub → Deploy automático

# 3. Render (Backend)
# Via Web: conectar GitHub → Deploy automático

# 4. Configurar Variáveis de Ambiente em ambas plataformas

# 5. Atualizar CORS em api_server.py
# Fazer push → Render redeploy automático

# 6. Testar: https://seu-app.vercel.app ✅
```

Pronto! Sua aplicação está no ar 🚀
