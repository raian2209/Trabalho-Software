# Sistema Loja

API REST feita com Spring Boot, PostgreSQL e JWT. O projeto tambem possui uma estrutura de teste de performance com JMeter em modo CLI, executado por Docker, sem interface grafica e sem necessidade de instalar JMeter localmente.

## Requisitos

- Docker
- Docker Compose

Nao e necessario instalar Java, Maven, PostgreSQL ou JMeter na maquina para rodar via Docker.

## Estrutura

```text
sistema-loja/
  Dockerfile
  docker-compose.yml
  .env
  .env.example
  pom.xml
  src/
  performance/
    jmeter/
      config/
        default.properties
      data/
        .gitkeep
      plans/
        auth-users-cli.jmx
      results/
        .gitkeep
```

## Servicos Docker

O `docker-compose.yml` possui tres servicos:

```text
postgres-db  Banco PostgreSQL
spring-app   Aplicacao Spring Boot
jmeter       JMeter em modo CLI/headless
```

O servico `jmeter` fica no profile `performance`, entao ele nao sobe junto com a aplicacao por padrao. Ele so executa quando chamado explicitamente.

## Variaveis de Ambiente

As variaveis ficam no arquivo `.env`.

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=suaSenhaSuperSecreta
POSTGRES_DB=gerenciamento_db
POSTGRES_PORT=5432

DB_URL=jdbc:postgresql://postgres-db:5432/gerenciamento_db
JWT_SECRET_KEY=suaChaveSecretaSuperLongaComPeloMenos256BitsParaHS256
JWT_EXPIRATION=86400000
APP_PORT=8080

JMETER_IMAGE=justb4/jmeter:5.6.3
```

Dentro do Docker, a aplicacao acessa o banco por:

```text
postgres-db:5432
```

Por isso a `DB_URL` usa:

```text
jdbc:postgresql://postgres-db:5432/gerenciamento_db
```

## Como Executar a Aplicacao

Na pasta raiz do projeto, onde esta o `docker-compose.yml`, execute:

```bash
docker compose up --build -d
```

Esse comando sobe:

```text
postgres-db
spring-app
```

A API ficara disponivel em:

```text
http://localhost:8080
```

Para acompanhar os logs da aplicacao:

```bash
docker compose logs -f spring-app
```

Para acompanhar os logs do banco:

```bash
docker compose logs -f postgres-db
```

Para parar os containers:

```bash
docker compose down
```

Para parar e apagar os dados do banco:

```bash
docker compose down -v
```

## Usuario Admin Inicial

Ao iniciar, a aplicacao cria um usuario admin automaticamente:

```text
email: admin@suaempresa.com
senha: admin123
```

Esse usuario e usado pelo plano JMeter para autenticar e executar chamadas administrativas.

## JMeter via Docker CLI

O JMeter roda sem interface grafica usando o modo `-n`.

Antes de executar os testes, suba a aplicacao:

```bash
docker compose up --build -d
```

Depois execute o plano JMeter:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/run-001.jtl -e -o /jmeter/results/report-run-001
```

Ao finalizar, os resultados ficam em:

```text
performance/jmeter/results/run-001.jtl
performance/jmeter/results/report-run-001/index.html
```

Para uma nova execucao, use outra pasta de resultado:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/run-002.jtl -e -o /jmeter/results/report-run-002
```

O JMeter exige que a pasta do relatorio HTML ainda nao exista ou esteja vazia.

## Executar JMeter Sem Relatorio HTML

Se quiser gerar apenas o arquivo `.jtl`:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/run-001.jtl
```

## Executar JMeter Com Mais Carga

As configuracoes podem ser sobrescritas com parametros `-J`.

Exemplo com 20 usuarios virtuais, subida gradual em 30 segundos e 5 repeticoes:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/carga-20.jtl -e -o /jmeter/results/report-carga-20 -Jthreads=20 -JrampUp=30 -Jloops=5
```

## Configuracoes Disponiveis no JMeter

As configuracoes padrao ficam em:

```text
performance/jmeter/config/default.properties
```

Opcoes principais:

```properties
protocol=http
host=spring-app
port=8080

threads=5
rampUp=10
loops=1
onSampleError=continue

adminEmail=admin@suaempresa.com
adminPassword=admin123
userPassword=senha12345
```

Descricao:

```text
protocol       Protocolo da API, normalmente http
host           Host da aplicacao visto pelo container JMeter
port           Porta da aplicacao
threads        Quantidade de usuarios virtuais
rampUp         Tempo, em segundos, para iniciar todos os usuarios virtuais
loops          Quantidade de repeticoes por usuario virtual
onSampleError  Comportamento quando uma requisicao falha
adminEmail     Email do admin inicial
adminPassword  Senha do admin inicial
userPassword   Senha usada nos usuarios criados durante o teste
```

Quando o JMeter roda dentro do Docker Compose, use:

```text
host=spring-app
```

Se algum dia quiser testar uma API rodando fora do Compose, use:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/local-api.jtl -e -o /jmeter/results/report-local-api -Jhost=host.docker.internal -Jport=8080
```

## Configurar Pela Interface do JMeter

A execucao oficial do projeto e via Docker CLI, mas voce tambem pode abrir o plano pela interface grafica do JMeter para editar visualmente os cenarios.

