
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, X } from "lucide-react";

interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  wear: "Поношенное" | "После полевых" | "Немного поношенное" | "Прямо с завода" | "Немного поношенное (MW)";
}

interface CaseOpeningProps {
  caseId: string;
  caseName: string;
  casePrice: number;
  caseImage: string;
  onClose: () => void;
  onAddToInventory: (skin: Skin) => void;
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

export const CaseOpening = ({ caseId, caseName, casePrice, caseImage, onClose, onAddToInventory }: CaseOpeningProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const [winningItem, setWinningItem] = useState<Skin | null>(null);
  const [possibleItems, setPossibleItems] = useState<Skin[]>([]);
  const [spinItems, setSpinItems] = useState<Skin[]>([]);
  const spinnerRef = useRef<HTMLDivElement>(null);
  
  // Генерация предметов для кейса
  useEffect(() => {
    // Демо-данные для возможных предметов
    const items: Skin[] = [
      { id: "skin1", name: "AK-47 | Азимов", price: 1200, image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Прямо с завода" },
      { id: "skin2", name: "M4A4 | Вой", price: 850, image: "https://images.unsplash.com/photo-1595323397663-b329313268d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "epic", wear: "Немного поношенное" },
      { id: "skin3", name: "USP-S | Неонуар", price: 650, image: "https://images.unsplash.com/photo-1595323397490-631c6057ab4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "После полевых" },
      { id: "skin4", name: "Glock-18 | Градиент", price: 450, image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "Немного поношенное (MW)" },
      { id: "skin5", name: "AWP | Азимов", price: 1800, image: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Поношенное" },
      { id: "skin6", name: "Desert Eagle | Пламя", price: 950, image: "https://images.unsplash.com/photo-1607302628343-3e4d63c2e372?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "epic", wear: "Немного поношенное" },
      { id: "skin7", name: "P250 | Ядерная угроза", price: 350, image: "https://images.unsplash.com/photo-1535914954645-aef726eb8fdd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "После полевых" },
      { id: "skin8", name: "AUG | Хищник", price: 250, image: "https://images.unsplash.com/photo-1520870121499-7dddb6ccbcde?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "common", wear: "Поношенное" },
      { id: "skin9", name: "SSG 08 | Кровь в воде", price: 550, image: "https://images.unsplash.com/photo-1582057749190-40c6451be0fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "Немного поношенное" },
      { id: "skin10", name: "MP7 | Кровавый спорт", price: 300, image: "https://images.unsplash.com/photo-1519669417670-68dc717cdf3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "common", wear: "Прямо с завода" },
      { id: "skin11", name: "Нож-бабочка | Градиент", price: 12000, image: "https://images.unsplash.com/photo-1560158670-a6ebd42631db?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "legendary", wear: "Прямо с завода" },
      { id: "skin12", name: "P90 | Азимов", price: 450, image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80", rarity: "rare", wear: "Поношенное" },
    ];
    
    setPossibleItems(items);
  }, [caseId]);

  const openCase = () => {
    if (isOpening) return;
    
    setIsOpening(true);
    
    // Генерация списка элементов для прокрутки (с повторениями для создания эффекта длинной ленты)
    const shuffledItems = [...possibleItems].sort(() => Math.random() - 0.5);
    
    // Предопределяем выигрышный предмет (с учетом редкости и вероятности)
    const rarityProbability = Math.random();
    let winRarity: Skin["rarity"];
    
    if (rarityProbability < 0.65) {
      winRarity = "common";
    } else if (rarityProbability < 0.85) {
      winRarity = "rare";
    } else if (rarityProbability < 0.95) {
      winRarity = "epic";
    } else {
      winRarity = "legendary";
    }
    
    // Выбираем случайный предмет из возможных с выбранной редкостью
    const possibleWins = possibleItems.filter(item => item.rarity === winRarity);
    const selectedWin = possibleWins[Math.floor(Math.random() * possibleWins.length)];
    
    // Создаем массив для прокрутки с повторением предметов
    const spinningItems: Skin[] = [];
    
    // Добавляем случайные предметы (примерно 40 штук)
    for (let i = 0; i < 40; i++) {
      spinningItems.push(shuffledItems[i % shuffledItems.length]);
    }
    
    // Добавляем выигрышный предмет в определенную позицию
    const winPosition = 43; // Позиция, где будет остановлена прокрутка
    spinningItems.splice(winPosition, 0, selectedWin);
    
    setSpinItems(spinningItems);
    setWinningItem(selectedWin);
    
    // Анимация прокрутки
    setTimeout(() => {
      if (spinnerRef.current) {
        spinnerRef.current.style.transition = "transform 8s cubic-bezier(0.1, 0.7, 0.1, 1)";
        spinnerRef.current.style.transform = `translateX(calc(-${winPosition * 220}px + 50%))`;
      }
      
      // Показываем результат через 8 секунд (после завершения анимации)
      setTimeout(() => {
        if (selectedWin) {
          onAddToInventory(selectedWin);
        }
      }, 8000);
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div 
        className="bg-[#1a1f2c] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in duration-300 ease-out"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{caseName}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="flex flex-col md:flex-row gap-6 items-center mb-8">
            <div className="w-full md:w-1/3">
              <div className="relative rounded-lg overflow-hidden">
                <img src={caseImage} alt={caseName} className="w-full h-auto" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f2c] to-transparent"></div>
              </div>
            </div>
            
            <div className="w-full md:w-2/3 space-y-4">
              <h3 className="text-2xl font-bold text-white">Содержимое кейса:</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {possibleItems.slice(0, 8).map((item) => (
                  <div key={item.id} className={`rounded border ${getRarityColor(item.rarity)} p-1 bg-gradient-to-b ${getRarityGradient(item.rarity)}`}>
                    <img src={item.image} alt={item.name} className="w-full h-auto rounded" />
                  </div>
                ))}
              </div>
              
              {!isOpening ? (
                <Button
                  className="w-full md:w-auto bg-[#f97316] hover:bg-[#ea580c] text-lg py-6"
                  onClick={openCase}
                >
                  Открыть за {casePrice} ₽
                </Button>
              ) : winningItem ? (
                <div className="space-y-3">
                  <p className="text-gray-400">
                    Поздравляем! Вы получили:
                  </p>
                  <div className={`p-3 rounded-lg border-2 ${getRarityColor(winningItem.rarity)}`}>
                    <div className="flex items-center gap-4">
                      <img src={winningItem.image} alt={winningItem.name} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <h4 className={`font-bold ${getRarityColor(winningItem.rarity)}`}>{winningItem.name}</h4>
                        <p className="text-gray-400 text-sm">{winningItem.wear}</p>
                        <p className="text-[#f97316] font-bold">{winningItem.price.toLocaleString()} ₽</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          
          <Separator className="my-6 bg-gray-800" />
          
          {/* Секция с прокруткой */}
          <div className="relative overflow-hidden h-48 mb-6">
            <div className="absolute left-1/2 top-1/2 w-0.5 h-full bg-[#f97316] z-10 transform -translate-x-1/2 -translate-y-1/2"></div>
            <div
              ref={spinnerRef}
              className="flex absolute left-0"
              style={{ transform: "translateX(50%)" }}
            >
              {spinItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className={`flex-shrink-0 w-52 mx-1 p-3 rounded-lg bg-[#0e1015] border ${getRarityColor(item.rarity)}`}
                >
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium text-white text-sm line-clamp-2">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.wear}</p>
                      <p className={`text-sm font-bold ${getRarityColor(item.rarity)}`}>{item.price.toLocaleString()} ₽</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
