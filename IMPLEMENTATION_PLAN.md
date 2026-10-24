# PLANO DE IMPLEMENTAÇÃO E RECONSTRUÇÃO — QG BARBER (`IMPLEMENTATION_PLAN.md`)

Este documento consolida as especificações técnicas, dados comerciais extraídos na auditoria, mapeamento de melhorias e plano de execução para a reconstrução completa do site da **QG Barber** (`https://qgbarber.ai.studio/`).

---

## A. INVENTÁRIO DE INFORMAÇÕES FACTUAIS E COMERCIAIS

### 1. Identidade e Dados do Estabelecimento
* **Nome Fantasia:** QG Barber
* **Descrição Oficial:** *"Corte, barba e estilo com precisão. A QG Barber é o seu espaço para renovar o visual com atendimento de qualidade e ambiente pensado pra você."*
* **Endereço:** Rua Orlando Tarquinio, 129 - Sacomã, São Paulo - SP, CEP: 04296-110
* **WhatsApp Oficial:** +55 (11) 97833-4717 (`5511978334717`)
* **Instagram Oficial:** `@_qgbarber_`
* **Google Maps Link:** Perfil verificado da QG Barber no Sacomã/SP
* **Horários de Funcionamento (Regras Auditadas do Banco):**
  * Segunda a Sexta: 08:30 às 18:30 (com slots estendidos até 20:00/20:30 em picos)
  * Sábado: 08:30 às 15:00 / 16:00 (com aberturas especiais matutinas a partir de 06:30)
  * Domingo: Fechado (sem slots)
* **Fonte:** Arquivos `settings.json`, `backup_full.json` (tabela `settings` e `availability`).

### 2. Catálogo Oficial dos 15 Serviços e Preços Exatos (R$)
| ID | Nome do Serviço | Preço Oficial | Duração Operacional Medida | Categoria |
|---|---|---|---|---|
| `srv-1788658109981-0tfn` | Cabelo + Barba (combo) | R$ 60,00 | 60 min | Combos Promocionais |
| `srv-1788889406018-vypb` | Cabelo + Sobrancelha (combo) | R$ 45,00 | 30 min | Combos Promocionais |
| `srv-1` | Cabelo | R$ 35,00 | 30 min | Cortes |
| `srv-2` | Barba | R$ 35,00 | 30 min | Barboterapia |
| `srv-1788658278790-5r00` | Nevou | R$ 125,00 | 70 min | Química & Descoloração |
| `srv-1788658199741-b1rz` | Alisamento | R$ 95,00 | 60 min | Química & Alinhamento |
| `srv-1787276818975-ahd4` | Luzes | R$ 90,00 | 60 min | Coloração & Mechas |
| `srv-1788658227985-gga2` | Botox | R$ 75,00 | 50 min | Tratamento Capilar |
| `srv-1788658167242-1fs0` | Hidratação | R$ 25,00 | 20 min | Tratamento Capilar |
| `srv-1788658381377-kk7n` | Pigmentação | R$ 25,00 | 20 min | Acabamentos & Cor |
| `srv-1788658352074-k7iq` | Penteado | R$ 20,00 | 20 min | Finalização & Penteado |
| `srv-1787018103374-sspw` | Cavanhaque | R$ 15,00 | 10 min | Barba |
| `srv-1787276844471-23y1` | Freestyle | R$ 10,00 | 10 min | Acabamento Artístico |
| `srv-1786933264068-cmho` | Sobrancelha | R$ 10,00 | 10 min | Acabamento Facial |
| `srv-3` | Bigode | R$ 5,00 | 5 min | Acabamento Facial |
* **Fonte:** `services.json`, `backup_full.json` (tabela `services` e análise de 683 agendamentos históricos).

### 3. Profissionais Barbeiros
* **Felipe:** Ativo, Telefone: `(11) 97833-4717`, E-mail: `fefemarquessp@gmail.com`, 15 serviços habilitados.
* **Bruno:** Ativo, Telefone: `(11) 99532-8416`, E-mail: `bruxx11102000@gmail.com`, 15 serviços habilitados.
* **Fonte:** `barbers.json`, `backup_full.json` (tabela `barbers` e `barber_services`).

