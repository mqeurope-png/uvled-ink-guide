import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionButtonProps {
  to: string;
  icon: ReactNode;
  title: string;
  description?: string;
}

export function SectionButton({ to, icon, title, description }: SectionButtonProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-6 border border-border-subtle bg-card p-6 transition-all duration-300 hover:border-foreground/20 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-border-subtle text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg text-slim">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
