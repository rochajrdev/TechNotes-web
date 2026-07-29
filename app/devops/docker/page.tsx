import Link from "next/link";
import {
  Container,
  ChevronRight,
  Clock,
  Calendar,
  Layers,
  HardDrive,
  Network,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata = {
  title: "Docker & Containerização - TechNotes",
  description: "Guia prático de Dockerfiles multi-stage, Docker Compose, Volumes e Comandos Essenciais.",
};

export default function DockerPage() {
  return (
    <article className="space-y-10 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-zinc-500">
        <Link href="/" className="hover:text-zinc-300 transition-colors">
          Início
        </Link>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-zinc-400">DevOps & Ferramentas</span>
        <ChevronRight className="h-3 w-3 text-zinc-600" />
        <span className="text-cyan-400 font-medium">Docker & Compose</span>
      </nav>

      {/* Header Section */}
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">#docker</Badge>
          <Badge variant="success">#compose</Badge>
          <Badge variant="purple">#containers</Badge>
          <Badge variant="outline">#devops</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Docker & Containerização
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Aprenda a construir imagens ultra-leves com Multi-stage builds, orquestrar múltiplos serviços
          com Docker Compose e gerenciar redes e volumes em ambientes de desenvolvimento e produção.
        </p>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 pt-2">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-zinc-400" />
            9 min de leitura
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            Guia de Produção
          </span>
        </div>
      </header>

      {/* Section 1: Multi-stage Dockerfile */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Multi-Stage Build Otimizado (Node/Next.js)
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          O padrão <strong className="text-white">Multi-stage</strong> separa o ambiente de compilação pesado do container final de execução, reduzindo o tamanho da imagem de ~1GB para menos de 100MB e eliminando ferramentas de build em produção por segurança.
        </p>

        <CodeBlock
          filename="Dockerfile"
          language="dockerfile"
          showLineNumbers={true}
          code={`# 1. Estágio de Dependências (Base)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2. Estágio de Build (Compilação)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Estágio de Produção (Runner Mínimo)
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`}
        />
      </section>

      {/* Section 2: Docker Compose */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            2. Orquestração com Docker Compose
          </h2>
        </div>

        <p className="text-sm text-zinc-300 leading-relaxed">
          Exemplo de ambiente completo com Frontend, API Backend e Banco PostgreSQL com volumes persistentes e rede isolada:
        </p>

        <CodeBlock
          filename="docker-compose.yml"
          language="yaml"
          code={`services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:secret@db:5432/technotes
    depends_on:
      db:
        condition: service_healthy
    networks:
      - internal-net

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: technotes
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d technotes"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - internal-net

volumes:
  pgdata:

networks:
  internal-net:
    driver: bridge`}
        />
      </section>

      {/* Section 3: Essential Commands */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            3. Cheatsheet de Comandos Essenciais
          </h2>
        </div>

        <CodeBlock
          filename="docker-cheatsheet.sh"
          language="bash"
          code={`# Iniciar todos os serviços em segundo plano (detached)
docker compose up -d

# Visualizar logs em tempo real do serviço de app
docker compose logs -f app

# Acessar o terminal bash/sh dentro de um container em execução
docker exec -it <container_id> sh

# Limpar containers parados, redes não usadas e imagens órfãs (libera espaço)
docker system prune -a --volumes`}
        />
      </section>
    </article>
  );
}