### 4. Linha de Produtos Cosméticos (Piratas For Men)
1. Shampoo Piratas For Men
2. Condicionador Piratas For Men
3. Blend-Turbo Hair Piratas For Men
4. Pomada Black Piratas For Men
5. Pomada Extra Forte Piratas for Men
6. Pomada Caramelo Piratas For Men
* **Condição:** Produtos comercializados no estabelecimento; adicionados com indicação de reserva no agendamento.
* **Fonte:** `gallery.json` e `backup_full.json`.

### 5. Plano Mensal (Clube QG - Exclusivo QG Barber)
* **Benefício 1 (Principal Vantagem):** Atendimento personalizado e direto (comunicação direta com o barbeiro, avisos de novidades e promoções).
* **Benefício 2:** Exclusividade (prioridade na escolha dos melhores horários antes dos clientes avulsos).
* **Benefício 3:** Recorrência (reserva de dia e horário fixo na agenda semanal ou quinzenal).
* **Benefício 4:** Renovação mensal (continuidade simplificada dos benefícios).
* **Chamada Comercial:** Informações & Adesão — *"Converse diretamente no seu próximo atendimento para conhecer detalhes e valores. Consulte o seu barbeiro."*
* **Fonte:** `extracted_sections.json` (`id:"monthly-plan-section"` e componente `B_`).

### 6. Políticas e Termos
* **LGPD / Termo de Consentimento:** *"Concordo com a utilização das informações preenchidas (nome, número e e-mail) para criação da conta e realização de agendamentos."*
* **Cancelamento:** Até 2 horas de antecedência através do painel "Meus Agendamentos" ou WhatsApp do barbeiro.

---

## B. MATRIZ DE MELHORIAS

| Problema identificado na auditoria | Evidência na auditoria | Solução proposta | Arquivo ou componente afetado | Critério de conclusão |
|---|---|---|---|---|
| **SEO: Title e Meta Description inadequados** | `<title>Sistema de Agendamento para Barbearia</title>` focado em SaaS e sem dados de geolocalização. | Atualizar `<title>` para *"QG Barber \| Barbearia no Sacomã - São Paulo - SP \| Agendamento Online"*, meta description focada em conversão local e Schema.org JSON-LD `BarberShop`. | `index.html`, `src/config/seo.ts` | Meta tags presentes no DOM e JSON-LD válido verificado. |
| **Performance: Imagens em Base64 nos JSONs** | `services.json` (1.89 MB) e `gallery.json` (2.09 MB) com strings Base64 infladas. | Otimizar imagens com URLs limpas, WebP, `srcset` e carregamento assíncrono com placeholder elegante. | `src/data/barbershop.data.ts`, `src/components/sections/` | Bundle e requisições leves, sem travamento de renderização. |
| **Acessibilidade: Contraste insuficiente** | Texto `#6a6a70` em fundo `#F8F7FA` atinge apenas 3.8:1 em tamanhos pequenos (10-11px). | Ajustar cor secundária para tom mais denso `#4A4A52` e definir tamanho mínimo de 12px para rótulos. | `src/styles/theme.css`, `tailwind.config.js` | Taxa de contraste >= 4.5:1 (WCAG AA). |
| **Acessibilidade: Modais sem Light Dismiss nativo** | Modais utilizavam apenas detecção manual de cliques sem suporte ao elemento `<dialog closedby="any">`. | Implementar padrão do modern web guidance com `<dialog closedby="any">`, suporte a `Esc`, e focus trap acessível. | `src/components/common/Modal.tsx` | Fechamento por clique fora, Esc e leitor de tela funcional. |
| **Conversão: Produtos sem opção de reserva** | Pomadas e shampoos exibidos na galeria sem valores e sem interação de compra. | Adicionar vitrine de produtos com descrições, preços sugeridos de balcão e botão "Adicionar ao Agendamento". | `src/components/sections/ProductsSection.tsx` | Usuário pode selecionar produto para retirar durante o corte. |
| **Segurança: Credenciais de teste no bundle** | Função `quickLogin` expunha `administrador@qgbarber.com` com senha visível no JS público. | Remover credenciais hardcoded do código cliente e isolar formulário de autenticação estrito. | `src/context/AuthContext.tsx` | Nenhuma senha ou credencial exposta no código-fonte. |
| **Responsividade: Nomes longos quebrando preço** | Serviços compostos como *"Cabelo + Sobrancelha (combo)"* empurravam cards no mobile. | Aplicar flexbox adaptável com `justify-between` e dimensionamento fluido de tipografia (`clamp`). | `src/components/sections/ServicesSection.tsx` | Visualização perfeita em 320px, 375px, 768px e 1280px. |

