import { SqueletteLignes } from "@/composants/base/Squelette";

export default function Chargement() {
  return (
    <div className="lg:grid lg:h-full lg:grid-cols-[minmax(0,1fr)_var(--volet)]">
      <div className="min-w-0">
        <div className="h-12 border-b border-filet" />
        <SqueletteLignes />
      </div>
      <div className="hidden lg:block lg:border-l lg:border-filet" />
    </div>
  );
}
