import LoginForm from "@/components/login-form";

const AdminLoginPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Sign in with your admin account to access the dashboard.
          </p>
        </div>
        <LoginForm adminLogin />
      </div>
    </div>
  );
};

export default AdminLoginPage;