---

## C. MAPEAMENTO DE CONTEÚDO (PÁGINA ORIGINAL x NOVA VERSÃO)

| Página / Seção Original | Seção Reconstruída | Conteúdo Preservado | Conteúdo Reorganizado / Melhorado | Funcionalidades |
|---|---|---|---|---|
| Navbar (`header nav`) | `Navbar.tsx` | Logo oficial, links Início, Serviços, Resultados, Produtos, Clube QG, Contato. | Layout mais arejado, badge de status aberto/fechado em tempo real, suporte mobile touch drawer. | Navegação suave por âncoras, alternância de painéis e botão de agendamento em destaque. |
| Hero Section (`#hero-section`) | `HeroSection.tsx` | Nome QG Barber, descrição oficial da marca, imagem da logo oficial. | Design premium com acabamento escuro sofisticado (*dark luxurious*), selos de garantia e botão de ação imediata. | CTA para abrir modal de agendamento diretamente no Step 1. |
| Sobre (`#about-section`) | `AboutSection.tsx` | Pilares: Qualidade, Pontualidade e Ambiente. | Apresentação em cards com micro-interações, ícones modernos e destaque para atendimento no Sacomã. | Efeito hover com elevação suave. |
| Serviços (`#services-section`) | `ServicesSection.tsx` | Todos os 15 serviços com nomes e preços originais em R$. | Filtros por categoria (Combos, Cortes, Barba, Química, Tratamento), tempo estimado do procedimento visível. | Botão "Agendar Este" pré-seleciona o serviço no assistente de reserva. |
| Barbeiros (`#barbers-section`) | `BarbersSection.tsx` | Barbeiros Felipe e Bruno com telefones de contato. | Cards profissionais com badges de especialista e botão direto de WhatsApp individual. | Redirecionamento para WhatsApp com mensagem oficial contextualizada. |
| Plano Mensal (`#monthly-plan-section`) | `MonthlyPlanSection.tsx` | 4 benefícios do Clube QG (Atendimento Direto, Exclusividade, Recorrência, Renovação). | Layout de cartões com destaque visual para a "Principal Vantagem" e chamada para consulta presencial. | Botão de contato direto para tirar dúvidas sobre o plano. |
| Resultados (`#gallery-section`) | `GallerySection.tsx` | Fotos reais de cortes e transformações extraídas da galeria. | Grid moderno com zoom modal e filtros de visualização. | Modal de visualização ampliada com fechamento acessível. |
| Produtos (`#products-gallery-section`) | `ProductsSection.tsx` | 6 cosméticos da linha *Piratas For Men*. | Apresentação organizada em vitrine de autocuidado com benefícios de cada produto. | Opção de incluir produto na reserva de atendimento. |
| Contato & Local (`#contact-section`) | `ContactSection.tsx` | Endereço completo, mapa, Instagram, WhatsApp. | Integração de mapa interativo, botão de copiar endereço e rotas no Waze/Google Maps. | Ações de cópia com feedback toast e clique para rotas. |
| Assistente de Reserva (`#booking-wizard-modal`) | `BookingModal.tsx` | 6 etapas: 1. Serviços, 2. Barbeiro, 3. Data, 4. Horário, 5. Dados/Confirmação, 6. Sucesso. | Cálculo automático em tempo real de soma de preços e tempos, calendário fluido, seleção de horários disponíveis. | Geração de resumo e envio de confirmação. |

---

## D. PRIORIZAÇÃO DE TAREFAS

* **P0 (Bloqueadores & Preservação Integral):**
  - Configuração do projeto limpo (Vite + React + Tailwind + TypeScript).
  - Centralização de todos os 15 serviços e preços oficiais em `src/data/barbershop.data.ts`.
  - Preservação de Felipe e Bruno e dados de contato reais.
  - Implementação do assistente de agendamento em 6 etapas com cálculo dinâmico.
* **P1 (Navegação, Seções Públicas & Conversão):**
  - Implementação da Navbar e Drawer Mobile responsivo.
  - Seções Hero, Sobre, Serviços, Equipe, Clube QG, Galeria, Produtos, Contato e Rodapé.
  - Integrações funcionais de WhatsApp com templates de mensagem.
