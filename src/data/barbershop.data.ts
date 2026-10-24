import { ServiceItem, BarberItem, ProductItem, MonthlyPlanBenefit, BarbershopSettings, GalleryItem, EnvironmentItem } from '../types';

export const SETTINGS: BarbershopSettings = {
  name: 'QG Barber',
  logo_url: '/QG Barber - Images/logo.jpeg',
  description: 'Corte, barba e estilo com precisão. A QG Barber é o seu espaço para renovar o visual com atendimento de qualidade e ambiente pensado pra você.',
  address: 'Rua Orlando Tarquinio, 129 - Sacomã, São Paulo - SP, 04296-110',
  whatsapp: '5511978334717',
  instagram: '_qgbarber_',
  instagramUrl: 'https://www.instagram.com/_qgbarber_/',
  tiktok: '@qgbarber',
  tiktokUrl: 'https://www.tiktok.com/@qgbarber',
  googleMapsUrl: 'https://www.google.com/maps/place/QG+Barber/@-23.6234166,-46.6066318,17z/data=!4m8!3m7!1s0x94ce5be31ae69e7d:0x38ba2742982f9c7a!8m2!3d-23.6234166!4d-46.6040515!9m1!1b1!16s%2Fg%2F11zkszlbm8?hl=pt-BR'
};

export const OPERATING_HOURS = [
  { day: 'Segunda-feira', hours: '08:30 às 18:30', open: true },
  { day: 'Terça-feira', hours: '08:30 às 18:30', open: true },
  { day: 'Quarta-feira', hours: '08:30 às 18:30', open: true },
  { day: 'Quinta-feira', hours: '08:30 às 18:30', open: true },
  { day: 'Sexta-feira', hours: '08:30 às 18:30 (até 19:30)', open: true },
  { day: 'Sábado', hours: '08:30 às 16:00', open: true },
  { day: 'Domingo', hours: 'Fechado', open: false }
];

