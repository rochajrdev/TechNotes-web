---
title: "TypeScript: Padrões com Generics e Tipos Utilitários"
description: "Domine Generics, Mapped Types, Inferência com conditional types e os utilitários mais poderosos do TypeScript."
category: "Desenvolvimento Web"
categorySlug: "web"
tags: ["#typescript", "#generics", "#react", "#types"]
readingTime: "8 min"
date: "2026-08-05"
badge: "TypeScript"
---

## 1. O que são Generics?

Generics permitem criar funções, interfaces e classes que funcionam com múltiplos tipos preservando a tipagem estática exata em vez de usar `any` ou `unknown`.

```typescript
// Função genérica com restrição (Type Constraint)
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "Lucas", role: "admin" };
const userName = getProperty(user, "name"); // Tipo inferido: string
```

---

## 2. Tipos Condicionais e a palavra-chave `infer`

Com tipos condicionais, o TypeScript pode extrair tipos internos de Promises, funções e arrays dinamicamente:

```typescript
// Desembrulha o tipo retornado por uma Promise
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

type ApiResult = Promise<{ status: number; data: string[] }>;
type Extracted = UnwrapPromise<ApiResult>; // { status: number; data: string[] }
```

> **Dica Prática:** No Next.js e React Server Components, você pode usar `Awaited<ReturnType<typeof suaFuncaoAsync>>` nativamente para extrair o tipo retornado por Server Actions!
