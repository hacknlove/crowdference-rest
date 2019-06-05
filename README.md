# With Traefik

## docker-compose.yml
```
version: '3.2'
services:
  rest-api:
    restart: always
    image: hacknlove/crowdference-rest-api:latest
    logging:
      driver: json-file
      options:
        max-size: "200k"
        max-file: "10"
    expose:
      - 8000
    env_file: ./environment.sh
    networks:
      - web
      - default
    labels:
      - "traefik.port=8000"
      - "traefik.enable=true"
      - "traefik.frontend.rule=Host:example.com"
      - "traefik.docker.network=web"
```

## environment.sh
```
MONGO_URL="..."
```
