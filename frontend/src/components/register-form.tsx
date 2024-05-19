"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

const RegisterForm = () => {
  const t = useTranslations("RegisterForm");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("title")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>{t("name")}</Label>
          <Input id="name" type="text" placeholder="John" required />
        </div>
        <div className="grid gap-2">
          <Label>{t("surname")}</Label>
          <Input id="surname" type="text" placeholder="Doe" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={"email@example.com"}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">{t("repeatPassword")}</Label>
          <Input id="repeat-password" type="password" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">{t("signIn")}</Button>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
