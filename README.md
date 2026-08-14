# @limerencerecords/backend-contract

Backend-контракт для взаимодействия сервисов лейбла Limerence Records.

Пакет содержит Zod-схемы для проверки данных во время выполнения, выведенные из них TypeScript-типы и общие идентификаторы RabbitMQ.

## Установка

```bash
npm install @limerencerecords/backend-contract
```

В продакшене рекомендуется фиксировать точную версию пакета:

```json
{
  "dependencies": {
    "@limerencerecords/backend-contract": "0.0.3"
  }
}
```

## Использование

### Отправление электронного письма

```ts
import { SendEmailCommand } from "@limerencerecords/backend-contract";

const payload: SendEmailCommand.Payload = {
  id: "309",
  from: "director@limerencerecords.com",
  to: ["recipient@example.com"],
  cc: [],
  bcc: [],
  text: "Hello",
  recipientIds: ["901"],
};

SendEmailCommand.PayloadSchema.parse(payload);

emailQueue.emit(SendEmailCommand.routingKey, { content: payload });
```

### Обработка команды в email-microservice

Микросервис получает из RabbitMQ неизвестные данные и проверяет их по схеме. После успешной проверки `command` имеет гарантированную структуру `SendEmailCommand.Payload`.

```ts
import { SendEmailCommand } from "@limerencerecords/backend-contract";

async function handleRabbitMessage(message: unknown) {
  const command = SendEmailCommand.PayloadSchema.parse(message);

  await sendEmailViaSmtp(command);
}
```

Пакет отвечает только за структуру и проверку данных. Получение сообщения из RabbitMQ и отправка письма через SMTP остаются задачами `email-microservice`.

## Разработка

```bash
npm ci
npm test
npm run pack:check
```

## Порядок создания новой версии

1. Обновите версию пакета командой `npm version patch`, `npm version minor` или `npm version major`.
2. Отправьте коммит и тег в GitHub командой `git push origin dev --follow-tags`.
3. Workflow `publish.yml` автоматически опубликует тег `vX.Y.Z` в npm через npm Trusted Publishing.
