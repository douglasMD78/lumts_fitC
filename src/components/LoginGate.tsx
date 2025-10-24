"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

interface LoginGateProps {
  children: React.ReactNode;
  message: string;
  featureName: string;
}

const LoginGate = ({ children, message, featureName }: LoginGateProps) => {
  const { user } = useAuth();

  if (user) {
    return <>{children}</>;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Lock className="h-6 w-6 mr-3 text-pink-500" />
            {featureName}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-slate-600 text-center">{message}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild className="w-full">
            <Link to="/login">Fazer Login</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link to="/signup">Criar Conta</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginGate;