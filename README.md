# tzmail

`@zyther/tzmail` é uma biblioteca TypeScript/Node.js para gerar templates e enviar mensagens por SMTP, SendGrid, Amazon SES ou Mailgun. Inclui temas prontos, validação básica, cache limitado, anexos e factories independentes por provedor.

> **Escopo:** tzmail é uma camada de templates, transportes e fila de envio, não uma plataforma completa de campanhas. Para alto volume, use uma fila durável, defina idempotência e retries e coordene limites com o provedor. SMTP ou API aceitar a mensagem não garante entrega na caixa de entrada.

## Requisitos e instalação

- Node.js 20 ou superior.
- `nodemailer` 6.9, 7 ou 8, instalado como peer dependency.
- Para usar Amazon SES, instale também o peer opcional `@aws-sdk/client-sesv2`; SendGrid e Mailgun usam `fetch` nativo do Node e não precisam dos SDKs do fornecedor.
- Para usar a fila assíncrona, instale o peer opcional `bullmq` e disponibilize Redis compatível.

```bash
npm install @zyther/tzmail nodemailer
# Opcional, somente se usar a fila:
npm install bullmq
```

## Início rápido

Use variáveis de ambiente ou um secret manager para credenciais; não grave senhas SMTP no código-fonte.

```typescript
import {
  EmailFactory,
  ThemeType,
  type IEmailConfig,
  type ITemplateConfig
} from '@zyther/tzmail';

const smtp: IEmailConfig = {
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false, // TLS implícito normalmente usa 465; 587 normalmente negocia STARTTLS
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASSWORD!
  },
  defaultFrom: 'Acme <noreply@example.com>'
};

// create() é apropriado para serviços/tenants com configurações isoladas.
const mailer = EmailFactory.create(smtp);
const templateConfig: ITemplateConfig = {
  header: { show: true, logo: { type: 'text', text: 'Acme' } },
  body: {
    title: 'Bem-vindo!',
    message: 'Sua conta está pronta.',
    buttonText: 'Abrir conta',
    buttonUrl: 'https://example.com/account'
  },
  footer: { show: true, unsubscribeText: 'Cancelar inscrição' }
};

const template = mailer.getTemplateService().createTemplate(
  ThemeType.MODERN,
  'light',
  templateConfig
);

const result = await mailer.sendEmail({
  to: 'pessoa@example.com',
  subject: 'Sua conta está pronta',
  template
});

if (result.status !== 'success') {
  // Registre metadados de operação de acordo com a política da aplicação.
  // Evite enviar corpo da mensagem, credenciais ou dados pessoais aos logs.
  console.error('Falha no envio', result.status, result.errorStage);
}

// No encerramento gracioso do processo/worker:
mailer.close();
```

## SMTP e throughput

`IEmailConfig` expõe as opções principais de SMTP e do pool Nodemailer. `pool`, `maxConnections`, `maxMessages`, `rateDelta` e `rateLimit` controlam o pool e a cadência **de uma instância/processo**:

```typescript
const smtp: IEmailConfig = {
  host: process.env.SMTP_HOST!,
  port: 587,
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASSWORD! },
  defaultFrom: 'Acme <noreply@example.com>',
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 1_000,
  rateLimit: 50,
  connectionTimeout: 30_000,
  greetingTimeout: 30_000,
  socketTimeout: 60_000
};

const mailer = EmailFactory.create(smtp);
await mailer.verifyTransport(); // valida conexão/credenciais; não envia e-mail
```

`auth` suporta credenciais `login` (usuário/senha), credenciais `oauth2` (por exemplo `user`, `clientId`, `clientSecret`, `refreshToken` ou `accessToken`) e o mecanismo `custom` do Nodemailer. Armazene tokens, callbacks e segredos em secret manager; o exemplo de senha acima não é requisito para OAuth2.

Escolha os limites conforme o provedor SMTP. Multiplicar réplicas multiplica conexões e limites locais; aplique controle distribuído/fila e quotas no sistema que coordena os workers.

`EmailFactory.create(config, templateOptions?, attachmentOptions?)` cria uma instância isolada. `EmailFactory.initialize(...)`/`getInstance()` continuam disponíveis para um singleton por processo; uma segunda inicialização com configurações diferentes lança erro, em vez de reutilizar silenciosamente o primeiro SMTP. Feche cada instância criada com `close()` no shutdown.

## Fila assíncrona com BullMQ

