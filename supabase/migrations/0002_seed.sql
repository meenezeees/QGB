-- =====================================================================
-- QG Barber — 0002: Seed (gerado de src/data/barbershop.data.ts)
-- 15 serviços, 2 barbeiros e horários de funcionamento atuais.
-- Idempotente: pode ser executado novamente com segurança.
-- =====================================================================

insert into public.services (id, name, category, description, price_cents, duration_minutes, image_url, popular, active, sort_order) values
  ('srv-1788658109981-0tfn', 'Cabelo + Barba (combo)', 'Combos Promocionais', 'A experiência completa: corte de cabelo detalhado com alinhamento e modelagem de barba na navalha.', 6000, 60, './QG Barber - Images/Servicos/image (1).jpeg', true, true, 1),
  ('srv-1788889406018-vypb', 'Cabelo + Sobrancelha (combo)', 'Combos Promocionais', 'Corte moderno ou clássico acompanhado de desenho e limpeza precisa das sobrancelhas.', 4500, 30, './QG Barber - Images/Servicos/image (2).jpeg', true, true, 2),
  ('srv-1', 'Cabelo', 'Cortes Tradicionais', 'Corte tesoura ou máquina (degradê, fade, social, undercut) com acabamento impecável de pezinho.', 3500, 30, './QG Barber - Images/Servicos/image (3).jpeg', true, true, 3),
  ('srv-2', 'Barba', 'Barboterapia', 'Barboterapia com toalha quente, navalha descartável, óleos emolientes e loção pós-barba refrescante.', 3500, 30, './QG Barber - Images/Servicos/image (8).jpeg', true, true, 4),
  ('srv-1788658278790-5r00', 'Nevou', 'Química & Coloração', 'Descoloração global com proteção do couro cabeludo e matização platinada perfeita.', 12500, 70, './QG Barber - Images/Servicos/image (5).jpeg', true, true, 5),
  ('srv-1788658199741-b1rz', 'Alisamento', 'Química & Coloração', 'Redução de volume e alinhamento dos fios com aspecto natural, brilho e maleabilidade.', 9500, 60, './QG Barber - Images/Servicos/image (12).jpeg', false, true, 6),
  ('srv-1787276818975-ahd4', 'Luzes', 'Química & Coloração', 'Mechas na touca ou papel com tonalização personalizada para um visual iluminado e marcante.', 9000, 60, './QG Barber - Images/Servicos/image (6).jpeg', false, true, 7),
  ('srv-1788658227985-gga2', 'Botox', 'Tratamentos', 'Reposição de massa capilar, eliminação de frizz e selagem profunda das cutículas.', 7500, 50, './QG Barber - Images/Servicos/image (14).jpeg', false, true, 8),
  ('srv-1788658167242-1fs0', 'Hidratação', 'Tratamentos', 'Tratamento intensivo com máscara nutritiva para devolver maciez, força e vida aos cabelos.', 2500, 20, './QG Barber - Images/Servicos/image (13).jpeg', false, true, 9),
  ('srv-1788658381377-kk7n', 'Pigmentação', 'Acabamentos & Estilo', 'Preenchimento e disfarce óptico de falhas na barba ou cabelo com tinta especial hipoalergênica.', 2500, 20, './QG Barber - Images/Servicos/image (15).jpeg', false, true, 10),
  ('srv-1788658352074-k7iq', 'Penteado', 'Acabamentos & Estilo', 'Lavagem, secagem e finalização com pomadas ou fixadores de alta performance (efeito matte ou brilho).', 2000, 20, './QG Barber - Images/Servicos/image (11).jpeg', false, true, 11),
  ('srv-1787276844471-23y1', 'Cavanhaque', 'Barboterapia', 'Desenho e alinhamento preciso do cavanhaque com toalha morna e navalha esterilizada.', 1500, 10, './QG Barber - Images/Servicos/image (9).jpeg', false, true, 12),
  ('srv-1787018103374-sspw', 'Freestyle', 'Acabamentos & Estilo', 'Linhas, riscos, traços geométricos e arte navalhada personalizada nas laterais.', 1000, 10, './QG Barber - Images/Servicos/image (4).jpeg', false, true, 13),
  ('srv-1786933264068-cmho', 'Sobrancelha', 'Acabamentos & Estilo', 'Limpeza, alinhamento e desenho do arco da sobrancelha na navalha com precisão cirúrgica.', 1000, 10, './QG Barber - Images/Servicos/image (7).jpeg', false, true, 14),
  ('srv-3', 'Bigode', 'Barboterapia', 'Aparo, alinhamento e limpeza do bigode mantendo o contorno perfeito.', 500, 5, './QG Barber - Images/Servicos/image (10).jpeg', false, true, 15)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  description = excluded.description,
  price_cents = excluded.price_cents,
  duration_minutes = excluded.duration_minutes,
  image_url = excluded.image_url,
  popular = excluded.popular,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.barbers (id, name, specialty, bio, photo_url, whatsapp_public, active, sort_order) values
  ('barber-1', 'Felipe', 'Degradê na régua, químicas, nevou & barba clássica', 'Mais de 8 anos de experiência em cortes masculinos, especialista em transformações, visagismo e atendimento de alto padrão.', './QG Barber - Images/Equipe/image (16).jpeg', '11978334717', true, 1),
  ('barber-2', 'Bruno', 'Cortes modernos, freestyle, barba terapia & acabamentos finos', 'Técnica apurada em tesoura e máquina, foco em precisão, pontualidade rigorosa e atendimento consultivo.', './QG Barber - Images/Equipe/image (17).jpeg', '11995328416', true, 2)
on conflict (id) do update set
  name = excluded.name,
  specialty = excluded.specialty,
  bio = excluded.bio,
  photo_url = excluded.photo_url,
  whatsapp_public = excluded.whatsapp_public,
  active = excluded.active,
  sort_order = excluded.sort_order;

insert into public.barber_services (barber_id, service_id) values
  ('barber-1', 'srv-1788658109981-0tfn'),
  ('barber-1', 'srv-1788889406018-vypb'),
  ('barber-1', 'srv-1'),
  ('barber-1', 'srv-1787276844471-23y1'),
  ('barber-1', 'srv-1788658278790-5r00'),
  ('barber-1', 'srv-1787276818975-ahd4'),
  ('barber-1', 'srv-1786933264068-cmho'),
  ('barber-1', 'srv-2'),
  ('barber-1', 'srv-1787018103374-sspw'),
  ('barber-1', 'srv-3'),
  ('barber-1', 'srv-1788658167242-1fs0'),
  ('barber-1', 'srv-1788658199741-b1rz'),
  ('barber-1', 'srv-1788658227985-gga2'),
  ('barber-1', 'srv-1788658352074-k7iq'),
  ('barber-1', 'srv-1788658381377-kk7n'),
  ('barber-2', 'srv-1788658109981-0tfn'),
  ('barber-2', 'srv-1788889406018-vypb'),
  ('barber-2', 'srv-1'),
  ('barber-2', 'srv-1787276844471-23y1'),
  ('barber-2', 'srv-1788658278790-5r00'),
  ('barber-2', 'srv-1787276818975-ahd4'),
  ('barber-2', 'srv-1786933264068-cmho'),
  ('barber-2', 'srv-2'),
  ('barber-2', 'srv-1787018103374-sspw'),
  ('barber-2', 'srv-3'),
  ('barber-2', 'srv-1788658167242-1fs0'),
  ('barber-2', 'srv-1788658199741-b1rz'),
  ('barber-2', 'srv-1788658227985-gga2'),
  ('barber-2', 'srv-1788658352074-k7iq'),
  ('barber-2', 'srv-1788658381377-kk7n')
on conflict do nothing;

-- Horários (OPERATING_HOURS + grade atual do agendamento, que pula 12:00 e 12:30)
-- 0 = domingo ... 6 = sábado
insert into public.business_hours (weekday, is_open, opens_at, closes_at, break_start, break_end, slot_minutes) values
  (0, false, null,    null,    null,    null,    30),
  (1, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (2, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (3, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (4, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (5, true,  '08:30', '18:30', '12:00', '13:00', 30),
  (6, true,  '08:30', '16:00', '12:00', '13:00', 30)
on conflict (weekday) do update set
  is_open = excluded.is_open,
  opens_at = excluded.opens_at,
  closes_at = excluded.closes_at,
  break_start = excluded.break_start,
  break_end = excluded.break_end,
  slot_minutes = excluded.slot_minutes;