export const SERVICES: ServiceItem[] = [
  {
    id: 'srv-1788658109981-0tfn',
    name: 'Cabelo + Barba (combo)',
    price: 60.00,
    duration: 60,
    category: 'Combos Promocionais',
    description: 'A experiência completa: corte de cabelo detalhado com alinhamento e modelagem de barba na navalha.',
    image_url: '/QG Barber - Images/Servicos/image (1).jpeg',
    popular: true,
    active: true
  },
  {
    id: 'srv-1788889406018-vypb',
    name: 'Cabelo + Sobrancelha (combo)',
    price: 45.00,
    duration: 30,
    category: 'Combos Promocionais',
    description: 'Corte moderno ou clássico acompanhado de desenho e limpeza precisa das sobrancelhas.',
    image_url: '/QG Barber - Images/Servicos/image (2).jpeg',
    popular: true,
    active: true
  },
  {
    id: 'srv-1',
    name: 'Cabelo',
    price: 35.00,
    duration: 30,
    category: 'Cortes Tradicionais',
    description: 'Corte tesoura ou máquina (degradê, fade, social, undercut) com acabamento impecável de pezinho.',
    image_url: '/QG Barber - Images/Servicos/image (3).jpeg',
    popular: true,
    active: true
  },
  {
    id: 'srv-2',
    name: 'Barba',
    price: 35.00,
    duration: 30,
    category: 'Barboterapia',
    description: 'Barboterapia com toalha quente, navalha descartável, óleos emolientes e loção pós-barba refrescante.',
    image_url: '/QG Barber - Images/Servicos/image (8).jpeg',
    popular: true,
    active: true
  },
  {
    id: 'srv-1788658278790-5r00',
    name: 'Nevou',
    price: 125.00,
    duration: 70,
    category: 'Química & Coloração',
    description: 'Descoloração global com proteção do couro cabeludo e matização platinada perfeita.',
    image_url: '/QG Barber - Images/Servicos/image (5).jpeg',
    popular: true,
    active: true
  },
  {
    id: 'srv-1788658199741-b1rz',
    name: 'Alisamento',
    price: 95.00,
    duration: 60,
    category: 'Química & Coloração',
    description: 'Redução de volume e alinhamento dos fios com aspecto natural, brilho e maleabilidade.',
    image_url: '/QG Barber - Images/Servicos/image (12).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1787276818975-ahd4',
    name: 'Luzes',
    price: 90.00,
    duration: 60,
    category: 'Química & Coloração',
    description: 'Mechas na touca ou papel com tonalização personalizada para um visual iluminado e marcante.',
    image_url: '/QG Barber - Images/Servicos/image (6).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1788658227985-gga2',
    name: 'Botox',
    price: 75.00,
    duration: 50,
    category: 'Tratamentos',
    description: 'Reposição de massa capilar, eliminação de frizz e selagem profunda das cutículas.',
    image_url: '/QG Barber - Images/Servicos/image (14).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1788658167242-1fs0',
    name: 'Hidratação',
    price: 25.00,
    duration: 20,
    category: 'Tratamentos',
    description: 'Tratamento intensivo com máscara nutritiva para devolver maciez, força e vida aos cabelos.',
    image_url: '/QG Barber - Images/Servicos/image (13).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1788658381377-kk7n',
    name: 'Pigmentação',
    price: 25.00,
    duration: 20,
    category: 'Acabamentos & Estilo',
    description: 'Preenchimento e disfarce óptico de falhas na barba ou cabelo com tinta especial hipoalergênica.',
    image_url: '/QG Barber - Images/Servicos/image (15).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1788658352074-k7iq',
    name: 'Penteado',
    price: 20.00,
    duration: 20,
    category: 'Acabamentos & Estilo',
    description: 'Lavagem, secagem e finalização com pomadas ou fixadores de alta performance (efeito matte ou brilho).',
    image_url: '/QG Barber - Images/Servicos/image (11).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1787276844471-23y1',
    name: 'Cavanhaque',
    price: 15.00,
    duration: 10,
    category: 'Barboterapia',
    description: 'Desenho e alinhamento preciso do cavanhaque com toalha morna e navalha esterilizada.',
    image_url: '/QG Barber - Images/Servicos/image (9).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1787018103374-sspw',
    name: 'Freestyle',
    price: 10.00,
    duration: 10,
    category: 'Acabamentos & Estilo',
    description: 'Linhas, riscos, traços geométricos e arte navalhada personalizada nas laterais.',
    image_url: '/QG Barber - Images/Servicos/image (4).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-1786933264068-cmho',
    name: 'Sobrancelha',
    price: 10.00,
    duration: 10,
    category: 'Acabamentos & Estilo',
    description: 'Limpeza, alinhamento e desenho do arco da sobrancelha na navalha com precisão cirúrgica.',
    image_url: '/QG Barber - Images/Servicos/image (7).jpeg',
    popular: false,
    active: true
  },
  {
    id: 'srv-3',
    name: 'Bigode',
    price: 5.00,
    duration: 5,
    category: 'Barboterapia',
    description: 'Aparo, alinhamento e limpeza do bigode mantendo o contorno perfeito.',
    image_url: '/QG Barber - Images/Servicos/image (10).jpeg',
    popular: false,
    active: true
  }
];