BullMQ é um peer opcional. Instale-o e configure Redis antes de criar a fila. Os processos produtores só precisam adicionar jobs; execute `startWorker()` em workers dedicados e use a mesma `queueName`, `prefix` e conexão Redis. É possível escalar workers horizontalmente. `concurrency` controla jobs simultâneos por worker, enquanto `limiter` aplica uma taxa compartilhada por fila entre os workers BullMQ.

```typescript
import { EmailFactory, type IEmailConfig } from '@zyther/tzmail';

const queue = EmailFactory.createBullMQQueue({
  connection: {
    host: process.env.REDIS_HOST!,
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true' ? {} : undefined
  },
  queueName: 'transactional-email',
  concurrency: 10,
  limiter: { max: 100, duration: 1_000 },
  // Dados por minuto do BullMQ: 14 dias = 14 * 24 * 60 pontos.
  workerMetrics: { maxDataPoints: 20_160 },
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 1_000, jitter: 0.2 }
  }
});

// Producer/API process:
const job = await queue.enqueueEmail({
  to: 'ana@example.com',
  subject: 'Recibo',
  text: 'Pagamento confirmado.'
}, { idempotencyKey: 'receipt-order-123' });
console.log('Job ID:', job.id);

// Ou uma leva, enviada ao Redis por addBulk:
await queue.enqueueBulk([
  { email: { to: 'a@example.com', subject: 'Olá', text: 'A' }, job: { idempotencyKey: 'batch-a' } },
  { email: { to: 'b@example.com', subject: 'Olá', text: 'B' }, job: { idempotencyKey: 'batch-b' } }
]);
```

Exponha `exportPrometheusMetrics()` em um endpoint interno `/metrics`; ele retorna o formato de texto esperado pelo Prometheus e pode receber labels globais de baixa cardinalidade:

```typescript
import { createServer } from 'node:http';

const metricsServer = createServer(async (req, res) => {
  if (req.method !== 'GET' || req.url !== '/metrics') {
    res.writeHead(404).end();
    return;
  }
  try {
    const body = await queue.exportPrometheusMetrics({
      env: process.env.NODE_ENV ?? 'production',
      service: 'tzmail'
    });
    res.writeHead(200, {
      'content-type': 'text/plain; version=0.0.4; charset=utf-8',
      'content-length': String(Buffer.byteLength(body))
    });
    res.end(body);
  } catch {
    res.writeHead(500).end('Metrics unavailable');
  }
});
metricsServer.listen(9464, '0.0.0.0');
```

Configure o Prometheus para coletar `mail-metrics:9464` a cada 15 segundos. Um exporter dedicado por fila evita séries duplicadas de contagens quando várias réplicas consultam o mesmo Redis. No Grafana, crie painéis para jobs em espera, ativos e falhos e alertas para backlog crescente/falhas. Não use e-mail, ID de job ou outro valor ilimitado como label.

Em um processo worker, crie o transporte normal e inicie o consumidor com a mesma configuração da fila:

```typescript
const mailer = EmailFactory.createSendGrid({
  apiKey: process.env.SENDGRID_API_KEY!,
  defaultFrom: 'Acme <noreply@example.com>'
});
queue.startWorker(mailer, { concurrency: 20 }); // herda workerMetrics da configuração

// Eventos globais de todos os workers; use-os para logs/alertas em tempo real.
const events = queue.createQueueEvents();
events.on('completed', ({ jobId }) => logger.info({ jobId }, 'email job completed'));
events.on('failed', ({ jobId, failedReason }) => logger.error({ jobId, failedReason }, 'email job failed'));

// No shutdown gracioso, aguarde jobs ativos antes de fechar o transporte:
await queue.close();
mailer.close();
```

`enqueueEmail()` aceita `idempotencyKey` para deduplicar jobs enquanto o job anterior ainda está retido na fila; a chave é transformada em ID Redis sem expor o valor original. Jobs removidos após completar/falhar deixam de deduplicar. `enqueueBulk()` aceita até 1.000 mensagens por padrão; falha parcial durante o bulk pode deixar alguns jobs inseridos, então use chaves idempotentes e confira a fila antes de repetir o lote. `getJobCounts()` retorna contagens de jobs em espera, ativos, concluídos, falhos, atrasados e pausados. `getMetrics('completed' | 'failed')` lê as séries de throughput em intervalos de um minuto armazenadas no Redis; todos os workers da fila devem usar o mesmo `workerMetrics.maxDataPoints`.

