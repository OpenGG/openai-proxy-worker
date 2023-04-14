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

4. Put secrets into worker. This step can be done with cli or via web.

```bash
# Auth keys for incoming requests
# Make sure it is STRONGGGGGGGG enough
wrangler secret put SECRET_AUTH_KEYS

# Api key for invoking OpenAI API
wrangler secret put SECRET_OPENAI_API_KEY

# Setting allow list of models
wrangler env put ENV_OPENAI_ALLOWED_MODELS
```

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
