import { Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { ArticleLayout } from "@/components/ArticleLayout";

export const metadata = {
  title: "Linux Servers & Hardening - TechNotes",
  description: "Gerenciamento de servidores Linux, systemd, SSH seguro e firewall com UFW.",
};

export default function LinuxServersPage() {
  return (
    <ArticleLayout
      breadcrumbs={[
        { label: "DevOps & Ferramentas" },
        { label: "Linux Servers" },
      ]}
    >
      <header className="space-y-4 border-b border-zinc-800 pb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="blue">#linux</Badge>
          <Badge variant="success">#systemd</Badge>
          <Badge variant="outline">#seguranca</Badge>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Linux Servers: Serviços e Segurança
        </h1>

        <p className="text-base text-zinc-400 leading-relaxed max-w-3xl">
          Guia para configuração de serviços com <code className="text-blue-400 font-mono">systemd</code>,
          gerenciamento de logs com <code className="text-blue-400 font-mono">journalctl</code> e proteção de portas com firewall UFW.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-white tracking-tight">
            1. Gerenciando Serviços com systemctl
          </h2>
        </div>

        <CodeBlock
          filename="systemd-commands.sh"
          language="bash"
          code={`# Iniciar, parar ou reiniciar um serviço
sudo systemctl start nginx
sudo systemctl restart nginx
sudo systemctl status nginx

# Habilitar para iniciar automaticamente no boot do servidor
sudo systemctl enable nginx

# Acompanhar logs em tempo real do serviço
journalctl -u nginx -f -n 50`}
        />
      </section>
    </ArticleLayout>
  );
}
