KNS=error-ferret

.PHONY: dev-up dev-down nats-portforward compose-up compose-down

dev-up:
	kubectl apply -k infra/k8s/overlays/dev

dev-down:
	kubectl delete -k infra/k8s/overlays/dev || true

nats-portforward:
	kubectl -n $(KNS) port-forward svc/nats 4222:4222 8222:8222

compose-up:
	docker compose -f infra/local/docker-compose.yml up -d

compose-down:
	docker compose -f infra/local/docker-compose.yml down