As opções padrão são 5 tentativas, backoff exponencial com jitter, retenção de jobs concluídos por até 24 horas/10.000 itens e jobs falhos por até 7 dias/50.000 itens. Podem ser alteradas em `defaultJobOptions` ou por job. BullMQ reprocessa falhas de worker; uma falha de transporte após a aceitação remota mas antes da resposta pode, portanto, duplicar o envio. Idempotência do job evita enqueue duplicado enquanto ele está retido, mas não fornece entrega exactly-once no provedor. Erros de validação/renderização e entregas parciais são marcados como não recuperáveis. Em entrega parcial não há retry automático, para evitar reenviar a quem já foi aceite; revise esses jobs falhos e trate os destinatários rejeitados por um fluxo específico.

O template é renderizado antes de entrar na fila, para não serializar closures/funções. Conteúdo de `Buffer` é convertido em Base64 e armazenado no Redis. `path` de anexo permanece um caminho local, que precisa estar acessível em todos os workers. O tamanho máximo serializado é 10 MiB por job por padrão (`maxPayloadBytes`); aumente com cautela, pois anexos grandes ocupam Redis e memória. O payload contém endereços e conteúdo de e-mail: proteja Redis com TLS, autenticação, controles de rede e retenção adequada. `close()` aguarda os workers ativos e fecha a fila; chame-o no encerramento gracioso.

