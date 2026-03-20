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
      className="group flex items-center gap-6 rounded-lg bg-card p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
      style={{ border: '1px solid rgba(0,0,0,0.08)' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.16)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent text-primary transition-colors">
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
    </Link>
  );
}
