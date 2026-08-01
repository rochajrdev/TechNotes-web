---
title: "Kubernetes: Arquitetura, Pods, Deployments e Services"
description: "Guia introdutório e prático sobre os principais conceitos do Kubernetes (K8s) para quem vem do Docker Compose."
category: "DevOps & Ferramentas"
categorySlug: "devops"
tags: ["#kubernetes", "#k8s", "#devops", "#containers"]
readingTime: "10 min"
date: "2026-08-05"
badge: "Kubernetes"
---

## 1. Arquitetura Básica do Kubernetes

O Kubernetes orquestra containers em clusters através de dois blocos principais:

1. **Control Plane (Master Node):** Gerencia o estado do cluster, escalabilidade e agendamento de pods (`kube-apiserver`, `etcd`, `kube-scheduler`).
2. **Worker Nodes:** As máquinas onde os containers realmente são executados (`kubelet`, `kube-proxy`, container runtime).

---

## 2. Manifesto de Deployment & Service

No Kubernetes, declaramos o estado desejado através de manifestos YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: technotes-api
  labels:
    app: technotes-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: technotes-api
  template:
    metadata:
      labels:
        app: technotes-api
    spec:
      containers:
      - name: api
        image: technotes/api:1.0.0
        ports:
        - containerPort: 3000
        resources:
          limits:
            memory: "256Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: technotes-service
spec:
  type: ClusterIP
  selector:
    app: technotes-api
  ports:
  - port: 80
    targetPort: 3000
```

> **Dica:** O recurso `ClusterIP` cria um balanceador de carga interno estável com DNS automático dentro do cluster (`http://technotes-service`).
