"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FiClock, FiMail, FiMapPin, FiPhone, FiSend } from "react-icons/fi";

const contactItems = [
  { key: "email", icon: FiMail, href: (value: string) => `mailto:${value}` },
  { key: "phone", icon: FiPhone, href: (value: string) => `tel:${value}` },
  { key: "address", icon: FiMapPin },
  { key: "hours", icon: FiClock },
] as const;

const ContactPage = () => {
  const t = useTranslations("Contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
    "idle",
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-16 lg:py-20">
      <header className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
        <p className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-base text-muted-foreground md:text-lg">
          {t("subtitle")}
        </p>
      </header>

      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-5 lg:gap-16">
        <aside className="space-y-10 lg:col-span-2">
          <div className="space-y-3">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("info.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("info.title")}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t("info.description")}
            </p>
          </div>

          <ul className="divide-y divide-border">
            {contactItems.map((item) => {
              const { key, icon: Icon } = item;
              const title = t(`info.${key}.title`);
              const value = t(`info.${key}.value`);
              const content =
                "href" in item ? (
                  <a
                    href={item.href(value)}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">{value}</p>
                );

              return (
                <li key={key} className="flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="text-sm font-medium">{title}</p>
                    {content}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border pt-8">
            <h3 className="text-base font-semibold tracking-tight">
              {t("social.title")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("social.description")}
            </p>
          </div>
        </aside>

        <section className="rounded-xl border border-border bg-card p-6 md:p-8 lg:col-span-3">
          <div className="mb-6 space-y-2">
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {t("form.eyebrow")}
            </p>
            <h2 className="text-2xl font-semibold tracking-tight">
              {t("form.title")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("form.description")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{t("form.name")}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("form.namePlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("form.email")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("form.emailPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">{t("form.subject")}</Label>
              <Input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder={t("form.subjectPlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t("form.message")}</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                value={formData.message}
                onChange={handleChange}
                placeholder={t("form.messagePlaceholder")}
                className="resize-none"
              />
            </div>

            {submitStatus === "success" && (
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-200">
                {t("form.successMessage")}
              </div>
            )}

            {submitStatus === "error" && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
                {t("form.errorMessage")}
              </div>
            )}

            <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
              {isSubmitting ? (
                t("form.submitting")
              ) : (
                <>
                  <FiSend className="mr-2 h-4 w-4" />
                  {t("form.submit")}
                </>
              )}
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
