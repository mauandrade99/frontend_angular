# Frontend Angular para API de Gerenciamento

Este projeto é um frontend moderno desenvolvido com **Angular**, projetado para consumir e interagir com uma API REST de gerenciamento de usuários e endereços. A aplicação implementa uma interface de usuário reativa e responsiva (SPA - Single Page Application) com funcionalidades completas de autenticação e CRUD.

Este frontend é o "par" da API REST desenvolvida no projeto [**fullstackapi**](https://github.com/mauandrade99/fullstackapi).

## ✨ Funcionalidades

-   **Autenticação de Usuário:** Telas de Login e Registro com validação de formulário e feedback visual.
-   **Dashboard Interativo:**
    -   Visão de **Administrador** com listagem paginada de todos os usuários.
    -   Funcionalidades de **CRUD** para gerenciar usuários e seus respectivos endereços através de modais.
    -   Visão de **Usuário Comum** focada no gerenciamento de seus próprios endereços.
-   **Segurança no Frontend:** Proteção de rotas com Auth Guards e envio automático de tokens JWT com Interceptors.
-   **Integração com API Externa:** Busca de CEP em tempo real no formulário de endereço para preenchimento automático.
-   **Design Responsivo:** Interface construída com Bootstrap 5, adaptável a desktops e dispositivos móveis.

## 🛠️ Tecnologias Utilizadas

-   **Framework:** Angular 17+
-   **Linguagem:** TypeScript
-   **Gerenciamento de Estado:** Serviços do Angular (RxJS)
-   **Estilização:** Bootstrap 5, Font Awesome, SCSS
-   **Cliente HTTP:** Angular `HttpClient`
-   **Gerenciador de Pacotes:** npm

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar o frontend na sua máquina.

### 1. Pré-requisitos

-   **Node.js e npm:** É necessário ter a versão LTS do [Node.js](https://nodejs.org/) instalada.
-   **Angular CLI:** Instale a interface de linha de comando do Angular globalmente:
    ```sh
    npm install -g @angular/cli
    ```
-   **API Backend:** A [API backend](https://github.com/mauandrade99/fullstackapi) deve estar em execução (seja localmente ou no servidor de produção), pois este frontend depende dela para funcionar.

### 2. Clonar o Repositório

```sh
git clone https://github.com/mauandrade99/frontend_angular
cd frontend-angular
```

### 3. Instalar as Dependências

Dentro da pasta do projeto, execute o comando abaixo para instalar todos os pacotes necessários (como Bootstrap, Font Awesome, etc.).

```sh
npm install
```

### 4. Configurar a URL da API

Por padrão, o projeto está configurado para consumir a API rodando localmente. Se você precisa apontar para o servidor de produção, edite o seguinte arquivo:

-   **Arquivo:** `src/environments/environment.ts`
-   Altere a propriedade `apiUrl`:
    ```typescript
    export const environment = {
      production: false,
      // Altere para a URL da sua API, se necessário
      apiUrl: 'http://localhost:8080/fullstack/api' 
    };
    ```

### 5. Iniciar o Servidor de Desenvolvimento

Com tudo configurado, inicie a aplicação com o comando:

```sh
ng serve -o
```

O comando `-o` abrirá automaticamente a aplicação no seu navegador padrão, no endereço **[http://localhost:4200](http://localhost:4200)**.

A partir daí, você pode testar todo o fluxo de registro, login e gerenciamento no dashboard.

### 6. Iniciar o Servidor de Produção IIS

```sh
ng build --base-href /nome-da-sua-pasta-raiz/
```

**Localize os Arquivos Gerados:**

Após o build, o Angular criará uma nova pasta na raiz do seu projeto chamada dist/.
Dentro dela, haverá outra pasta com o nome do seu projeto (ex: dist/frontend-angular/browser/).
Copie todo o conteúdo desta pasta (index.html, styles.css, main.js, etc.) é a sua aplicação pronta para ser publicada.

**Ajuste o arquivo web.config**

```sh
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <!-- Altere '/nome-da-sua-pasta-raiz/index.html' para o caminho correto do seu subdiretório -->
          <action type="Rewrite" url="/nome-da-sua-pasta-raiz/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

## 🌐 Aplicação Publicada para Teste

Uma versão de demonstração da aplicação está disponível online. Você pode acessá-la e testar as funcionalidades diretamente no navegador.

**Versão Angular**

- **URL de Acesso:** **[https://vpsw2882.publiccloud.com.br/frontend-angular/auth/login](https://vpsw2882.publiccloud.com.br/frontend-angular/auth/login)**
- **Usuário Administrador:**
  - **Email:** `admin@admin`
  - **Senha:** `123456`