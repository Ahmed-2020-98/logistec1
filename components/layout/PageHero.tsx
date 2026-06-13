import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";

export function PageHero({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
}) {
  return (
    <section className="bg-navy-900">
      <Container>
        <div className="flex flex-col items-start gap-3 py-12 text-white sm:py-14">
          {icon && (
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
              <Icon name={icon} className="size-7" strokeWidth={1.6} />
            </span>
          )}
          <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
          {subtitle && <p className="max-w-2xl text-white/75">{subtitle}</p>}
        </div>
      </Container>
    </section>
  );
}
