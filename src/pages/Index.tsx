
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseGrid } from "@/components/CaseGrid";
import { AuthDialog } from "@/components/AuthDialog";
import { Navigation } from "@/components/Navigation";
import { useState, useEffect } from "react";

// Интерфейс скина для инвентаря
interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  wear: string;
}

const Index = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(5000); // Начальный баланс
  const [userInventory, setUserInventory] = useState<Skin[]>([]);
  const navigate = useNavigate();

  // Проверяем статус авторизации при загрузке страницы
  useEffect(() => {
    const loginStatus = localStorage.getItem('cs2-login-status');
    if (loginStatus === 'logged-in') {
      setIsLoggedIn(true);
      
      // Получаем баланс из localStorage
      const storedBalance = localStorage.getItem('cs2-balance');
      if (storedBalance) {
        setBalance(Number(storedBalance));
      }
      
      // Получаем инвентарь из localStorage
      const storedInventory = localStorage.getItem('cs2-inventory');
      if (storedInventory) {
        setUserInventory(JSON.parse(storedInventory));
      }
    }
  }, []);

  const handleAuth = (mode: "login" | "register") => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };
  
  // Аутентификация пользователя
  const loginDemo = () => {
    setIsLoggedIn(true);
    localStorage.setItem('cs2-login-status', 'logged-in');
    localStorage.setItem('cs2-balance', balance.toString());
    setIsAuthOpen(false);
  };
  
  // Выход из аккаунта
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('cs2-login-status');
  };

  return (
    <div className="min-h-screen bg-[#0e1015] text-white flex flex-col">
      <Navigation 
        onLogin={() => handleAuth("login")} 
        onRegister={() => handleAuth("register")} 
        isLoggedIn={isLoggedIn}
        balance={balance}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="mb-10">
          <div className="relative h-[300px] rounded-xl overflow-hidden mb-8">
            <img 
              src="https://images.unsplash.com/photo-1558459654-c4026fd5ddc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" 
              alt="CS2 Cases" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-bold mb-2">CS2 КЕЙСЫ</h1>
              <p className="text-gray-300 mb-4">Открывай кейсы, получай редкие скины, повышай свой баланс</p>
              <div className="flex space-x-4">
                <Button onClick={() => navigate("/cases")} className="bg-[#f97316] hover:bg-[#ea580c] text-white">
                  Открыть кейсы
                </Button>
                {isLoggedIn ? (
                  <Button onClick={() => navigate("/inventory")} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    Инвентарь
                  </Button>
                ) : (
                  <Button onClick={() => handleAuth("login")} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    Войти
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Tabs defaultValue="cases" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 bg-[#1a1f2c]">
              <TabsTrigger value="cases" className="data-[state=active]:bg-[#f97316]">Кейсы</TabsTrigger>
              <TabsTrigger value="crash" className="data-[state=active]:bg-[#f97316]">Краш</TabsTrigger>
              <TabsTrigger value="upgrade" className="data-[state=active]:bg-[#f97316]">Апгрейд</TabsTrigger>
            </TabsList>
            
            <TabsContent value="cases" className="mt-0">
              <h2 className="text-2xl font-bold mb-6">Популярные кейсы</h2>
              <CaseGrid />
            </TabsContent>
            
            <TabsContent value="crash" className="mt-0">
              <div className="bg-[#1a1f2c] p-6 rounded-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Режим "Краш"</h2>
                <p className="mb-6 text-gray-300">Делайте ставки и выигрывайте с мультипликатором! Успейте вывести деньги до краша.</p>
                <Button className="bg-[#f97316] hover:bg-[#ea580c]" onClick={() => navigate("/crash")}>
                  Играть в Краш
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="upgrade" className="mt-0">
              <div className="bg-[#1a1f2c] p-6 rounded-xl text-center">
                <h2 className="text-2xl font-bold mb-4">Апгрейд скинов</h2>
                <p className="mb-6 text-gray-300">Улучшайте свои скины и получайте предметы более высокого качества.</p>
                <Button className="bg-[#f97316] hover:bg-[#ea580c]" onClick={() => navigate("/upgrade")}>
                  Открыть Апгрейд
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <footer className="bg-[#1a1f2c] py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">© 2025 CS2 КЕЙСЫ. Все права защищены.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Поддержка</a>
              <a href="#" className="text-gray-400 hover:text-white">Правила</a>
              <a href="#" className="text-gray-400 hover:text-white">FAQ</a>
            </div>
          </div>
        </div>
      </footer>

      <AuthDialog 
        open={isAuthOpen} 
        onOpenChange={(open) => {
          setIsAuthOpen(open);
          // Демонстрационный вход после закрытия диалога
          if (!open && authMode === "login") {
            loginDemo();
          }
        }} 
        mode={authMode} 
        onChangeMode={(mode) => setAuthMode(mode)} 
      />
    </div>
  );
};

export default Index;
