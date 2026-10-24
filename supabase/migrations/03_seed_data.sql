-- ====================================================================
-- QG BARBER — MIGRAÇÃO 03: DADOS DE SEED OFICIAIS (AUDITORIA QGB)
-- ====================================================================

-- 1. Inserção dos Barbeiros / Profissionais da Barbearia
INSERT INTO public.professionals (id, name, phone, email, specialty, bio, photo_url, active)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Felipe',
    '11978334717',
    'fefemarquessp@gmail.com',
    'Degradê na régua, químicas, nevou & barba clássica',
    'Mais de 8 anos de experiência em cortes masculinos, especialista em transformações, visagismo e atendimento de alto padrão.',
    '/QG Barber - Images/Equipe/image (16).jpeg',
    true
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Bruno',
    '11995328416',
    'bruxx11102000@gmail.com',
    'Cortes modernos, freestyle, barba terapia & acabamentos finos',
    'Técnica apurada em tesoura e máquina, foco em precisão, pontualidade rigorosa e atendimento consultivo.',
    '/QG Barber - Images/Equipe/image (17).jpeg',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  phone = EXCLUDED.phone,
  email = EXCLUDED.email,
  specialty = EXCLUDED.specialty,
  bio = EXCLUDED.bio,
  photo_url = EXCLUDED.photo_url,
  active = EXCLUDED.active;

-- 2. Inserção dos 15 Serviços Oficiais com Preços Reais da Auditoria
INSERT INTO public.services (id, name, description, price_cents, duration_minutes, category, image_url, popular, active)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Cabelo + Barba (combo)',
    'A experiência completa: corte de cabelo detalhado com alinhamento e modelagem de barba na navalha.',
    6000, -- R$ 60,00
    60,
    'Combos Promocionais',
    '/QG Barber - Images/Servicos/image (1).jpeg',
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Cabelo + Sobrancelha (combo)',
    'Corte moderno ou clássico acompanhado de desenho e limpeza precisa das sobrancelhas.',
    4500, -- R$ 45,00
    30,
    'Combos Promocionais',
    '/QG Barber - Images/Servicos/image (2).jpeg',
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Cabelo',
    'Corte tesoura ou máquina (degradê, fade, social, undercut) com acabamento impecável de pezinho.',
    3500, -- R$ 35,00
    30,
    'Cortes Tradicionais',
    '/QG Barber - Images/Servicos/image (3).jpeg',
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'Barba',
    'Barboterapia com toalha quente, navalha descartável, óleos emolientes e loção pós-barba refrescante.',
    3500, -- R$ 35,00
    30,
    'Barboterapia',
    '/QG Barber - Images/Servicos/image (8).jpeg',
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000005',
    'Nevou',
    'Descoloração global com proteção do couro cabeludo e matização platinada perfeita.',
    12500, -- R$ 125,00
    70,
    'Química & Coloração',
    '/QG Barber - Images/Servicos/image (5).jpeg',
    true,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000006',
    'Alisamento',
    'Redução de volume e alinhamento dos fios com aspecto natural, brilho e maleabilidade.',
    9500, -- R$ 95,00
    60,
    'Química & Coloração',
    '/QG Barber - Images/Servicos/image (12).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000007',
    'Luzes',
    'Mechas na touca ou papel com tonalização personalizada para um visual iluminado e marcante.',
    9000, -- R$ 90,00
    60,
    'Química & Coloração',
    '/QG Barber - Images/Servicos/image (6).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000008',
    'Botox',
    'Reposição de massa capilar, eliminação de frizz e selagem profunda das cutículas.',
    7500, -- R$ 75,00
    50,
    'Tratamentos',
    '/QG Barber - Images/Servicos/image (14).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000009',
    'Hidratação',
    'Tratamento intensivo com máscara nutritiva para devolver maciez, força e vida aos cabelos.',
    2500, -- R$ 25,00
    20,
    'Tratamentos',
    '/QG Barber - Images/Servicos/image (13).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000010',
    'Pigmentação',
    'Preenchimento e disfarce óptico de falhas na barba ou cabelo com tinta especial hipoalergênica.',
    2500, -- R$ 25,00
    20,
    'Acabamentos & Estilo',
    '/QG Barber - Images/Servicos/image (15).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000011',
    'Penteado',
    'Lavagem, secagem e finalização com pomadas ou fixadores de alta performance (efeito matte ou brilho).',
    2000, -- R$ 20,00
    20,
    'Acabamentos & Estilo',
    '/QG Barber - Images/Servicos/image (11).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000012',
    'Cavanhaque',
    'Desenho e alinhamento preciso do cavanhaque com toalha morna e navalha esterilizada.',
    1500, -- R$ 15,00
    10,
    'Barboterapia',
    '/QG Barber - Images/Servicos/image (9).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000013',
    'Freestyle',
    'Linhas, riscos, traços geométricos e arte navalhada personalizada nas laterais.',
    1000, -- R$ 10,00
    10,
    'Acabamentos & Estilo',
    '/QG Barber - Images/Servicos/image (4).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000014',
    'Sobrancelha',
    'Limpeza, alinhamento e desenho do arco da sobrancelha na navalha com precisão cirúrgica.',
    1000, -- R$ 10,00
    10,
    'Acabamentos & Estilo',
    '/QG Barber - Images/Servicos/image (7).jpeg',
    false,
    true
  ),
  (
    '10000000-0000-0000-0000-000000000015',
    'Bigode',
    'Aparo, alinhamento e limpeza do bigode mantendo o contorno perfeito.',
    500, -- R$ 5,00
    5,
    'Barboterapia',
    '/QG Barber - Images/Servicos/image (10).jpeg',
    false,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price_cents = EXCLUDED.price_cents,
  duration_minutes = EXCLUDED.duration_minutes,
  category = EXCLUDED.category,
  image_url = EXCLUDED.image_url,
  popular = EXCLUDED.popular,
  active = EXCLUDED.active;
