#!/usr/bin/env bash

if [[ -z "$(command -v lcp)" ]]
then
  npm install -g local-cors-proxy
fi

kubectl config use-context data-science-production

parallel --line-buffer ::: 'kubectl port-forward $(kubectl get pods | grep playlist-recommendation-api | cut -d " " -f 1) 8080:8080' 'lcp --proxyUrl http://localhost:8080'
