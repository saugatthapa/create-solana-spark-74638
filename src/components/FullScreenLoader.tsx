import { Loader2 } from 'lucide-react';

interface FullScreenLoaderProps {
  title?: string;
  subtitle?: string;
}

export const FullScreenLoader = ({ title = 'Creating your token', subtitle = 'This may take up to a minute. Please do not close the window.' }: FullScreenLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="w-6 h-6 animate-spin" />
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-5">{subtitle}</p>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div className="h-full w-1/3 animate-[progress_1.4s_ease_infinite] bg-gradient-to-r from-primary to-accent rounded-full" />
        </div>
      </div>
      <style>{`@keyframes progress{0%{transform:translateX(-120%)}100%{transform:translateX(300%)}}`}</style>
    </div>
  );
};