export const BARBERS: BarberItem[] = [
  {
    id: 'barber-1',
    name: 'Felipe',
    phone: '11978334717',
    email: 'fefemarquessp@gmail.com',
    specialty: 'Degradê na régua, químicas, nevou & barba clássica',
    bio: 'Mais de 8 anos de experiência em cortes masculinos, especialista em transformações, visagismo e atendimento de alto padrão.',
    photo_url: '/QG Barber - Images/Equipe/image (16).jpeg',
    active: true,
    service_ids: [
      'srv-1788658109981-0tfn', 'srv-1788889406018-vypb', 'srv-1', 'srv-1787276844471-23y1',
      'srv-1788658278790-5r00', 'srv-1787276818975-ahd4', 'srv-1786933264068-cmho', 'srv-2',
      'srv-1787018103374-sspw', 'srv-3', 'srv-1788658167242-1fs0', 'srv-1788658199741-b1rz',
      'srv-1788658227985-gga2', 'srv-1788658352074-k7iq', 'srv-1788658381377-kk7n'
    ]
  },
  {
    id: 'barber-2',
    name: 'Bruno',
    phone: '11995328416',
    email: 'bruxx11102000@gmail.com',
    specialty: 'Cortes modernos, freestyle, barba terapia & acabamentos finos',
    bio: 'Técnica apurada em tesoura e máquina, foco em precisão, pontualidade rigorosa e atendimento consultivo.',
    photo_url: '/QG Barber - Images/Equipe/image (17).jpeg',
    active: true,
    service_ids: [
      'srv-1788658109981-0tfn', 'srv-1788889406018-vypb', 'srv-1', 'srv-1787276844471-23y1',
      'srv-1788658278790-5r00', 'srv-1787276818975-ahd4', 'srv-1786933264068-cmho', 'srv-2',
      'srv-1787018103374-sspw', 'srv-3', 'srv-1788658167242-1fs0', 'srv-1788658199741-b1rz',
      'srv-1788658227985-gga2', 'srv-1788658352074-k7iq', 'srv-1788658381377-kk7n'
    ]
  }
];

export const PRODUCTS: ProductItem[] = [
  {
    id: 'gal-1788382131173-jlh1',
    name: 'Shampoo 3 em 1 Piratas For Men',
    brand: 'Piratas For Men',
    description: 'Higienização profunda dos fios e couro cabeludo sem ressecar. Ação mentolada refrescante (300ml).',
    category: 'Cabelo',
    suggestedPrice: 35.00,
    image_url: '/QG Barber - Images/Produtos/image (29).jpeg'
  },
  {
    id: 'gal-1788382066315-5k04',
    name: 'Condicionador 3 em 1 Piratas For Men',
    brand: 'Piratas For Men',
    description: 'Nutrição diária, desembaraço imediato e toque aveludado para cabelos masculinos (300ml).',
    category: 'Cabelo',
    suggestedPrice: 35.00,
    image_url: '/QG Barber - Images/Produtos/image (30).jpeg'
  },
  {
    id: 'gal-1788382245354-dihf',
    name: 'Blend-Turbo Hair Piratas For Men',
    brand: 'Piratas For Men',
    description: 'Tônico fortificante para estímulo de crescimento capilar e preenchimento de falhas na barba (120ml).',
    category: 'Tratamentos',
    suggestedPrice: 49.00,
    image_url: '/QG Barber - Images/Produtos/image (31).jpeg'
  },
  {
    id: 'gal-1788382473107-lg8i',
    name: 'Pasta Modeladora Pérola Negra',
    brand: 'Piratas For Men',
    description: 'Fixação forte com pigmento preto suave que disfarça fios brancos e realça cortes escuros (70g).',
    category: 'Finalizadores',
    suggestedPrice: 32.00,
    image_url: '/QG Barber - Images/Produtos/image (32).jpeg'
  },
  {
    id: 'gal-1788382629511-cg79',
    name: 'Pasta Modeladora Extra-Forte',
    brand: 'Piratas For Men',
    description: 'Máxima fixação com efeito matte (seco e fosco), ideal para penteados topete e estruturados (70g).',
    category: 'Finalizadores',
    suggestedPrice: 30.00,
    image_url: '/QG Barber - Images/Produtos/image (33).jpeg'
  },
  {
    id: 'gal-1788382672898-lv02',
    name: 'Pasta Modeladora Caramelo',
    brand: 'Piratas For Men',
    description: 'Fixação média com leve brilho natural, fragrância amadeirada marcante e fácil remoção na água (70g).',
    category: 'Finalizadores',
    suggestedPrice: 30.00,
    image_url: '/QG Barber - Images/Produtos/image (34).jpeg'
  }
];

