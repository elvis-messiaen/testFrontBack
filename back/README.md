# testFrontBack

# Installation

Pré-requis
Java 8
Docker
Maven
mysql
Installation des Dépendances

## Installation de docker sur votre machine :

https://docs.docker.com/get-docker/

# Installation de Docker

## Windows

1. Téléchargez l'installateur de Docker Desktop depuis [Docker Hub](https://www.docker.com/products/docker-desktop).
2. Suivez les instructions de l'installateur pour compléter l'installation.
3. Redémarrez votre ordinateur si nécessaire.
4. Lancez Docker Desktop depuis le menu Démarrer.

## MacOS

1. Téléchargez Docker Desktop pour Mac depuis [Docker Hub](https://www.docker.com/products/docker-desktop).
2. Ouvrez le fichier téléchargé et suivez les instructions pour déplacer Docker dans le dossier Applications.
3. Lancez Docker depuis le dossier Applications.
4. Suivez les instructions à l'écran pour terminer la configuration initiale.

## Linux

1. Suivez les instructions spécifiques à votre distribution Linux sur [la documentation Docker](https://docs.docker.com/engine/install/).

## Vérification

Pour vérifier que Docker est correctement installé, ouvrez un terminal et tapez la commande suivante :
docker --version

## cloner le projet

depuis vs code ou tous autre ide :
git clone https://github.com/elvis-messiaen/testFrontBack.git

## Installer les dépendances

mvn install

## Lancer l'application

mvn spring-boot:run

## Génération Automatique des Tables

Les tables de la base de données sont générées automatiquement lors du démarrage de l'application. Cette fonctionnalité est activée par la configuration de la propriété suivante dans le fichier `application.properties` :

properties :
spring.jpa.hibernate.ddl-auto=update

## Lancement des test avec Junit 5

Depuis le terminal du projet :
cd back/
mvn test

## lancement du coverrage avec JaCoCo

mvn clean verify
mvn clean test -P exclude-dto-mapper

# ouvrir le fichier de coverage

allez dans target
puis site/jacoco
clic droit sur index.html
choisir OpenPreview

# ouvrir le fichier de coverage sur une page web

mvn clean install && open target/site/jacoco/index.html
