
import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  wear: string;
}

const getRarityColor = (rarity: Skin["rarity"]) => {
  switch (rarity) {
    case "common":
      return "border-blue-500 text-blue-500";
    case "rare":
      return "border-purple-500 text-purple-500";
    case "epic":
      return "border-pink-500 text-pink-500";
    case "legendary":
      return "border-[#f97316] text-[#f97316]";
    default:
      return "border-gray-500";
  }
};

const getRarityGradient = (rarity: Skin["rarity"]) => {
  switch (rarity) {
    case "common":
      return "from-blue-500/20 to-transparent";
    case "rare":
      return "from-purple-500/20 to-transparent";
    case "epic":
      return "from-pink-500/20 to-transparent";
    case "legendary":
      return "from-[#f97316]/20 to-transparent";
    default:
      return "from-gray-500/20 to-transparent";
  }
};

const Inventory = () => {
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [balance, setBalance] = useState(5000);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Проверка авторизации
    const loginStatus = localStorage.getItem('cs2-login-status');
    if (loginStatus !== 'logged-in') {
      navigate('/');
      return;
    }
    
    setIsLoggedIn(true);
    
    // Получаем баланс из localStorage
    const storedBalance = localStorage.getItem('cs2-balance');
    if (storedBalance) {
      setBalance(Number(storedBalance));
    }
    
    // Получаем инвентарь из localStorage
    const storedInventory = localStorage.getItem('cs2-inventory');
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    }
  }, [navigate]);

  const handleSellItem = (itemId: string) => {
    const item = inventory.find(skin => skin.id === itemId);
    if (!item) return;
    
    // Увеличиваем баланс
    const newBalance = balance + item.price;
    setBalance(newBalance);
    localStorage.setItem('cs2-balance', newBalance.toString());
    
    // Удаляем предмет из инвентаря
    const newInventory = inventory.filter(skin => skin.id !== itemId);
    setInventory(newInventory);
    localStorage.setItem('cs2-inventory', JSON.stringify(newInventory));
  };

  const handleLogin = () => {
    // Здесь был бы код открытия диалога входа
  };
  
  const handleRegister = () => {
    // Здесь был бы код открытия диалога регистрации
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('cs2-login-status');
    navigate('/');
  };

  // Фильтрация инвентаря по поисковому запросу
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0e1015] text-white flex flex-col">
      <Navigation 
        onLogin={handleLogin} 
        onRegister={handleRegister} 
        isLoggedIn={isLoggedIn}
        balance={balance}
        onLogout={handleLogout}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Мой инвентарь</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск предметов"
                className="pl-10 bg-[#1a1f2c] border-gray-800 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-gray-800">
              <Filter className="h-4 w-4 mr-2" />
              Фильтры
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-[#1a1f2c] mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#f97316]">
              Все предметы ({inventory.length})
            </TabsTrigger>
            <TabsTrigger value="skins" className="data-[state=active]:bg-[#f97316]">
              Скины
            </TabsTrigger>
            <TabsTrigger value="knives" className="data-[state=active]:bg-[#f97316]">
              Ножи
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredInventory.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredInventory.map((item) => (
                  <div 
                    key={item.id} 
                    className={`bg-[#1a1f2c] rounded-lg overflow-hidden border ${getRarityColor(item.rarity)}`}
                  >
                    <div className={`p-4 bg-gradient-to-b ${getRarityGradient(item.rarity)}`}>
                      <img src={item.image} alt={item.name} className="w-full h-40 object-contain" />
                    </div>
                    <div className="p-4">
                      <h3 className={`font-medium mb-1 ${getRarityColor(item.rarity)}`}>{item.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">{item.wear}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[#f97316] font-bold">{item.price.toLocaleString()} ₽</span>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="border-gray-800 hover:bg-[#f97316] hover:text-white hover:border-[#f97316]"
                          onClick={() => handleSellItem(item.id)}
                        >
                          Продать
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#1a1f2c] rounded-lg">
                <h3 className="text-xl font-medium mb-2">Ваш инвентарь пуст</h3>
                <p className="text-gray-400 mb-6">Откройте кейсы, чтобы получить скины</p>
                <Button className="bg-[#f97316] hover:bg-[#ea580c]" onClick={() => navigate("/cases")}>
                  Открыть кейсы
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="skins" className="mt-0">
            <div className="text-center py-16 bg-[#1a1f2c] rounded-lg">
              <h3 className="text-xl font-medium">Категория "Скины"</h3>
              <p className="text-gray-400">Здесь будут отображаться только скины (без ножей)</p>
            </div>
          </TabsContent>
          
          <TabsContent value="knives" className="mt-0">
            <div className="text-center py-16 bg-[#1a1f2c] rounded-lg">
              <h3 className="text-xl font-medium">Категория "Ножи"</h3>
              <p className="text-gray-400">Здесь будут отображаться только ножи</p>
            </div>
          </TabsContent>
        </Tabs>
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
    </div>
  );
};

export default Inventory;
