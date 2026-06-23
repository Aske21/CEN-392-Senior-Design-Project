import { useTranslations } from "next-intl";
import { FaGem, FaHeadset, FaLock, FaTruck } from "react-icons/fa";

const benefitIcons = [FaTruck, FaLock, FaGem, FaHeadset];

const BenefitsSection = () => {
  const t = useTranslations("Landing");

  const benefits = [
    {
      icon: benefitIcons[0],
      title: t("benefitsSection.fastDelivery.title"),
      description: t("benefitsSection.fastDelivery.description"),
    },
    {
      icon: benefitIcons[1],
      title: t("benefitsSection.securePayments.title"),
      description: t("benefitsSection.securePayments.description"),
    },
    {
      icon: benefitIcons[2],
      title: t("benefitsSection.premiumProducts.title"),
      description: t("benefitsSection.premiumProducts.description"),
    },
    {
      icon: benefitIcons[3],
      title: t("benefitsSection.support.title"),
      description: t("benefitsSection.support.description"),
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 space-y-3 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t("benefitsSection.eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight">
            {t("benefitsSection.title")}
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {t("benefitsSection.subtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-accent/40"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
