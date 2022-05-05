![](https://i.imgur.com/ONTIffX.png)

[![Build Status](https://cloud.drone.io/api/badges/mohemohe/parakeet/status.svg)](https://cloud.drone.io/mohemohe/parakeet)
[![Go Report Card](https://goreportcard.com/badge/github.com/mohemohe/parakeet)](https://goreportcard.com/report/github.com/mohemohe/parakeet)
[![codebeat badge](https://codebeat.co/badges/78e7a889-e831-4bad-bd22-43b4290cc956)](https://codebeat.co/projects/github-com-mohemohe-parakeet-master)
[![GitHub](https://img.shields.io/github/license/mohemohe/parakeet.svg)](https://github.com/mohemohe/parakeet/blob/master/LICENSE)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmohemohe%2Fparakeet.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmohemohe%2Fparakeet?ref=badge_shield)
[![MicroBadger Size](https://img.shields.io/microbadger/image-size/mohemohe/parakeet)](https://hub.docker.com/r/mohemohe/parakeet)

Fast weblog built in golang and top of echo.  
Supports React SSR and hydrate.

## Require

- [MongoDB](https://www.mongodb.com)

## Quickstart

```
wget https://raw.githubusercontent.com/mohemohe/parakeet/master/docker-compose.yml
docker-compose up -d
```

You can see parakeet on [0.0.0.0:1323](http://127.0.0.1:1323).  
Admin page is [/admin](http://127.0.0.1:1323/admin) and default root password is 'root'.

## Production usage

1. Create MongoDB via [Atlas](https://cloud.mongodb.com)
2. Deploy [mohemohe/parakeet](https://hub.docker.com/r/mohemohe/parakeet) in any Docker (e.g. swarm, k8s, Amazon ECS ...) and set below environment variables

### Environment variables

| key           | value                                                                                                                     |
|:--------------|:--------------------------------------------------------------------------------------------------------------------------|
| ECHO_ENV      | production                                                                                                                |
| ECHO_SSR      | true                                                                                                                      |
| MONGO_ADDRESS | mongodb://{user}:{password}@{replset-1},{replset-2},{replset-3}/{database}?ssl=true&replicaSet={replset}&authSource=admin |
| MONGO_SSL     | true                                                                                                                      |
| ROOT_PASSWORD | {initial root password}                                                                                                   |
| SIGN_SECRET   | {jwt secret}                                                                                                              |

## License

Icons made by [Zlatko Najdenovski](https://www.flaticon.com/authors/zlatko-najdenovski) from [www.flaticon.com](https://www.flaticon.com/)

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmohemohe%2Fparakeet.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmohemohe%2Fparakeet?ref=badge_large)