export const MONTHLY_PLAN_BENEFITS: MonthlyPlanBenefit[] = [
  {
    id: 'benefit-atendimento',
    title: 'Atendimento personalizado e direto',
    description: 'Agendamentos, promoções, novidades e uma comunicação mais direta com o barbeiro.',
    highlighted: true,
    badge: 'Principal Vantagem',
    iconName: 'Sparkles'
  },
  {
    id: 'benefit-exclusividade',
    title: 'Exclusividade',
    description: 'O cliente mensal possui prioridade na escolha dos horários, podendo escolher seus horários antes dos clientes convencionais.',
    highlighted: false,
    iconName: 'Star'
  },
  {
    id: 'benefit-recorrencia',
    title: 'Recorrência',
    description: 'O horário escolhido pelo cliente mensal pode se tornar recorrente, proporcionando mais praticidade e organização para sua rotina.',
    highlighted: false,
    iconName: 'Clock'
  },
  {
    id: 'benefit-renovacao',
    title: 'Renovação mensal',
    description: 'Continue aproveitando os benefícios do plano e mantenha sua experiência exclusiva na QG Barber.',
    highlighted: false,
    iconName: 'RefreshCw'
  }
];

// 11 Fotos reais de resultados e transformações da galeria da barbearia
export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 'gal-18', title: 'Degradê Navalhado com Pezinho Alinhado', tag: 'Corte & Fade', img: '/QG Barber - Images/Resultados/image (18).jpeg' },
  { id: 'gal-19', title: 'Corte Texturizado com Fade na Nuca', tag: 'Textura & Fade', img: '/QG Barber - Images/Resultados/image (19).jpeg' },
  { id: 'gal-20', title: 'Freestyle Tribal Artístico Lateral', tag: 'Arte & Freestyle', img: '/QG Barber - Images/Resultados/image (20).jpeg' },
  { id: 'gal-21', title: 'Taper Fade com Cabelo Afro/Cacheado', tag: 'Afro & Cacheado', img: '/QG Barber - Images/Resultados/image (21).jpeg' },
  { id: 'gal-22', title: 'Nevou / Platinado Global Impecável', tag: 'Química & Cor', img: '/QG Barber - Images/Resultados/image (22).jpeg' },
  { id: 'gal-23', title: 'Barboterapia com Alinhamento na Navalha', tag: 'Barba & Terapia', img: '/QG Barber - Images/Resultados/image (23).jpeg' },
  { id: 'gal-24', title: 'Fade Militar Limpo com Acabamento Fino', tag: 'Corte Tradicional', img: '/QG Barber - Images/Resultados/image (24).jpeg' },
  { id: 'gal-25', title: 'Luzes e Mechas em Fios Ondulados', tag: 'Mechas & Luzes', img: '/QG Barber - Images/Resultados/image (25).jpeg' },
  { id: 'gal-26', title: 'Penteado Pompadour com Fade Suave', tag: 'Penteados', img: '/QG Barber - Images/Resultados/image (26).jpeg' },
  { id: 'gal-27', title: 'Corte Social Moderno com Barba Cheia', tag: 'Combo Visual', img: '/QG Barber - Images/Resultados/image (27).jpeg' },
  { id: 'gal-28', title: 'Freestyle Geométrico com Pigmentação', tag: 'Arte & Pigmentação', img: '/QG Barber - Images/Resultados/image (28).jpeg' }
];

// 3 Fotos reais do espaço físico da barbearia
export const ENVIRONMENT_ITEMS: EnvironmentItem[] = [
  { id: 'env-35', title: 'Fachada & Recepção', description: 'Entrada moderna e acolhedora na Rua Orlando Tarquinio, 129', img: '/QG Barber - Images/Contato/image (35).jpeg' },
  { id: 'env-36', title: 'Bancadas Profissionais', description: 'Espelhos amplos, capas limpas, iluminação planejada e higiene rigorosa', img: '/QG Barber - Images/Contato/image (36).jpeg' },
  { id: 'env-37', title: 'Estações de Barboterapia', description: 'Poltronas reclináveis de alta ergonomia e conforto com toalhas quentes', img: '/QG Barber - Images/Contato/image (37).jpeg' }
];