Veja também a documentação oficial BullMQ sobre [retries e backoff](https://docs.bullmq.io/guide/retrying-failing-jobs), [IDs de job](https://docs.bullmq.io/guide/jobs/job-ids), [inserção em lote](https://docs.bullmq.io/guide/queues/adding-bulks), [rate limiting](https://docs.bullmq.io/guide/rate-limiting) e [shutdown de workers](https://docs.bullmq.io/guide/workers/graceful-shutdown).

## Provedores de e-mail

As factories de provedores criam instâncias independentes, então é possível manter, por exemplo, uma saída transacional no SES e outra de marketing no SendGrid no mesmo processo. Não há estado singleton compartilhado entre chaves ou tenants.

### SendGrid Web API

O adapter usa a API v3 oficial por `fetch` (não requer `@sendgrid/mail`). O remetente precisa estar verificado no SendGrid. Anexos da API são codificados em Base64 e ficam em memória durante a chamada; configure `maxAttachmentBytes` para limitar o tamanho de cada arquivo.

```typescript
const sendgrid = EmailFactory.createSendGrid({
  apiKey: process.env.SENDGRID_API_KEY!,
  defaultFrom: 'Acme <noreply@example.com>',
  requestTimeoutMs: 30_000,
  maxAttachmentBytes: 10 * 1024 * 1024
});

const result = await sendgrid.sendEmail({
  to: ['ana@example.com', 'bruno@example.com'],
  subject: 'Atualização da conta',
  text: 'Sua conta foi atualizada.'
});
sendgrid.close();
```

Use `apiUrl` se a conta estiver configurada para um endpoint regional. O padrão é `https://api.sendgrid.com`. Referências: [Mail Send API](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send) e [anexos no SDK oficial](https://github.com/sendgrid/sendgrid-nodejs/blob/main/docs/use-cases/attachments.md).

### Mailgun Messages API

O adapter usa a API Messages via `fetch` e multipart/form-data; não exige `mailgun.js`. Defina o domínio de envio e a região da conta. `apiUrl` só deve ser personalizado para endpoint próprio ou controlado.

```typescript
const mailgun = EmailFactory.createMailgun({
  apiKey: process.env.MAILGUN_API_KEY!,
  domain: process.env.MAILGUN_DOMAIN!,
  region: 'eu', // omita ou use 'us' para a API dos EUA
  defaultFrom: 'Acme <noreply@example.com>',
  requestTimeoutMs: 30_000,
  maxAttachmentBytes: 10 * 1024 * 1024
});

await mailgun.sendEmail({
  to: 'ana@example.com',
  subject: 'Olá',
  html: '<p>Mensagem enviada pelo Mailgun.</p>'
});
mailgun.close();
```

O adapter usa `https://api.mailgun.net` nos EUA e `https://api.eu.mailgun.net` para `region: 'eu'`. Os anexos são preparados em memória antes do POST; defina limite adequado. Para imagens inline, Mailgun deriva o Content-ID do nome do arquivo; quando `cid` é informado, o adapter converte referências `cid:<valor>` do HTML para `cid:<filename>`. Veja a [API oficial de mensagens](https://documentation.mailgun.com/docs/mailgun/api-reference/send/mailgun/messages).

### Amazon SES v2

Instale o SDK oficial apenas se for usar SES:

```bash
npm install @aws-sdk/client-sesv2
```

```typescript
const ses = EmailFactory.createSES({
  region: process.env.AWS_REGION ?? 'us-east-1',
  defaultFrom: 'Acme <noreply@example.com>'
  // Sem credentials explícitas, o AWS SDK usa a cadeia padrão de credenciais,
  // como IAM role, variáveis de ambiente ou credenciais locais.
});

await ses.sendEmail({
  to: 'ana@example.com',
  subject: 'Recibo',
  text: 'Pagamento confirmado.'
});
ses.close();
```

O adapter usa o transporte SESv2 do Nodemailer. A identidade remetente precisa estar verificada e a role/credencial precisa da permissão `ses:SendEmail`. O transporte SES não aplica limites de taxa por si só; use a fila BullMQ ou coordenação própria para respeitar a quota da conta. O Nodemailer documenta que o transporte SES monta a mensagem completa em memória, inclusive anexos. Consulte [SES transport](https://nodemailer.com/transports/ses) e [credenciais do AWS SDK](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples-sending-email.html).

### Transportes customizados e verificação

`EmailFactory.createWithTransport(transport, defaultFrom?, templateOptions?, attachmentOptions?)` permite conectar um adapter próprio que implemente `IEmailTransport`. `verifyTransport()` funciona quando o transporte oferece um check não destrutivo; SendGrid e Mailgun não enviam requisições de teste porque a API de envio não fornece um health check seguro com permissões mínimas. Para esses provedores, valide a chave e as permissões em ambiente de implantação e monitore as respostas reais de envio.

Todas as factories aceitam as mesmas opções opcionais de template e anexos. `requestTimeoutMs` padrão das APIs SendGrid e Mailgun é 30 segundos. `maxAttachmentBytes` é opcional e limita cada anexo individual; arquivos SendGrid/Mailgun e mensagens SES podem ser bufferizados em memória. Para arquivos grandes, use limites conservadores e transporte SMTP quando apropriado.

## Templates e temas

Temas disponíveis: `ThemeType.MODERN`, `CORPORATE`, `MINIMAL`, `MONOKAI` e `SYSTEM`, cada um com variante `light` ou `dark`.

```typescript
const service = mailer.getTemplateService();

const html = await service.previewTemplate(
  ThemeType.CORPORATE,
  'light',
  {
    header: { show: true, logo: { type: 'text', text: 'Acme' } },
    body: { title: 'Olá, Ana', message: 'Veja as novidades.' },
    footer: {
      show: true,
      links: [{ text: 'Privacidade', url: 'https://example.com/privacy' }],
      unsubscribeText: 'Cancelar inscrição',
      unsubscribeUrl: 'https://example.com/unsubscribe?token=...'
    }
  },
  {}
);
```

As opções `ITemplateServiceOptions` incluem:

| Opção | Padrão | Descrição |
| --- | ---: | --- |
| `cache` | `true` | Cache em memória por configuração. Pode ser desativado por chamada com `{ cache: false }`. |
| `cacheTTL` | `3600` | TTL em segundos; `0` desativa o armazenamento. |
| `maxCacheEntries` | `100` | Limite positivo de entradas em cache; remoção aproximada LRU. |
| `maxHistoryEntries` | `100` | Limite de IDs no histórico. |
| `maxVersionsPerTemplate` | `10` | Versões mantidas por template. |
| `validateConfig` | `true` | Valida opções do template antes de renderizar. |

```typescript
import { TemplateService } from '@zyther/tzmail';

const service = new TemplateService({
  cache: true,
  cacheTTL: 900,
  maxCacheEntries: 500,
  maxHistoryEntries: 200
});
```

O cache e o histórico são locais ao processo, não distribuídos. Chame `service.dispose()` quando criar `TemplateService` diretamente e não precisar mais dele. `EmailFactory.close()` encerra o timer do serviço associado.
`getTemplateStats()` retorna `totalTemplates`, `cachedTemplates`, `totalHits`, `cacheRequests`, `cacheHitRate` e contagem por tema; solicitações que bypassam/desativam o cache não entram na taxa de acerto.

### Política de HTML e URLs

- `title`, `message`, nome do logo, textos de botões/links/rodapé e metadados textuais são escapados pelo renderer.
- `body.content` é o único campo de configuração tratado como **HTML confiável** para permitir markup personalizado. Não passe HTML fornecido por usuários sem sanitizá-lo com uma política apropriada à aplicação.
- `TemplateBuilder.buildBody()` é uma API de baixo nível e também espera HTML confiável; prefira `TemplateService` para receber validação e interpolação.
- `IEmailOptions.html` também é encaminhado como HTML fornecido pelo chamador; trate-o como conteúdo confiável ou sanitize antes do envio.
- URLs de ações e links aceitam URLs absolutas `https:`, `http:` ou `mailto:`; imagens/logos e links sociais aceitam `https:`/`http:`. Esquemas como `javascript:` e `data:` e atributos com caracteres de injeção são recusados.
- Cores e alguns valores de estilo são validados. A validação da biblioteca não substitui validação de negócio nem sanitização de HTML customizado.

Para personalização por destinatário, use `{{placeholder}}` em textos do template e passe `templateData` na mensagem. Há suporte a chaves aninhadas (`{{user.firstName}}`); os valores folha devem ser primitivos (`string`, `number`, `boolean` ou `null`) e placeholder sem valor faz o render falhar em vez de enviar texto incompleto. Valores inseridos em texto são escapados; inserções em `body.content` são escapadas antes de entrar no HTML confiável; URLs são validadas depois da interpolação.

```typescript
await mailer.sendEmail({
  to: 'ana@example.com',
  subject: 'Bem-vinda',
  template,
  templateData: {
    user: { firstName: 'Ana' },
    accountId: 'acct-123',
    actionUrl: 'https://example.com/account/acct-123'
  }
});
```

Use, por exemplo, `title: 'Olá, {{user.firstName}}'` e `buttonUrl: '{{actionUrl}}'` na configuração do template. A URL dinâmica ainda precisa obedecer aos esquemas permitidos.

## Anexos

Anexos por caminho permanecem como paths para que o Nodemailer possa transmiti-los sem carregar arquivos grandes inteiros na memória. Em produção, prefira restringir a raiz permitida e impor limite de tamanho:

```typescript
const mailer = EmailFactory.create(
  smtp,
  { cache: true, cacheTTL: 900 },
  { allowedRoot: '/srv/app/mail-attachments', maxSizeBytes: 10 * 1024 * 1024 }
);

const attachment = await mailer.getAttachmentService().addFromPath(
  '/srv/app/mail-attachments/report.pdf'
);
await mailer.sendEmail({
  to: 'finance@example.com',
  subject: 'Relatório',
  text: 'Segue o relatório.',
  attachments: [attachment]
});
```

`allowedRoot` resolve caminhos reais e rejeita escapes da raiz, inclusive por symlink no momento da validação. Mantenha a raiz e seus diretórios não graváveis por usuários não confiáveis para reduzir risco de troca do arquivo entre validação e leitura. Se não for definido, cabe à aplicação garantir que os caminhos são confiáveis. `maxSizeBytes` é opcional; anexos por buffer também são verificados. `addFromUrl()` não baixa URLs e permanece não implementado.

## Resultado e tratamento de falhas

`sendEmail()` retorna sempre um `IEmailSendResult`; validação, renderização e transporte são identificados por `errorStage`:

```typescript
type IEmailSendResult = {
  success: boolean;
  status: 'success' | 'partial' | 'failure';
  messageId?: string;
  response?: string;
  accepted?: Array<string | { address: string; name: string }>;
  rejected?: Array<string | { address: string; name: string }>;
  error?: unknown;
  errorStage?: 'validation' | 'render' | 'smtp' | 'provider';
};
```

`success` só é `true` quando o transporte não reporta destinatários rejeitados. `partial` significa aceitação e rejeição parciais; encaminhe esses casos para tratamento/retry explícito na aplicação. Uma API ou servidor aceitar a mensagem não prova entrega final, leitura ou ausência de spam.

## Desenvolvimento e validação

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm pack --dry-run
```

Os testes usam o runner nativo `node:test` e transporters falsos; não enviam e-mails reais. A pipeline do GitHub Actions executa lint, typecheck, build/testes e inspeção do pacote em pushes, pull requests e antes de publicar um release no npm.

## Considerações para produção

1. Use `BullMQEmailQueue` ou outra fila/outbox durável com workers, idempotência e retries com backoff; não repita automaticamente envios sem estratégia contra duplicatas.
2. Configure SPF, DKIM, DMARC, reputação/domínio de envio, quotas e tratamento de bounces/unsubscribe no provedor e na aplicação.
3. Guarde segredos fora do repositório e aplique rotação; não registre conteúdo de mensagem nem tokens de links.
4. Dimensione `maxConnections`/`rateLimit` com o provedor e com o número de réplicas. Os limites do Nodemailer pool são locais; o limiter BullMQ é compartilhado pela fila.
5. Monitore `status`, `errorStage`, `accepted`/`rejected`, latência e filas com logs redigidos e métricas próprias.

## Licença

ISC. Consulte `LICENSE`/metadados do repositório para os termos aplicáveis.
