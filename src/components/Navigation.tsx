
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon, User, Wallet, Box, LayoutGrid } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface NavigationProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const Navigation = ({ onLogin, onRegister }: NavigationProps) => {
  const [balance] = useState(0);
  const [isLoggedIn] = useState(false);

  return (
    <header className="bg-[#1a1f2c] py-4 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-2xl font-bold text-white">
              CS2<span className="text-[#f97316]">КЕЙСЫ</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link to="/cases" className="text-gray-300 hover:text-white">Кейсы</Link>
              <Link to="/crash" className="text-gray-300 hover:text-white">Краш</Link>
              <Link to="/upgrade" className="text-gray-300 hover:text-white">Апгрейд</Link>
              <Link to="/inventory" className="text-gray-300 hover:text-white">Инвентарь</Link>
            </nav>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="bg-[#0e1015] px-4 py-2 rounded-md flex items-center">
                  <Wallet className="text-[#f97316] mr-2 h-5 w-5" />
                  <span className="text-white font-medium">{balance.toLocaleString()} ₽</span>
                </div>
                <Link to="/profile">
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    <User className="mr-2 h-4 w-4" />
                    Профиль
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10" onClick={onLogin}>
                  Вход
                </Button>
                <Button className="bg-[#f97316] hover:bg-[#ea580c]" onClick={onRegister}>
                  Регистрация
                </Button>
              </>
            )}
          </div>
          
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1a1f2c] text-white border-l border-gray-800">
              <div className="py-6 space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Меню</h3>
                  <div className="space-y-2">
                    <Link to="/cases" className="flex items-center py-2">
                      <Box className="mr-3 h-5 w-5 text-[#f97316]" />
                      Кейсы
                    </Link>
                    <Link to="/crash" className="flex items-center py-2">
                      <LayoutGrid className="mr-3 h-5 w-5 text-[#f97316]" />
                      Краш
                    </Link>
                    <Link to="/upgrade" className="flex items-center py-2">
                      <LayoutGrid className="mr-3 h-5 w-5 text-[#f97316]" />
                      Апгрейд
                    </Link>
                    <Link to="/inventory" className="flex items-center py-2">
                      <Box className="mr-3 h-5 w-5 text-[#f97316]" />
                      Инвентарь
                    </Link>
                  </div>
                </div>
                
                {isLoggedIn ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Баланс</h3>
                      <span className="font-bold text-[#f97316]">{balance.toLocaleString()} ₽</span>
                    </div>
                    <Button className="w-full bg-[#f97316] hover:bg-[#ea580c]">
                      Пополнить
                    </Button>
                    <Link to="/profile" className="block">
                      <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10">
                        Профиль
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button className="w-full bg-[#f97316] hover:bg-[#ea580c]" onClick={onRegister}>
                      Регистрация
                    </Button>
                    <Button variant="outline" className="w-full text-white border-white/20 hover:bg-white/10" onClick={onLogin}>
                      Вход
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
