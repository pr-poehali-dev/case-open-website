
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { ChevronsRight, RefreshCw, ChevronsUp, ShieldAlert } from "lucide-react";

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

const UpgradePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [inventory, setInventory] = useState<Skin[]>([]);
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null);
  const [targetSkins, setTargetSkins] = useState<Skin[]>([]);
  const [selectedTargetSkin, setSelectedTargetSkin] = useState<Skin | null>(null);
  const [upgradeChance, setUpgradeChance] = useState<number>(50);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [upgradeResult, setUpgradeResult] = useState<"success" | "fail" | null>(null);
  const [showInventorySelect, setShowInventorySelect] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Загрузка данных пользователя
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
        setInventory(JSON.parse(storedInventory));
      } else {
        // Демо-данные для инвентаря
        const demoInventory: Skin[] = [
          { id: "skin1", name: "AK-47 | Азимов", price: 1200, image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Прямо с завода" },
          { id: "skin2", name: "M4A4 | Вой", price: 850, image: "https://images.unsplash.com/photo-1595323397663-b329313268d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "epic", wear: "Немного поношенное" },
          { id: "skin3", name: "USP-S | Неонуар", price: 650, image: "https://images.unsplash.com/photo-1595323397490-631c6057ab4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "После полевых" },
          { id: "skin4", name: "Glock-18 | Градиент", price: 450, image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "Немного поношенное" },
        ];
        setInventory(demoInventory);
        localStorage.setItem('cs2-inventory', JSON.stringify(demoInventory));
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  // Генерация целевых скинов при выборе исходного скина
  useEffect(() => {
    if (selectedSkin) {
      const demoTargets: Skin[] = [
        { id: "target1", name: "AWP | Азимов", price: selectedSkin.price * 2.5, image: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Прямо с завода" },
        { id: "target2", name: "Desert Eagle | Пламя", price: selectedSkin.price * 1.8, image: "https://images.unsplash.com/photo-1607302628343-3e4d63c2e372?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "epic", wear: "Немного поношенное" },
        { id: "target3", name: "Нож-бабочка | Градиент", price: selectedSkin.price * 5, image: "https://images.unsplash.com/photo-1560158670-a6ebd42631db?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Прямо с завода" },
      ];
      setTargetSkins(demoTargets);
      setSelectedTargetSkin(demoTargets[0]);
    } else {
      setTargetSkins([]);
      setSelectedTargetSkin(null);
    }
  }, [selectedSkin]);

  // Расчет шанса при выборе целевого скина
  useEffect(() => {
    if (selectedSkin && selectedTargetSkin) {
      const priceRatio = selectedSkin.price / selectedTargetSkin.price;
      const calculatedChance = Math.min(Math.max(priceRatio * 100, 1), 95);
      setUpgradeChance(Math.floor(calculatedChance));
    }
  }, [selectedSkin, selectedTargetSkin]);

  const handleSelectInventoryItem = (skin: Skin) => {
    setSelectedSkin(skin);
    setShowInventorySelect(false);
    setUpgradeResult(null);
  };

  const handleSelectTargetSkin = (skin: Skin) => {
    setSelectedTargetSkin(skin);
    setUpgradeResult(null);
  };

  const handleChanceChange = (value: number[]) => {
    if (selectedSkin && selectedTargetSkin) {
      setUpgradeChance(value[0]);
      
      // Корректировка цены целевого скина на основе шанса
      const newTargetPrice = (selectedSkin.price * 100) / value[0];
      const updatedTarget = { ...selectedTargetSkin, price: Math.floor(newTargetPrice) };
      setSelectedTargetSkin(updatedTarget);
    }
  };

  const handleUpgrade = () => {
    if (!selectedSkin || !selectedTargetSkin || isUpgrading) return;
    
    setIsUpgrading(true);
    
    // Симуляция процесса апгрейда
    setTimeout(() => {
      const random = Math.random() * 100;
      const success = random <= upgradeChance;
      
      setUpgradeResult(success ? "success" : "fail");
      
      if (success) {
        // Удаляем выбранный скин из инвентаря
        const updatedInventory = inventory.filter(item => item.id !== selectedSkin.id);
        
        // Добавляем новый скин в инвентарь
        const newInventory = [...updatedInventory, { ...selectedTargetSkin, id: selectedTargetSkin.id + "-" + Date.now() }];
        setInventory(newInventory);
        localStorage.setItem('cs2-inventory', JSON.stringify(newInventory));
      } else {
        // Удаляем выбранный скин из инвентаря (в случае неудачи)
        const updatedInventory = inventory.filter(item => item.id !== selectedSkin.id);
        setInventory(updatedInventory);
        localStorage.setItem('cs2-inventory', JSON.stringify(updatedInventory));
      }
      
      setIsUpgrading(false);
    }, 2000);
  };

  const handleTryAgain = () => {
    setSelectedSkin(null);
    setSelectedTargetSkin(null);
    setUpgradeResult(null);
  };

  return (
    <div className="min-h-screen bg-[#0e1015] text-white flex flex-col">
      <Navigation 
        onLogin={() => navigate('/')} 
        onRegister={() => navigate('/')} 
        isLoggedIn={isLoggedIn}
        balance={balance}
        onLogout={() => {
          setIsLoggedIn(false);
          localStorage.removeItem('cs2-login-status');
          navigate('/');
        }}
      />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Апгрейд скинов</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Раздел с выбором скина игрока */}
          <div>
            <Card className="bg-[#1a1f2c] border-gray-800 h-full">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Ваш скин</h3>
                
                {selectedSkin ? (
                  <div 
                    className={`rounded-lg border ${getRarityColor(selectedSkin.rarity)} p-4 bg-gradient-to-b ${getRarityGradient(selectedSkin.rarity)}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={selectedSkin.image} alt={selectedSkin.name} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <h4 className={`font-bold ${getRarityColor(selectedSkin.rarity)}`}>{selectedSkin.name}</h4>
                        <p className="text-gray-400 text-sm">{selectedSkin.wear}</p>
                        <p className="text-[#f97316] font-bold">{selectedSkin.price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-700"
                      onClick={() => setShowInventorySelect(true)}
                      disabled={isUpgrading}
                    >
                      Сменить скин
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 rounded-lg border border-dashed border-gray-700 p-4">
                    <p className="text-gray-400 mb-4">Выберите скин из вашего инвентаря</p>
                    <Button
                      className="bg-[#f97316] hover:bg-[#ea580c]"
                      onClick={() => setShowInventorySelect(true)}
                    >
                      Выбрать скин
                    </Button>
                  </div>
                )}
                
                {/* Выбор скина из инвентаря */}
                {showInventorySelect && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Ваш инвентарь:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2">
                      {inventory.length > 0 ? (
                        inventory.map((skin) => (
                          <div
                            key={skin.id}
                            className={`p-3 rounded bg-[#0e1015] border-l-4 ${getRarityColor(skin.rarity)} cursor-pointer hover:bg-[#0e1015]/70 transition-colors`}
                            onClick={() => handleSelectInventoryItem(skin)}
                          >
                            <div className="flex items-center gap-3">
                              <img src={skin.image} alt={skin.name} className="w-12 h-12 object-cover rounded" />
                              <div>
                                <h4 className="font-medium text-white text-sm">{skin.name}</h4>
                                <p className="text-xs text-gray-400">{skin.wear}</p>
                                <p className={`text-sm font-bold ${getRarityColor(skin.rarity)}`}>{skin.price.toLocaleString()} ₽</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400 py-4">
                          У вас пока нет скинов. Откройте кейсы, чтобы получить скины.
                        </p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full mt-4 border-gray-700"
                      onClick={() => setShowInventorySelect(false)}
                    >
                      Закрыть
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Центральная секция с контролями */}
          <div>
            <Card className="bg-[#1a1f2c] border-gray-800 h-full">
              <CardContent className="p-6 flex flex-col items-center justify-between h-full">
                {upgradeResult === null ? (
                  <>
                    <div className="w-full space-y-6">
                      <div className="flex justify-center">
                        <ChevronsRight className="h-16 w-16 text-[#f97316]" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Шанс успеха:</span>
                          <span className="font-bold text-[#f97316]">{upgradeChance}%</span>
                        </div>
                        <Slider
                          value={[upgradeChance]}
                          max={95}
                          min={5}
                          step={1}
                          onValueChange={handleChanceChange}
                          disabled={!selectedSkin || !selectedTargetSkin || isUpgrading}
                          className="py-2"
                        />
                      </div>
                      
                      <Separator className="bg-gray-800" />
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400">Множитель цены:</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[1.5, 2, 3, 5].map((multiplier) => (
                            <Button
                              key={multiplier}
                              variant="outline"
                              size="sm"
                              className="border-gray-700"
                              onClick={() => {
                                if (selectedSkin) {
                                  const newPrice = Math.floor(selectedSkin.price * multiplier);
                                  if (selectedTargetSkin) {
                                    setSelectedTargetSkin({...selectedTargetSkin, price: newPrice});
                                  } else if (targetSkins.length > 0) {
                                    setSelectedTargetSkin({...targetSkins[0], price: newPrice});
                                  }
                                }
                              }}
                              disabled={!selectedSkin || isUpgrading}
                            >
                              {multiplier}x
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] mt-6 py-6 text-lg"
                      onClick={handleUpgrade}
                      disabled={!selectedSkin || !selectedTargetSkin || isUpgrading}
                    >
                      {isUpgrading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Апгрейд...
                        </span>
                      ) : (
                        "Апгрейд"
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full">
                    {upgradeResult === "success" ? (
                      <>
                        <div className="text-center mb-6">
                          <ChevronsUp className="h-20 w-20 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-green-500 mb-2">Успех!</h3>
                          <p className="text-gray-400">Вы получили новый скин</p>
                        </div>
                        {selectedTargetSkin && (
                          <div className={`rounded-lg border-2 ${getRarityColor(selectedTargetSkin.rarity)} p-4 w-full mb-6`}>
                            <div className="flex items-center gap-4">
                              <img src={selectedTargetSkin.image} alt={selectedTargetSkin.name} className="w-16 h-16 object-cover rounded" />
                              <div>
                                <h4 className={`font-bold ${getRarityColor(selectedTargetSkin.rarity)}`}>{selectedTargetSkin.name}</h4>
                                <p className="text-gray-400 text-sm">{selectedTargetSkin.wear}</p>
                                <p className="text-[#f97316] font-bold">{selectedTargetSkin.price.toLocaleString()} ₽</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="text-center mb-6">
                          <ShieldAlert className="h-20 w-20 text-red-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-red-500 mb-2">Неудача!</h3>
                          <p className="text-gray-400">Вы потеряли свой скин</p>
                        </div>
                        {selectedSkin && (
                          <div className={`rounded-lg border-2 border-red-500 p-4 w-full mb-6`}>
                            <div className="flex items-center gap-4">
                              <img src={selectedSkin.image} alt={selectedSkin.name} className="w-16 h-16 object-cover rounded opacity-50" />
                              <div>
                                <h4 className="font-bold text-red-500">{selectedSkin.name}</h4>
                                <p className="text-gray-400 text-sm">{selectedSkin.wear}</p>
                                <p className="text-red-500 font-bold line-through">{selectedSkin.price.toLocaleString()} ₽</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    
                    <Button
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] mt-auto"
                      onClick={handleTryAgain}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Попробовать снова
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Раздел с выбором целевого скина */}
          <div>
            <Card className="bg-[#1a1f2c] border-gray-800 h-full">
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Целевой скин</h3>
                
                {selectedTargetSkin ? (
                  <div 
                    className={`rounded-lg border ${getRarityColor(selectedTargetSkin.rarity)} p-4 bg-gradient-to-b ${getRarityGradient(selectedTargetSkin.rarity)}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={selectedTargetSkin.image} alt={selectedTargetSkin.name} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <h4 className={`font-bold ${getRarityColor(selectedTargetSkin.rarity)}`}>{selectedTargetSkin.name}</h4>
                        <p className="text-gray-400 text-sm">{selectedTargetSkin.wear}</p>
                        <p className="text-[#f97316] font-bold">{selectedTargetSkin.price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 rounded-lg border border-dashed border-gray-700 p-4">
                    <p className="text-gray-400">
                      {selectedSkin 
                        ? "Выберите целевой скин" 
                        : "Сначала выберите ваш скин"}
                    </p>
                  </div>
                )}
                
                {/* Список доступных целевых скинов */}
                {targetSkins.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Доступные скины:</h4>
                    <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2">
                      {targetSkins.map((skin) => (
                        <div
                          key={skin.id}
                          className={`p-3 rounded bg-[#0e1015] border-l-4 ${getRarityColor(skin.rarity)} cursor-pointer hover:bg-[#0e1015]/70 transition-colors ${selectedTargetSkin?.id === skin.id ? 'ring-2 ring-[#f97316]' : ''}`}
                          onClick={() => handleSelectTargetSkin(skin)}
                        >
                          <div className="flex items-center gap-3">
                            <img src={skin.image} alt={skin.name} className="w-12 h-12 object-cover rounded" />
                            <div>
                              <h4 className="font-medium text-white text-sm">{skin.name}</h4>
                              <p className="text-xs text-gray-400">{skin.wear}</p>
                              <p className={`text-sm font-bold ${getRarityColor(skin.rarity)}`}>{skin.price.toLocaleString()} ₽</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-[#1a1f2c] py-6 mt-auto">
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

export default UpgradePage;
