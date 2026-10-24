# RELATÓRIO DE AUDITORIA DE ARQUIVOS E LIMPEZA SEGURA (`FILE_CLEANUP_REPORT.md`)
> **Projeto:** QG Barber v2.0.0 (Reconstrução e Modernização)  
> **Engenharia de Software:** Auditoria de Dependências, Rastreabilidade e Higienização do Repositório  
> **Data:** 24 de Outubro de 2026 | **Modo:** Somente Leitura e Análise (Sem Ações Destrutivas)

---

## 1. VISÃO GERAL DO PROJETO E INVENTÁRIO

A auditoria completa da raiz do projeto identificou **63 itens** (5 diretórios e 58 arquivos na raiz).

A aplicação web oficial reconstruída opera com a stack moderna **Vite + React 18 + TypeScript + Tailwind CSS**, possuindo como fonte única da verdade dos dados de negócio o módulo [`src/data/barbershop.data.ts`](file:///c:/Users/AMD/Documents/AntiGravity/QGB/src/data/barbershop.data.ts) e como repositório de mídia estática a pasta [`public/QG Barber - Images/`](file:///c:/Users/AMD/Documents/AntiGravity/QGB/public/QG%20Barber%20-%20Images/).

Nenhum arquivo fora de `src/`, `public/`, `index.html` e dos arquivos de configuração de compilação (`vite.config.ts`, `tsconfig.json`, `package.json`, `tailwind.config.js`) é importado ou utilizado durante a execução (`npm run dev`), build de produção (`npm run build`) ou publicação do site.

---

## 2. CRITÉRIOS DE CLASSIFICAÇÃO

Cada arquivo e pasta foi enquadrado rigorosamente em uma das 5 categorias solicitadas:

- **Categoria A — Essencial:** Necessário para compilação, execução local, testes, build, publicação e documentação de arquitetura.
- **Categoria B — Referência / Preservação:** Dados brutos originais do negócio, dumps da API e backups que comprovam a integridade dos dados e devem ser preservados/arquivados.
- **Categoria C — Temporário:** Scripts Node.js (`.js`, `.cjs`) de uso único criados exclusivamente durante a auditoria técnica e engenharia reversa.
- **Categoria D — Duplicado ou Obsoleto:** Cópias parciais, dumps intermediários e fragmentos de texto gerados por scripts que duplicam dados já contidos no backup principal.
- **Categoria E — Incerto:** Arquivos cuja finalidade não pôde ser determinada com segurança.

---

## 3. TABELA COMPLETA DE INVENTÁRIO E CLASSIFICAÇÃO

### A. Estrutura de Diretórios

| Caminho da Pasta | Finalidade | Categoria | Dependências Encontradas | Justificativa |
|---|---|:---:|---|---|
| `src/` | Código-fonte TypeScript/React da plataforma reconstruída | **A** | Todo o app (`main.tsx`, `App.tsx`, componentes, dados, estilos) | **Essencial:** Contém toda a lógica, UI, páginas, modais e regras da aplicação v2.0. |
| `public/` | Ativos estáticos públicos e imagens reais da barbearia | **A** | `logo.jpeg`, `QG Barber - Images/`, `robots.txt`, `sitemap.xml` | **Essencial:** Servido diretamente pelo Vite e copiado integralmente para `dist/`. |
| `dist/` | Pacote compilado e otimizado gerado pelo `npm run build` | **A** | Servidores de hospedagem (Vercel, Netlify, Firebase, Nginx) | **Essencial:** Diretório de entrega final estática pronta para produção. |
| `node_modules/` | Dependências instaladas via npm | **A** | `package.json`, React, Tailwind, Vite, TypeScript | **Essencial:** Bibliotecas de tempo de execução e desenvolvimento. |
| `.agents/` | Configurações locais de agentes e skills do Antigravity | **A** | `.agents/skills/website-audit/` | **Essencial:** Diretório do ambiente de agentes de desenvolvimento. |

---

### B. Arquivos de Configuração e Build (Categoria A — Essencial)

| Arquivo | Tamanho | Categoria | Dependências | Justificativa |
|---|---|:---:|---|---|
| `package.json` | 693 B | **A** | `npm`, Vite, TypeScript | **Essencial:** Manifesto de dependências e scripts do projeto. |
| `package-lock.json` | 95.8 KB | **A** | `npm` | **Essencial:** Trava de integridade e versões das dependências npm. |
| `tsconfig.json` | 608 B | **A** | Compilador TypeScript (`tsc`) | **Essencial:** Configuração estrita de compilação da aplicação `src/`. |
| `tsconfig.node.json` | 213 B | **A** | Compilador TypeScript (`tsc`) | **Essencial:** Configuração de tipos para arquivos de build (`vite.config.ts`). |
| `vite.config.ts` | 184 B | **A** | Vite, `@vitejs/plugin-react` | **Essencial:** Configuração de bundling e servidor de desenvolvimento. |
| `tailwind.config.js` | 1.7 KB | **A** | Tailwind CSS, `src/styles/` | **Essencial:** Design system e paleta oficial da QG Barber (Midnight, Ametista, etc.). |
| `postcss.config.js` | 80 B | **A** | PostCSS, Autoprefixer | **Essencial:** Pipeline de compilação de CSS. |
| `index.html` | 4.8 KB | **A** | Vite, navegadores | **Essencial:** Entrypoint HTML, SEO, OpenGraph e Schema.org JSON-LD `BarberShop`. |

---

### C. Documentação Arquitetural e Entrega (Categoria A — Essencial)

| Arquivo | Tamanho | Categoria | Dependências | Justificativa |
|---|---|:---:|---|---|
| `IMPLEMENTATION_PLAN.md` | 14.6 KB | **A** | Equipe de engenharia | **Essencial:** Plano mestre de reconstrução, matriz de melhorias e rastreabilidade inicial. |
| `IMPLEMENTATION_REPORT.md` | 25.8 KB | **A** | Equipe de engenharia | **Essencial:** Relatório final consolidado de entrega técnica com 19 seções. |
| `IMAGE_REFERENCE_MAP.md` | 10.8 KB | **A** | Equipe de design/dev | **Essencial:** Mapa completo de correspondência dos 48 arquivos visuais oficiais. |
| `FILE_CLEANUP_REPORT.md` | *Este doc* | **A** | Governança de código | **Essencial:** Registro formal de governança, inventário e planejamento de limpeza segura. |

---

### D. Backups Originais e Dados de Auditoria (Categoria B — Referência / Preservação)

> **ATENÇÃO:** Esses arquivos guardam a história do site auditado. Embora a nova aplicação não dependa deles em tempo de execução (já que os dados foram transferidos para `barbershop.data.ts`), eles constituem o **lastro de verdade** do projeto e NÃO devem ser excluídos definitivamente. Devem ser preservados ou movidos para uma pasta `archive/`.

| Arquivo | Tamanho | Categoria | Conteúdo / Origem | Justificativa |
|---|---|:---:|---|---|
| `backup_full.json` | 5.09 MB | **B** | Export integral da API legada | **Máxima Prioridade:** Contém 237 clientes, 683 agendamentos históricos, slots de agenda e regras comerciais. |
| `services.json` | 1.89 MB | **B** | Dump de serviços da API legada | Prova documental dos 15 serviços e seus preços originais. |
| `barbers.json` | 522 KB | **B** | Dump de barbeiros da API legada | Prova documental dos profissionais Felipe e Bruno. |
| `settings.json` | 148 KB | **B** | Configurações institucionais | Dados de endereço, redes sociais e configurações da barbearia. |
| `gallery.json` | 2.09 MB | **B** | Dump da galeria legada | Registro original das fotos em base64 da barbearia. |
| `js_bundle.js` | 761 KB | **B** | Bundle JS de produção legado | Arquivo minificado que serviu de fonte para toda a engenharia reversa. |
| `css_bundle.css` | 70.8 KB | **B** | Folha CSS de produção legada | Folha de estilos original do site auditado. |

---

### E. Scripts Temporários de Auditoria (Categoria C — Temporário / Candidatos à Remoção Segura)

Estes arquivos foram desenvolvidos sob demanda durante o processo de auditoria para investigar APIs, desminificar trechos, cruzar hashes e inspecionar bancos. **Nenhum deles é referenciado pelo site atual nem por scripts do `package.json`.**

| Arquivo | Tamanho | Categoria | Finalidade no Processo | Risco de Remoção |
|---|---|:---:|---|:---:|
| `analyze_availability.js` | 933 B | **C** | Analisou slots de horário no `backup_full.json` | **Nulo** |
| `analyze_booking.js` | 998 B | **C** | Inspecionou fluxo de agendamento no bundle JS | **Nulo** |
| `analyze_bundle_deep.js` | 1.7 KB | **C** | Buscou regex de componentes no bundle JS | **Nulo** |
| `analyze_css.js` | 755 B | **C** | Extraiu paleta de cores hexadecimais do CSS legado | **Nulo** |
| `analyze_frontend_views.js` | 1.2 KB | **C** | Mapeou nomes de componentes no bundle JS | **Nulo** |
| `analyze_images.cjs` | 1.0 KB | **C** | Listou campos de imagem no `backup_full.json` | **Nulo** |
| `check_details.cjs` | 599 B | **C** | Checou fotos dos barbeiros e galeria | **Nulo** |
| `check_duration.js` | 647 B | **C** | Verificou durações nominais dos serviços | **Nulo** |
| `check_sections.cjs` | 523 B | **C** | Inspecionou nós JSX em `extracted_sections.json` | **Nulo** |
| `compare_hashes.cjs` | 3.8 KB | **C** | Comparou hashes MD5 das imagens com os arquivos locais | **Nulo** |
| `derive_durations.js` | 1.1 KB | **C** | Calculou durações médias reais de 683 agendamentos | **Nulo** |
| `dump_all_ids.js` | 1.8 KB | **C** | Extraiu lista de IDs para verificação de chaves | **Nulo** |
| `dump_backup_images.cjs` | 978 B | **C** | Gerou o arquivo `backup_images_summary.json` | **Nulo** |
| `dump_full_sections.js` | 1.1 KB | **C** | Extraiu seções HTML brutas do bundle JS | **Nulo** |
| `dump_step_5_6.js` | 415 B | **C** | Extraiu o formulário das etapas 5 e 6 do wizard | **Nulo** |
| `extract_booking.js` | 583 B | **C** | Extraiu a função de reserva do bundle JS | **Nulo** |
| `extract_info.js` | 1.6 KB | **C** | Extraiu telefones, e-mails e contatos | **Nulo** |
| `extract_monthly.js` | 630 B | **C** | Extraiu textos do Clube QG do bundle JS | **Nulo** |
| `extract_section_texts.js` | 1.1 KB | **C** | Extraiu títulos e parágrafos institucionais | **Nulo** |
| `extract_whatsapp.js` | 550 B | **C** | Extraiu números de WhatsApp do bundle JS | **Nulo** |
| `find_api.js` | 577 B | **C** | Mapeou rotas da API no bundle JS | **Nulo** |
| `find_data.js` | 1.3 KB | **C** | Buscou estruturas de dados JSON no bundle JS | **Nulo** |
| `generate_inventory.cjs` | 450 B | **C** | Script auxiliar para catalogar os arquivos da raiz | **Nulo** |
| `get_backup.js` | 1.1 KB | **C** | Efetuou o download do `backup_full.json` via token | **Nulo** |
| `inspect_backup_details.js` | 1.7 KB | **C** | Mapeou produtos e usuários no backup | **Nulo** |
| `inspect_gallery.cjs` | 438 B | **C** | Contou imagens por categoria no `gallery.json` | **Nulo** |
| `inspect_json_data.js` | 2.6 KB | **C** | Inspecionou dados de agendamentos e status | **Nulo** |
| `inspect_json_files.cjs` | 686 B | **C** | Inspecionou `barbers.json` e `settings.json` | **Nulo** |
| `match_images.cjs` | 581 B | **C** | Varreu os arquivos em `public/QG Barber - Images/` | **Nulo** |
| `read_sections.js` | 732 B | **C** | Leu dumps de seções extraídas | **Nulo** |
| `test_auth.js` | 2.3 KB | **C** | Testou endpoints de login e validação de token | **Nulo** |

---

### F. Dumps e Fragmentos Intermediários (Categoria D — Duplicado ou Obsoleto)

Arquivos gerados pelos scripts acima que contêm fragmentos parciais ou cópias brutas de informações já sintetizadas ou já existentes no `backup_full.json`:

| Arquivo | Tamanho | Categoria | Conteúdo | Justificativa | Risco |
|---|---|:---:|---|---|:---:|
| `analyze_images.js` | 1.0 KB | **D** | Script `.js` inicial que falhou por incompatibilidade com `"type": "module"`. | Substituído por `analyze_images.cjs`. Obsoleto. | **Nulo** |
| `backup_images_summary.json` | **4.12 MB** | **D** | Cópia redundante das imagens base64 já existentes no `backup_full.json`. | Pesa mais de 4 MB sem acrescentar dados novos. | **Nulo** |
| `all_ids.json` | 6.8 KB | **D** | Lista de IDs de usuários e serviços extraídos do banco. | Dados já contidos no backup e em `barbershop.data.ts`. | **Nulo** |
| `book_appointment_context.txt` | 8.0 KB | **D** | Fragmento de texto extraído do `js_bundle.js`. | Texto já incorporado em `BookingWizardModal.tsx`. | **Nulo** |
| `booking_wizard_full.txt` | 13.5 KB | **D** | Trecho desminificado do wizard legado. | Lógica já reimplementada em `BookingWizardModal.tsx`. | **Nulo** |
| `extracted_sections.json` | 28.2 KB | **D** | Dumps JSX das seções legadas. | Seções já reconstruídas em componentes React. | **Nulo** |
| `extracted_strings.json` | 6.8 KB | **D** | Dicionário de strings isoladas do bundle. | Textos já incorporados em `barbershop.data.ts`. | **Nulo** |
| `monthly_plan_full.txt` | 6.0 KB | **D** | Trecho textual do Clube QG extraído do bundle. | Benefícios já integrados em `MonthlyPlanSection.tsx`. | **Nulo** |
| `sections_dump.txt` | 13.6 KB | **D** | Dumps de marcação HTML do site legado. | Layout já reconstruído nos componentes de seção. | **Nulo** |

---

### G. Categoria E — Incerto

* **Resultado:** **Zero arquivos na categoria E.**  
A análise de engenharia reversa identificou e rastreou 100% da finalidade de cada um dos arquivos presentes no repositório.

---

## 4. PLANO DE HIGIENIZAÇÃO E LIMPEZA SEGURA

Para manter o repositório limpo, profissional e leve, recomenda-se uma estratégia de higienização dividida em **2 fases**, garantindo que nenhum dado histórico seja destruído.

### Etapa Prévia de Segurança (Proteção Absoluta dos Dados)
1. Antes de qualquer exclusão definitiva de scripts ou dumps, criar uma pasta de arquivo:
   `archive/audit_source_data/`
2. Mover para essa pasta os **7 arquivos de lastro histórico (Categoria B)**:
   - `backup_full.json`
   - `services.json`
   - `barbers.json`
   - `settings.json`
   - `gallery.json`
   - `js_bundle.js`
   - `css_bundle.css`
3. Dessa forma, a raiz do repositório fica limpa, o peso do projeto no controle de versão diminui, e os dados brutos continuam salvos e acessíveis para consultas futuras.

---

### Fase 1: Arquivos Candidatos à Remoção Imediata (Risco Nulo — Economia de ~4.2 MB)

São arquivos gerados temporariamente que não contêm lógica única e são 100% redundantes:

1. `backup_images_summary.json` (4.12 MB) — Duplicata das imagens em base64 do `backup_full.json`.
2. `analyze_images.js` (1.0 KB) — Script com erro de módulo CommonJS substituído pelo `.cjs`.
3. `all_ids.json` (6.8 KB) — Lista intermediária de IDs já consolidados.
4. `book_appointment_context.txt` (8.0 KB) — Fragmento de texto legado.
5. `booking_wizard_full.txt` (13.5 KB) — Fragmento de código legado.
6. `extracted_sections.json` (28.2 KB) — Dump intermediário de seções.
7. `extracted_strings.json` (6.8 KB) — Strings brutas já migradas.
8. `monthly_plan_full.txt` (6.0 KB) — Fragmento de texto legado.
9. `sections_dump.txt` (13.6 KB) — Dump de marcação legada.

**Como validar antes da remoção:**  
Executar `npm run build` e confirmar que a compilação ocorre com exit code 0 e sem warnings.

---

### Fase 2: Scripts de Extração da Auditoria (Risco Nulo — Higienização de 31 Scripts)

Estes 31 scripts foram criados durante a auditoria para inspecionar o site legado. Como a nova plataforma já está implementada, testada e em execução em `http://localhost:3000/`, esses scripts cumpriram seu ciclo de vida:

`analyze_availability.js`, `analyze_booking.js`, `analyze_bundle_deep.js`, `analyze_css.js`, `analyze_frontend_views.js`, `analyze_images.cjs`, `check_details.cjs`, `check_duration.js`, `check_sections.cjs`, `compare_hashes.cjs`, `derive_durations.js`, `dump_all_ids.js`, `dump_backup_images.cjs`, `dump_full_sections.js`, `dump_step_5_6.js`, `extract_booking.js`, `extract_info.js`, `extract_monthly.js`, `extract_section_texts.js`, `extract_whatsapp.js`, `find_api.js`, `find_data.js`, `generate_inventory.cjs`, `get_backup.js`, `inspect_backup_details.js`, `inspect_gallery.cjs`, `inspect_json_data.js`, `inspect_json_files.cjs`, `match_images.cjs`, `read_sections.js`, `test_auth.js`.

---

## 5. ESTRUTURA RESULTANTE DO PROJETO APÓS A LIMPEZA

Com a execução da limpeza segura e arquivamento dos backups, a raiz do projeto QGB Barber apresentará um padrão de excelência de arquitetura limpa:

```
QGB/
├── .agents/                     # Configurações de agentes Antigravity
├── archive/                     # Pasta de preservação histórica
│   └── audit_source_data/       # backup_full.json, js_bundle.js, dumps originais da API
├── dist/                        # Build de produção otimizado para deploy
├── public/                      # Imagens reais oficiais da QG Barber e assets públicos
├── src/                         # Código-fonte da aplicação React + TypeScript
│   ├── components/              # Layout, seções, modais, painéis e wizard de agendamento
│   ├── data/                    # barbershop.data.ts (fonte única da verdade)
│   ├── styles/                  # index.css (tokens de design)
│   ├── types/                   # index.ts (interfaces de domínio)
│   ├── App.tsx
│   └── main.tsx
├── index.html                   # Entrypoint com SEO e Schema.org JSON-LD
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── IMPLEMENTATION_PLAN.md       # Documentação arquitetural
├── IMPLEMENTATION_REPORT.md     # Documentação de entrega técnica
├── IMAGE_REFERENCE_MAP.md       # Mapeamento oficial dos 48 ativos visuais
└── FILE_CLEANUP_REPORT.md       # Este relatório de auditoria e governança
```

---

## 8. REGISTRO DE EXECUÇÃO DA LIMPEZA (Concluído com Sucesso)

- **Autorização do Usuário:** Recebida em 24/10/2026.
- **Ações Executadas:**
  1. **Preservação de Dados (Categoria B):**
     - Criado diretório `archive/audit_source_data/`.
     - Movidos com sucesso os 7 arquivos de referência (`backup_full.json`, `services.json`, `barbers.json`, `settings.json`, `gallery.json`, `js_bundle.js`, `css_bundle.css`).
  2. **Exclusão Segura (Categorias C e D):**
     - Excluídos com sucesso 31 scripts temporários de auditoria (Categoria C).
     - Excluídos com sucesso 9 arquivos de dump e extração obsoletos (Categoria D).
     - Total de arquivos removidos: **40 arquivos**.
  3. **Validação de Integridade do Build:**
     - Executado `npm run build` (`tsc && vite build`).
     - **Resultado:** 100% de sucesso em 4.38s, gerando `dist/` perfeitamente otimizado e sem nenhum erro.
  4. **Servidor Local de Desenvolvimento:**
     - Mantido ativo e respondendo normalmente em `http://localhost:3000/`.

---
**Fim do Relatório de Auditoria e Limpeza.**
