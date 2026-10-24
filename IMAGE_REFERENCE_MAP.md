# MAPA DE REFERÊNCIAS VISUAIS — QG BARBER (`IMAGE_REFERENCE_MAP.md`)

> **Documento de Auditoria e Mapeamento de Ativos Visuais**  
> **Diretório Localizado:** `public/QG Barber - Images/`  
> **Total de Arquivos:** 48 arquivos (35 JPEGs fotográficos reais + 1 Logo + 12 PNGs de referência/layout)  
> **Status de Validação:** 100% dos hashes e tamanhos em bytes cruzados e verificados com o banco de dados `backup_full.json`

---

## 1. RESUMO DA LOCALIZAÇÃO E ESTRUTURA

As referências visuais solicitadas foram localizadas com sucesso no diretório:
`c:\Users\AMD\Documents\AntiGravity\QGB\public\QG Barber - Images\`

A estrutura de pastas e distribuição de arquivos é a seguinte:

```
public/QG Barber - Images/
├── logo.jpeg                    # Logomarca oficial QG Barber "Since 2025" (111.163 bytes)
├── Contato/                     # 3 fotos reais do espaço físico + 1 mockup de layout (4 arquivos)
├── Equipe/                      # 2 fotos reais dos barbeiros profissionais (2 arquivos)
├── Planos/                      # 1 mockup de layout do Clube QG Plano Mensal (1 arquivo)
├── Produtos/                    # 6 fotos reais da linha Piratas For Men + 1 mockup de layout (7 arquivos)
├── Resultados/                  # 11 fotos reais de cortes e transformações + 1 mockup de layout (12 arquivos)
└── Servicos/                    # 15 fotos reais dos serviços + 6 mockups de layout da tabela (21 arquivos)
```

---

## 2. MATRIZ DE RASTREABILIDADE: ATIVOS VISUAIS VS. SEÇÕES DO SITE

### A. Identidade da Marca (Logo & Shell Global)

| Arquivo Físico | Seção Afetada | Dimensões / Peso | Correspondência na Auditoria (`backup_full.json`) | Função na Interface |
|---|---|---|---|---|
| `logo.jpeg` | **Navbar**, **Hero**, **Footer**, **Modais**, **Favicon** | 111.163 bytes (MD5: `22855a86...`) | `settings.logo_url` (100% idêntico) | Logotipo principal com anel circular e inscrição "QG Barber - Since 2025" |

---

### B. Serviços (15 Serviços Oficiais com Imagens Individuais)

Todas as 15 imagens da pasta `Servicos/` correspondem exatamente, por hash MD5 e ordem de ID, aos 15 serviços ativos do catálogo da QG Barber:

| Arquivo Físico | Serviço Correspondente | Preço (R$) | Duração Real | Categoria | Hash MD5 / Evidência no `backup_full.json` |
|---|---|---|---|---|---|
| `Servicos/image (1).jpeg` | **Cabelo + Barba (combo)** | R$ 60,00 | 60 min | Combos Promocionais | `md5: f87ce72d...` / `srv-1788658109981-0tfn` |
| `Servicos/image (2).jpeg` | **Cabelo + Sobrancelha (combo)** | R$ 45,00 | 30 min | Combos Promocionais | `md5: 02b8f479...` / `srv-1788889406018-vypb` |
| `Servicos/image (3).jpeg` | **Cabelo** | R$ 35,00 | 30 min | Cortes Tradicionais | `md5: 45de53d5...` / `srv-1` |
| `Servicos/image (4).jpeg` | **Freestyle** | R$ 10,00 | 10 min | Acabamentos & Estilo | `md5: 217cb348...` / `srv-1787018103374-sspw` |
| `Servicos/image (5).jpeg` | **Nevou** | R$ 125,00 | 70 min | Químicas & Tratamentos | `md5: 2e2c4220...` / `srv-1788658278790-5r00` |
| `Servicos/image (6).jpeg` | **Luzes** | R$ 90,00 | 60 min | Químicas & Tratamentos | `md5: c58b5f50...` / `srv-1787276818975-ahd4` |
| `Servicos/image (7).jpeg` | **Sobrancelha** | R$ 10,00 | 10 min | Acabamentos & Estilo | `md5: 1505311c...` / `srv-1786933264068-cmho` |
| `Servicos/image (8).jpeg` | **Barba** | R$ 35,00 | 30 min | Barboterapia | `md5: 38ce89a1...` / `srv-2` |
| `Servicos/image (9).jpeg` | **Cavanhaque** | R$ 15,00 | 10 min | Barboterapia | `md5: a870b577...` / `srv-1787276844471-23y1` |
| `Servicos/image (10).jpeg` | **Bigode** | R$ 5,00 | 5 min | Barboterapia | `md5: 4f07b96b...` / `srv-3` |
| `Servicos/image (11).jpeg` | **Penteado** | R$ 20,00 | 20 min | Acabamentos & Estilo | `md5: 7e5dbeac...` / `srv-1788658167242-1fs0` |
| `Servicos/image (12).jpeg` | **Alisamento** | R$ 95,00 | 60 min | Químicas & Tratamentos | `md5: bf97dc7e...` / `srv-1788658199741-b1rz` |
| `Servicos/image (13).jpeg` | **Hidratação** | R$ 25,00 | 20 min | Químicas & Tratamentos | `md5: 96fd4070...` / `srv-1788658227985-gga2` |
| `Servicos/image (14).jpeg` | **Botox** | R$ 75,00 | 50 min | Químicas & Tratamentos | `md5: 046c7110...` / `srv-1788658352074-k7iq` |
| `Servicos/image (15).jpeg` | **Pigmentação** | R$ 25,00 | 20 min | Químicas & Tratamentos | `md5: b0247a7c...` / `srv-1788658381377-kk7n` |

#### Mockups de Referência da Seção Serviços
- `Servicos/inicio_referencia.png`: Layout original do topo (Navbar + Hero com card central QG Barber).
- `Servicos/referencia_servicos_1.png` a `referencia_servicos_5.png`: Carrossel de 3 cards horizontais por slide, mostrando o botão "AGENDAR SERVIÇO" e o badge "15 serviços disponíveis".

---

### C. Equipe de Barbeiros (Profissionais Verificados)

| Arquivo Físico | Barbeiro | Especialidade / Bio | Evidência na Auditoria | Função no Site |
|---|---|---|---|---|
| `Equipe/image (16).jpeg` | **Felipe Marques** (`barber-1`) | Barbeiro Especialista em cortes clássicos e modernos | `barbers.json`, verificado em `referencia_servicos_1.png` | Card do Barbeiro Felipe na seção Equipe e seletor do Wizard de Agendamento |
| `Equipe/image (17).jpeg` | **Bruno** (`barber-2`) | Barbeiro Especialista em cortes modernos e estilo | `barbers.json`, verificado em `referencia_servicos_1.png` | Card do Barbeiro Bruno na seção Equipe e seletor do Wizard de Agendamento |

*Nota de Auditoria:* A conta inativa de testes "Barbeiro X" não possui foto e foi expurgada da interface pública.

---

### D. Linha de Produtos Piratas For Men (6 Produtos)

| Arquivo Físico | Produto | Categoria | Especificação | Evidência na Auditoria |
|---|---|---|---|---|
| `Produtos/image (29).jpeg` | **Shampoo 3 em 1 Fresh Clean** | Cabelo | Frasco 300ml, higienização e ação mentolada | `gal-1788382131173-jlh1` (`md5: 625de867...`) |
| `Produtos/image (30).jpeg` | **Condicionador 3 em 1 Fresh Clean** | Cabelo | Frasco 300ml, nutrição diária e desembaraço | `gal-1788382066315-5k04` (`md5: b5ceec89...`) |
| `Produtos/image (31).jpeg` | **Blend-Turbo Hair** | Tratamentos | Spray 120ml, tônico de crescimento capilar e barba | `gal-1788382245354-dihf` (`md5: c830ec07...`) |
| `Produtos/image (32).jpeg` | **Pasta Modeladora Pérola Negra** | Pomadas / Black | Pote 70g, fixação forte e disfarce de fios brancos | `gal-1788382473107-lg8i` (`md5: 7f6ed43f...`) |
| `Produtos/image (33).jpeg` | **Pasta Modeladora Extra-Forte** | Pomadas / Matte | Pote 70g (tampa azul), fixação extrema e efeito seco | `gal-1788382629511-cg79` (`md5: 202ad337...`) |
| `Produtos/image (34).jpeg` | **Pasta Modeladora Caramelo** | Pomadas / Brilho | Pote 70g (tampa amarela), fixação média e fragrância amadeirada | `gal-1788382672898-lv02` (`md5: 51a636fd...`) |

#### Mockup de Referência da Seção Produtos
- `Produtos/referencia_produtos.png`: Apresenta o header "LINHA EXCLUSIVA - Produtos" com o contador "6 produtos" e carrossel de frascos e potes.

---

### E. Resultados & Transformações (Galeria com 11 Fotos Reais)

| Arquivo Físico | Corte / Procedimento Representado | Categoria | ID na Auditoria (`gallery.json`) |
|---|---|---|---|
| `Resultados/image (18).jpeg` | Degradê navalhado clássico com lateral marcada | Corte & Fade | `gal-1788372415471-ee91` |
| `Resultados/image (19).jpeg` | Texturizado no topo com degradê na nuca | Corte & Textura | `gal-1788372385385-jcx6` |
| `Resultados/image (20).jpeg` | Freestyle tribal artístico lateral | Arte & Freestyle | `gal-1788372395876-p81j` |
| `Resultados/image (21).jpeg` | Taper fade com cabelo cacheado volumoso | Corte Afro/Cacheado | `gal-1788372404823-x6fj` |
| `Resultados/image (22).jpeg` | Nevou / Platinado total impecável | Químicas & Cor | `gal-1788372462237-f5bz` |
| `Resultados/image (23).jpeg` | Barboterapia com desenho e alinhamento na navalha | Barba & Barboterapia | `gal-1788372427873-ohyp` |
| `Resultados/image (24).jpeg` | Fade militar limpo e pezinho na régua | Corte Clássico | `gal-1788372440018-41a6` |
| `Resultados/image (25).jpeg` | Mechas e luzes sutis em cabelo ondulado | Químicas & Mechas | `gal-1788372449910-mry1` |
| `Resultados/image (26).jpeg` | Pompadour estruturado com pomada matte | Penteados | `gal-1788372491642-rbq9` |
| `Resultados/image (27).jpeg` | Corte social moderno e barba desenhada | Combo Visual | `gal-1788372480887-d7od` |
| `Resultados/image (28).jpeg` | Freestyle geométrico contemporâneo | Arte & Freestyle | `gal-1788372471576-7fhu` |

#### Mockup de Referência da Seção Resultados
- `Resultados/referencia_resultados.png`: Header com ícone de tesoura ✂️, título "Resultados & Transformações" e tag "11 fotos".

---

### F. Contato & Ambiente Físico (Nosso Espaço - 3 Fotos Reais)

| Arquivo Físico | Ambiente Retratado | Evidência na Auditoria | Seção no Site |
|---|---|---|---|
| `Contato/image (35).jpeg` | Fachada externa da barbearia (número 129 na entrada) | `gal-1787521919151-oz7j` (`md5: 887abd20...`) | Seção Contato / Card "Ambiente & Estrutura" |
| `Contato/image (36).jpeg` | Bancada profissional, espelho, capas e equipamentos | `gal-1787521930869-25xf` (`md5: a171da21...`) | Seção Contato / Card "Ambiente & Estrutura" |
| `Contato/image (37).jpeg` | Poltrona reclinável de barbearia profissional e espelho | `gal-1787521943865-pgsa` (`md5: ace1478f...`) | Seção Contato / Card "Ambiente & Estrutura" |

#### Mockup de Referência da Seção Contato
- `Contato/referencia_contato.png`: Mostra a divisão em 2 colunas:
  - Esquerda: Card "Ambiente & Estrutura" com as 3 fotos do espaço físico e abaixo o endereço com botões "Copiar Endereço" e "Ver no Maps".
  - Direita: Card escuro (Midnight) "Canais Diretos / Como Falar Conosco" com botões para WhatsApp Direto e Instagram Oficial.

---

### G. Planos & Clube QG (Layout e Regras Comerciais)

| Arquivo Físico | Conteúdo Mapeado | Seção no Site |
|---|---|---|
| `Planos/referencia_planos.png` | 4 Cards dos benefícios do Clube QG (`Atendimento personalizado e direto [Principal Vantagem]`, `Exclusividade`, `Recorrência`, `Renovação mensal`) + Banner inferior "Quer saber mais? Consulte o seu barbeiro." | **MonthlyPlanSection.tsx** |

---

## 3. DIRETRIZES DE USO NO CÓDIGO FRONTEND

1. **Caminhos Públicos:** Todos os arquivos de imagem estão acessíveis diretamente a partir da raiz `/` da aplicação servida pelo Vite, sob o caminho relativo:
   `"/QG Barber - Images/<Pasta>/<Arquivo>"`
2. **Otimização de Carregamento:**
   - Imagens de dobras superiores (`logo.jpeg`) utilizam `fetchpriority="high"`.
   - Imagens abaixo da dobra (Serviços, Produtos, Resultados e Ambiente) utilizam `loading="lazy"` e `decoding="async"`.
3. **Acessibilidade:** Nenhuma imagem é renderizada sem texto alternativo (`alt`) descritivo e contextualizado.
