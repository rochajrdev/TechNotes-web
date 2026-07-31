---
title: "Automação Avançada com Shell & Traps"
description: "Como criar scripts resilientes usando traps para limpeza automática, manipulação de sinais e processamento paralelo com xargs."
category: "Shell & Linux"
categorySlug: "shell"
tags: ["#bash", "#traps", "#xargs", "#automacao", "#linux"]
readingTime: "7 min"
date: "2026-08-05"
badge: "Avançado"
---

## 1. Tratamento de Sinais com Traps

Em scripts de produção, é comum criar arquivos temporários ou travar processos. Se o usuário pressionar `Ctrl + C` (sinal SIGINT) ou o script falhar, os arquivos temporários podem ficar órfãos.

A instrução `trap` garante que uma função de limpeza seja **sempre** executada na saída do script:

```bash
#!/usr/bin/env bash
set -euo pipefail

TEMP_DIR=$(mktemp -d)

# Função de limpeza automática
cleanup() {
    echo "➜ Executando rotina de limpeza..."
    rm -rf "$TEMP_DIR"
    echo "✓ Diretório temporário $TEMP_DIR removido com segurança!"
}

# Registra a limpeza para qualquer saída (EXIT, SIGINT, SIGTERM)
trap cleanup EXIT INT TERM

echo "Trabalhando no diretório temporário: $TEMP_DIR"
# Simula trabalho...
sleep 2
```

> **Importante:** Registrar o trap no sinal `EXIT` garante que a limpeza rode tanto quando o script termina com sucesso quanto quando é interrompido com erro.

---

## 2. Processamento Paralelo com xargs

Quando você precisa processar centenas ou milhares de arquivos (ex: compactação, conversão de imagens, downloads), usar um loop sequencial simples pode demorar horas. O utilitário `xargs` permite paralelizar tarefas utilizando todos os núcleos da CPU.

```bash
# Executa 4 processos em paralelo simultaneamente (-P 4)
find ./imagens -type f -name "*.png" | xargs -P 4 -I {} cwebp -q 85 {} -o {}.webp
```

### Tabela de Comparação de Desempenho

| Método | Tempo para 1.000 imagens | Uso de CPU |
| :--- | :--- | :--- |
| **Loop for simples** | ~ 4m 30s | 1 núcleo (25%) |
| **xargs -P 4 (Paralelo)** | ~ 1m 12s | 4 núcleos (100%) |

---

## 3. Logs Estruturados em JSON no Shell

Para integrar seus scripts com ferramentas modernas de observabilidade (como Datadog, Grafana Loki ou CloudWatch), você pode formatar as saídas diretamente em JSON:

```bash
log_json() {
    local level="$1"
    local message="$2"
    printf '{"timestamp":"%s","level":"%s","message":"%s"}\n' \
        "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$level" "$message"
}

log_json "INFO" "Deploy iniciado na branch main"
log_json "WARN" "Uso de memória atingiu 82%"
```
