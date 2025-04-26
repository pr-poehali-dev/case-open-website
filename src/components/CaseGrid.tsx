
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaseOpening } from "./CaseOpening";

interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  topItem: {
    name: string;
    image: string;
  };
}

interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  wear: "Поношенное" | "После полевых" | "Немного поношенное" | "Прямо с завода" | "Немного поношенное (MW)";
}

export const CaseGrid = () => {
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [inventory, setInventory] = useState<Skin[]>([]);
  
  const cases: Case[] = [
    {
      id: "case1",
      name: "Кейс \"Опасная зона\"",
      price: 990,
      image: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "AWP | Азимов",
        image: "https://images.unsplash.com/photo-1604085572504-a392ddf0d86a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case2",
      name: "Кейс \"Прорыв\"",
      price: 790,
      image: "https://images.unsplash.com/photo-1595323397663-b329313268d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "M4A4 | Вой",
        image: "https://images.unsplash.com/photo-1595323397663-b329313268d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case3",
      name: "Кейс \"Спектр\"",
      price: 1200,
      image: "https://images.unsplash.com/photo-1560158670-a6ebd42631db?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "Нож-бабочка | Градиент",
        image: "https://images.unsplash.com/photo-1560158670-a6ebd42631db?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case4",
      name: "Кейс \"Хрома\"",
      price: 850,
      image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "Glock-18 | Градиент",
        image: "https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case5",
      name: "Кейс \"Гамма\"",
      price: 1100,
      image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "AK-47 | Азимов",
        image: "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case6",
      name: "Кейс \"Снайпер\"",
      price: 950,
      image: "https://images.unsplash.com/photo-1582057749190-40c6451be0fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "SSG 08 | Кровь в воде",
        image: "https://images.unsplash.com/photo-1582057749190-40c6451be0fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case7",
      name: "Кейс \"Феникс\"",
      price: 890,
      image: "https://images.unsplash.com/photo-1607302628343-3e4d63c2e372?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "Desert Eagle | Пламя",
        image: "https://images.unsplash.com/photo-1607302628343-3e4d63c2e372?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    },
    {
      id: "case8",
      name: "Кейс \"Револьвер\"",
      price: 750,
      image: "https://images.unsplash.com/photo-1595323397490-631c6057ab4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80",
      topItem: {
        name: "USP-S | Неонуар",
        image: "https://images.unsplash.com/photo-1595323397490-631c6057ab4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
      }
    }
  ];
  
  const handleAddToInventory = (skin: Skin) => {
    setInventory(prev => [...prev, skin]);
    
    // Сохраняем в localStorage
    const storedInventory = localStorage.getItem('cs2-inventory');
    const parsedInventory = storedInventory ? JSON.parse(storedInventory) : [];
    localStorage.setItem('cs2-inventory', JSON.stringify([...parsedInventory, skin]));
  };
  
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="transition-all duration-300 transform hover:scale-105 cursor-pointer"
            onClick={() => setSelectedCase(caseItem)}
          >
            <Card className="bg-[#1a1f2c] border-gray-800 overflow-hidden">
              <div className="pt-3 px-3">
                <div className="relative rounded-t-lg overflow-hidden bg-[#0e1015] p-6 flex justify-center items-center">
                  <img
                    src={caseItem.image}
                    alt={caseItem.name}
                    className="h-40 w-auto object-contain transition-transform hover:scale-110 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e1015] to-transparent opacity-60"></div>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-medium text-white truncate">{caseItem.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center">
                    <img
                      src={caseItem.topItem.image}
                      alt={caseItem.topItem.name}
                      className="w-8 h-8 rounded object-cover mr-2 border border-[#f97316]"
                    />
                    <span className="text-gray-400 text-xs truncate max-w-[100px]">
                      {caseItem.topItem.name}
                    </span>
                  </div>
                  <span className="font-bold text-[#f97316]">{caseItem.price} ₽</span>
                </div>
                <Button
                  className="w-full mt-4 bg-[#f97316] hover:bg-[#ea580c]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCase(caseItem);
                  }}
                >
                  Открыть
                </Button>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      
      {selectedCase && (
        <CaseOpening
          caseId={selectedCase.id}
          caseName={selectedCase.name}
          casePrice={selectedCase.price}
          caseImage={selectedCase.image}
          onClose={() => setSelectedCase(null)}
          onAddToInventory={handleAddToInventory}
        />
      )}
    </div>
  );
};
