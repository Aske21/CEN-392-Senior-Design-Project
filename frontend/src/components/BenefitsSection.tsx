import { useTranslations } from "next-intl";
import { FaTruck, FaLock, FaGem } from "react-icons/fa";

const BenefitsSection = () => {
  const t = useTranslations("Landing");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-10 text-center">
          {t("benefitsSection.title")}
        </h2>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center space-y-4 py-8 px-6">
            <FaTruck className="text-5xl " />
            <h3 className="text-2xl font-semibold mb-2 ">
              {t("benefitsSection.fastDelivery.title")}
            </h3>
            <p className="text-lg text-center">
              {t("benefitsSection.fastDelivery.description")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 py-8 px-6">
            <FaLock className="text-5xl " />
            <h3 className="text-2xl font-semibold mb-2 ">
              {t("benefitsSection.securePayments.title")}
            </h3>
            <p className="text-lg text-center">
              {t("benefitsSection.securePayments.description")}
            </p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 py-8 px-6">
            <FaGem className="text-5xl " />
            <h3 className="text-2xl font-semibold mb-2 ">
              {t("benefitsSection.premiumProducts.title")}
            </h3>
            <p className="text-lg text-center	">
              {t("benefitsSection.premiumProducts.description")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
