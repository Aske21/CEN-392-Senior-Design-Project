"use client";

import LoginForm from "@/components/login-form";
import RegisterForm from "@/components/register-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";

const Login = () => {
  const t = useTranslations("LoginPage");

  return (
    <div
      className="flex items-center justify-center"
      style={{ height: "80vh" }}
    >
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">{t("loginTab")}</TabsTrigger>
          <TabsTrigger value="register">{t("registerTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <LoginForm />
        </TabsContent>
        <TabsContent value="register">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
