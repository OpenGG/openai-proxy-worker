# openai-proxy-worker

Proxy OpenAI api requests through cloudflare workers.

## Usage


1. Prepare project.

```bash
pnpm i

cp wrangler.toml.example wrangler.toml
cp .dev.vars.example .dev.vars
```

2. Change worker name with your own.

```bash
vi wrangler.toml
```

3. (optional) Fill SECRET_OPENAI_API_KEY for local development.
```bash
vi .dev.vars

pnpm run dev
```

4. Put secrets into worker. This step can be done via web. See: [Add environment variables via the dashboard](https://developers.cloudflare.com/workers/platform/environment-variables/#environment-variables-via-the-dashboard)

* `SECRET_AUTH_KEYS`: Auth keys for incoming requests. Make sure it is **STRONGGGGGGGG** enough.
* `SECRET_OPENAI_API_KEY`: Api key for invoking OpenAI API. See: [API keys on OpenAI](https://platform.openai.com/account/api-keys)
* `ENV_OPENAI_ALLOWED_MODELS`: Allowed list of models. See: [Model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility)

5. Deploy worker.

```bash
pnpm run deploy
```

6. Request with an auth key

```bash
curl --verbose --request POST 'https://your-worker.workers.dev/v1/chat/completions' \
--header 'Authorization: KEY your_auth_key' \
--header 'Content-Type: application/json' \
--data-raw '{
 "model": "gpt-3.5-turbo",
 "messages": [{
    "role": "user",
    "content": "Tell me who you are"
 }]
}'
```

Notes:

* Suggestion for `ENV_OPENAI_ALLOWED_MODELS`: `gpt-3.5-turbo, gpt-3.5-turbo-0301, text-curie-001, text-babbage-001, text-ada-001`