Use a interface apenas para configurar e salvar o arquivo `.jmx`. Depois execute a carga real pelo Docker, em modo CLI.

Arquivo que deve ser aberto na interface:

```text
performance/jmeter/plans/auth-users-cli.jmx
```

Passo a passo:

```text
1. Abra o Apache JMeter na sua maquina.
2. Va em File > Open.
3. Selecione performance/jmeter/plans/auth-users-cli.jmx.
4. Edite os itens desejados na arvore do plano.
5. Salve o arquivo.
6. Execute novamente pelo Docker Compose em modo CLI.
```

Principais pontos para configurar na interface:

```text
Thread Group
  Number of Threads: quantidade de usuarios virtuais
  Ramp-up period: tempo para iniciar todos os usuarios
  Loop Count: quantidade de repeticoes

HTTP Defaults
  Protocol: ${protocol}
  Server Name or IP: ${host}
  Port Number: ${port}

Headers JSON
  Content-Type: application/json
  Accept: application/json

Extrair token usuario
  JSON Path: $.token
  Variable name: userToken

Extrair token admin
  JSON Path: $.token
  Variable name: adminToken
```

Para manter o plano compativel com Docker, prefira deixar os valores como variaveis:

```text
${protocol}
${host}
${port}
${threads}
${rampUp}
${loops}
${adminEmail}
${adminPassword}
${userPassword}
```

Essas variaveis sao preenchidas por:

```text
performance/jmeter/config/default.properties
```

Ou sobrescritas na execucao com `-J`, por exemplo:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/gui-editado.jtl -e -o /jmeter/results/report-gui-editado -Jthreads=10 -JrampUp=20 -Jloops=2
```

Se quiser testar rapidamente pela propria interface do JMeter, ajuste temporariamente:

```text
host=localhost
port=8080
```

Nesse caso, a aplicacao precisa estar acessivel em:

```text
http://localhost:8080
```

Antes de salvar o plano para uso no Docker, volte o host para:

```text
spring-app
```

Ou deixe o campo usando a variavel:

```text
${host}
```

Cuidados ao usar a interface:

```text
Nao use a interface para teste de carga grande.
Use a interface apenas para montar, ajustar e depurar o plano.
Para carga real, use sempre o modo CLI com Docker.
Evite deixar listeners pesados habilitados, como View Results Tree, em testes grandes.
Nao coloque senhas fixas novas dentro do .jmx se puder usar variaveis.
```

## Plano JMeter Disponivel

Plano:

```text
performance/jmeter/plans/auth-users-cli.jmx
```

Fluxo executado:

```text
1. Cria um usuario dinamico em POST /api/users/usuario
2. Faz login com esse usuario em POST /api/auth/login
3. Extrai o token JWT do usuario
4. Faz login com o admin inicial em POST /api/auth/login
5. Extrai o token JWT do admin
6. Executa GET /api/users com Authorization: Bearer <token-admin>
```

Esse plano e bom para validar:

```text
cadastro de usuario
login
geracao de JWT
consulta administrativa
tempo de resposta da API
comportamento do banco sob carga
```

## Exemplos de Execucao

Smoke test pequeno:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/smoke.jtl -e -o /jmeter/results/report-smoke -Jthreads=1 -JrampUp=1 -Jloops=1
```

Carga moderada:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/moderada.jtl -e -o /jmeter/results/report-moderada -Jthreads=25 -JrampUp=30 -Jloops=3
```

Carga maior:

```bash
docker compose --profile performance run --rm jmeter -n -q /jmeter/config/default.properties -t /jmeter/plans/auth-users-cli.jmx -l /jmeter/results/carga-maior.jtl -e -o /jmeter/results/report-carga-maior -Jthreads=100 -JrampUp=60 -Jloops=5
```

## Limpar Resultados

Os resultados gerados pelo JMeter ficam em:

```text
performance/jmeter/results/
```

Essa pasta esta ignorada pelo Git, exceto o arquivo `.gitkeep`.

Para apagar os resultados, remova os arquivos `.jtl` e as pastas de relatorio criadas dentro de:

```text
performance/jmeter/results/
```

## Solucao de Problemas

Erro durante o build Docker:

```text
Failed to execute goal org.apache.maven.plugins:maven-resources-plugin:3.3.1:resources
MalformedInputException: Input length = 1
```

Esse erro acontece quando algum arquivo em `src/main/resources` esta salvo com encoding diferente de UTF-8 e o Maven tenta processar os resources dentro do container.

Neste projeto, os arquivos `.properties` foram deixados em UTF-8 seguro e sem caracteres especiais nos comentarios:

```text
src/main/resources/application.properties
src/test/resources/application.properties
```

O `pom.xml` tambem declara:

```xml
<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
<project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
```

Se o erro voltar depois de editar algum `.properties`, salve o arquivo novamente como UTF-8 e evite comentarios com encoding misturado.

## Observacoes

- O JMeter nao foi adicionado como dependencia Maven, porque ele nao faz parte da aplicacao.
- A execucao e feita por Docker usando a imagem configurada em `JMETER_IMAGE`.
- O plano roda em modo CLI com `-n`, sem interface grafica.
- O relatorio HTML e gerado com `-e -o`.
- Para repetir uma execucao com relatorio HTML, use uma nova pasta em `performance/jmeter/results/`.
