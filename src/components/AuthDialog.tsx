
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "login" | "register";
  onChangeMode: (mode: "login" | "register") => void;
}

export const AuthDialog = ({ 
  open, 
  onOpenChange, 
  mode,
  onChangeMode
}: AuthDialogProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика авторизации/регистрации
    console.log(mode === "login" ? "Логин" : "Регистрация", { email, password, username });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#1a1f2c] text-white border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "login" ? "Вход в аккаунт" : "Регистрация аккаунта"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {mode === "login" 
              ? "Войдите, чтобы получить доступ к открытию кейсов и управлению вашим инвентарем." 
              : "Создайте аккаунт для открытия кейсов и управления вашим инвентарем."}
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          defaultValue={mode} 
          value={mode} 
          onValueChange={(value) => onChangeMode(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-[#0e1015]">
            <TabsTrigger value="login" className="data-[state=active]:bg-[#f97316]">
              Вход
            </TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-[#f97316]">
              Регистрация
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0e1015] border-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-login">Пароль</Label>
                <Input
                  id="password-login"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#0e1015] border-gray-800"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#f97316] hover:bg-[#ea580c]">
                  Войти
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <a href="#" className="underline hover:text-white">
                  Забыли пароль?
                </a>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Имя пользователя</Label>
                <Input
                  id="username"
                  placeholder="Ваш никнейм"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="bg-[#0e1015] border-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  placeholder="example@mail.ru"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#0e1015] border-gray-800"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password-register">Пароль</Label>
                <Input
                  id="password-register"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-[#0e1015] border-gray-800"
                />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full bg-[#f97316] hover:bg-[#ea580c]">
                  Создать аккаунт
                </Button>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                Регистрируясь, вы соглашаетесь с{" "}
                <a href="#" className="underline hover:text-white">
                  правилами сервиса
                </a>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
