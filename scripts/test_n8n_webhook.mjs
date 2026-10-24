// ====================================================================
// Script de Teste de Conexão com o Webhook do n8n
// Uso: node scripts/test_n8n_webhook.mjs [--test-mode]
// ====================================================================

const isTestMode = process.argv.includes('--test-mode') || process.argv.includes('--test');
const webhookUrl = isTestMode 
  ? 'https://athrmnzs.app.n8n.cloud/webhook-test/agendamento'
  : 'https://athrmnzs.app.n8n.cloud/webhook/agendamento';

console.log(`\n========================================`);
console.log(`Disparando chamada de teste para n8n:`);
console.log(`URL: ${webhookUrl}`);
console.log(`Modo: ${isTestMode ? 'TESTE (webhook-test)' : 'PRODUÇÃO (webhook)'}`);
console.log(`========================================\n`);

const testPayload = {
  event: 'appointment_created',
  operation: 'INSERT',
  appointment_id: 'qgb-test-' + Date.now().toString(36),
  client_id: 'usr-teste-001',
  customer_name: 'Arthur Menezes (Teste QGB)',
  customer_phone: '11978334717',
  customer_email: 'contato@qgbarber.com.br',
  professional_id: '00000000-0000-0000-0000-000000000001',
  professional_name: 'Felipe',
  service_id: '10000000-0000-0000-0000-000000000001',
  service_name: 'Cabelo + Barba (combo)',
  service_price: 60.00,
  appointment_date: new Date().toISOString().split('T')[0],
  start_time: '14:30',
  end_time: '15:30',
  status: 'confirmed',
  notes: 'Cliente prefere degradê navalhado',
  source: 'website',
  created_at: new Date().toISOString(),
  timestamp: new Date().toISOString()
};

async function run() {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    console.log(`Status HTTP: ${res.status} ${res.statusText}`);
    const text = await res.text();
    console.log(`Resposta do n8n:\n${text}\n`);

    if (res.ok) {
      console.log('✅ SUCESSO! O n8n recebeu a requisição e iniciou o workflow perfeitamente.');
    } else if (res.status === 404) {
      console.log('⚠️ ATENÇÃO: O n8n retornou 404 porque o workflow está INATIVO no momento.');
      console.log('👉 Para ativar: Abra o workflow no n8n e clique na chave "Active" (topo direito) para deixá-lo ATIVO.');
      console.log('👉 Ou para testar no canvas: Clique em "Execute workflow" no n8n e execute:');
      console.log('   node scripts/test_n8n_webhook.mjs --test-mode\n');
    } else {
      console.log(`⚠️ O n8n respondeu com status ${res.status}. Verifique a configuração do nó Webhook.`);
    }
  } catch (err) {
    console.error('❌ Erro de conexão:', err.message);
  }
}

run();
