#!/usr/bin/env sh

set -e
while ! nc -z localhost 5432; do echo Waiting... && sleep 5; done;

npm run db:migrate
npm run start
