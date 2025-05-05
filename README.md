# Future of Work

[![build status](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/badges/master/build.svg)](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/pipelines?scope=branches) 

Take a look at the app in the _App Store_ here:

[![Lines of Code](https://sonarqube.basf.net/api/project_badges/measure?branch=development&project=Future_of_Work&metric=ncloc&token=b8f8177cfe3c8770bdf14215e88bfce5639ca4b0)](https://sonarqube.basf.net/dashboard?id=Future_of_Work&branch=development)


| App  | LOG  | Kibana  |
|---|---|---|
| [Dev](https://app-dev.roqs.basf.net/future_of_work/) | [Dev](https://app-dev.roqs.basf.net/kubecuddle/v2/pod.html?deployment=future-of-work&namespace=future-of-work-dev) | [Dev](https://app-dev.roqs.basf.net/kibana/app/kibana#/discover?_g=()&_a=(columns:!(message),index:'531e0890-ce55-11e9-b491-8b6feaa9763f',interval:auto,query:(language:lucene,query:'docker.container.image:future-of-work'),sort:!('@timestamp',desc)))|
| [QA](https://app-qa.roqs.basf.net/future_of_work/) | [QA](https://app-qa.roqs.basf.net/kubecuddle/v2/pod.html?deployment=future-of-work&namespace=future-of-work-qual) | [QA](https://app-qa.roqs.basf.net/kibana/app/kibana#/discover?_g=()&_a=(columns:!(message),index:'531e0890-ce55-11e9-b491-8b6feaa9763f',interval:auto,query:(language:lucene,query:'docker.container.image:future-of-work'),sort:!('@timestamp',desc)))|
| [Prod](https://app.roqs.basf.net/future_of_work/) | [Prod](https://app.roqs.basf.net/kubecuddle/v2/pod.html?deployment=future-of-work&namespace=future-of-work-prod) | [Prod](https://app.roqs.basf.net/kibana/app/kibana#/discover?_g=()&_a=(columns:!(message),index:'531e0890-ce55-11e9-b491-8b6feaa9763f',interval:auto,query:(language:lucene,query:'docker.container.image:future-of-work'),sort:!('@timestamp',desc)))|


### Modes of running

#### dev profile
```
cd backend
npm run serve
```

```
cd frontend
npm run dev
```

#### prod profile

```
docker-compose build --parallel --pull --force-rm
docker-compose up
```

### Your current setup

* __Docker__: We already containerized your node.js-server. It's ready to be deployed anywhere.
* __CI/CD__: Remember the days you scratched your head on how and when to deploy? Those days are over! We already made sure your app gets automatically build and deployed the moment you make a change! Checkout the pipelines [here](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/pipelines?scope=branches).
* __Authentication__: Do you want to secure your app and are you planning to make your app available in the _App Store_? We got you covered!
Authentication is implemented as a middleware, so you can place it in front of any endpoint. Check oyut the functions `auth.enticate` and `auth.orize` in the _User Registry_ [example](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/blob/master/routes/users.js) that comes with this template. These functions are defined in [auth.js](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/blob/master/middleware/auth.js).
* __Code Style__: We included a configuration to _"enforce"_ a consistent code style into this template. It's based on [ESLint](https://eslint.org/) and [Prettifier](https://www.npmjs.com/package/prettifier) and uses a predefined styleguide called _standard_. On top, we included a configuration for the popular code editor [VS Code](https://code.visualstudio.com/) that applies these style rules to your code whenever you hit Save.
Note that this is just a recommendation and you can __switch this off__ or edit these rules any time! See the files [.eslintrc.json](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/blob/master/.eslintrc.json) and [.vscode/settings.json](https://gitlab.roqs.basf.net/bsa-gtu/future-of-work/blob/master/.vscode/settings.json).
* __API Documentation__: Your app comes with a Swagger UI that is auto-generated from your code documentation based on the [OpenAPI 3.0.0](https://swagger.io/docs/specification/about/) standard. Note that the variable `servers` will be adjusted to match the appstore environment **in production mode**.
* __CORS__ (Cross Origin Request ...): To enable CORS, put the `cors()` middleware into your endpoints or globally into your app. Note that if you want to support less common HTTP methods (such as DELETE), you might need to enable a PRE-FLIGHT request option. Find details [here](https://expressjs.com/en/resources/middleware/cors.html#enabling-cors-pre-flight)

### Get started

You need the [Node.js package manager](https://www.npmjs.com/) for development. Then follow these rules:

```
git clone git@gitlab.roqs.basf.net:bsa-gtu/future-of-work.git
cd future-of-work
npm i
npm run serve
```
This will start your API in __development mode__. In contrast, the live version runs in production mode.