* **P2 (SEO, Performance e Acessibilidade):**
  - Schema.org JSON-LD para `BarberShop` e meta tags Open Graph.
  - Cores com conformidade WCAG AA (mínimo 4.5:1).
  - Modal com light-dismiss e suporte a teclado (`Esc`).
* **P3 (Polimento Visual e Micro-animações):**
  - Transições suaves, efeitos de luz e profundidade (*dark luxury*).
  - Feedback visual (Toasts de confirmação ao copiar endereço e concluir reserva).
  - Geração de build de produção testado.

---

## E. CRONOGRAMA DE EXECUÇÃO
1. **Fase 1:** Setup da estrutura do projeto (Vite + React + Tailwind + Lucide Icons + TS).
2. **Fase 2:** Implementação dos tokens de design, dados centralizados e estilos globais.
3. **Fase 3:** Implementação dos componentes e seções da landing page e modais.
4. **Fase 4:** Implementação do motor de agendamento interativo com multi-serviços.
5. **Fase 5:** SEO técnico, acessibilidade e responsividade em múltiplos viewports.
6. **Fase 6:** Testes, build de produção e geração do relatório final (`IMPLEMENTATION_REPORT.md`).

---

## F. INVENTÁRIO E INTEGRAÇÃO DE ATIVOS VISUAIS REAIS (`public/QG Barber - Images/`)

Conforme auditoria e cruzamento com os arquivos de dados (`backup_full.json`), foram localizados e integrados 48 arquivos visuais oficiais:

1. **Logo Oficial da Marca:**
   - `public/QG Barber - Images/logo.jpeg` (111.163 bytes, MD5 `22855a86...` idêntico a `backup.settings.logo_url`).
   - Aplicado em: Navbar, Hero, Footer, Modais de Autenticação e Agendamento.
2. **15 Serviços Oficiais com Imagens Individuais:**
   - `public/QG Barber - Images/Servicos/image (1).jpeg` até `image (15).jpeg`.
   - Cada um dos 15 serviços (Cabelo + Barba, Cabelo + Sobrancelha, Cabelo, Freestyle, Nevou, Luzes, Sobrancelha, Barba, Cavanhaque, Bigode, Penteado, Alisamento, Hidratação, Botox e Pigmentação) possui sua foto real de thumbnail nos cards e no seletor do Wizard.
3. **Equipe de Barbeiros Profissionais:**
   - `public/QG Barber - Images/Equipe/image (16).jpeg` -> Foto oficial do Barbeiro Felipe Marques.
   - `public/QG Barber - Images/Equipe/image (17).jpeg` -> Foto oficial do Barbeiro Bruno.
   - Apresentados na seção Equipe com badge *"BARBEIRO ESPECIALISTA"* e no seletor de profissional do agendamento.
4. **Linha Piratas For Men (6 Produtos):**
   - `public/QG Barber - Images/Produtos/image (29).jpeg` a `(34).jpeg`.
   - Fotos oficiais dos produtos: Shampoo Fresh Clean 300ml, Condicionador Fresh Clean 300ml, Blend-Turbo Hair Tônico 120ml, Pasta Modeladora Pérola Negra 70g, Pasta Modeladora Extra-Forte 70g e Pasta Modeladora Caramelo 70g.
5. **Galeria de Resultados & Transformações (11 Fotos Reais):**
   - `public/QG Barber - Images/Resultados/image (18).jpeg` a `(28).jpeg`.
   - 11 fotografias reais de cortes degradê, freestyle, nevou, barboterapia e penteados realizados na barbearia.
6. **Ambiente & Estrutura (Nosso Espaço - 3 Fotos Reais):**
   - `public/QG Barber - Images/Contato/image (35).jpeg` a `(37).jpeg`.
   - Fachada externa (Rua Orlando Tarquinio, 129), bancadas com espelhos e estações completas de barboterapia.
7. **Mockups de Referência de Layout:**
   - `Servicos/inicio_referencia.png`, `Servicos/referencia_servicos_1.png` a `5.png`, `Produtos/referencia_produtos.png`, `Planos/referencia_planos.png`, `Resultados/referencia_resultados.png` e `Contato/referencia_contato.png`.
   - Utilizados para orientar a diagramação dos cards, tipografia, badges e disposição exata dos elementos de conversão.

