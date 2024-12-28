## testFront

# prérequis:

> node.js

# installer faker

> cd front/
> npm install @faker-js/faker --save-dev

## tests Jest

# dans le terminal du projet :

> cd front/

# lancé les dépendance du projet :

> npm i

# lancement des test dans le terminal :

> npm run test

# lancement des test coverage dans le terminal :

> npx jest --coverage

# Ouvrire le rapport dans la page web :

> open coverage/jest/lcov-report/index.html

## tests cypress

# lancement du backend

> cd back/

# pour les dépendances

> mvn clean build
> mvn spring-boot:run

# lancement du frontend

> ouvrez un autre terminal split
> cd front/

# Si vous avez pas déjà mi les dépendances :

> npm i

# dans le terminal :

> cd front/
> npx cypress open
> une page s'ouvre cliquez sur E2E testing
> Choisissez Chrome et start
> Vous pouvez lancez les tests en cliquant par exemple sur login

# coverage cypress

dans le terminal :

> npx cypress run test
> npx cypress run --env coverage=true
