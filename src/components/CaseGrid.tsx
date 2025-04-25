
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CaseOpening } from "@/components/CaseOpening";
import { useNavigate } from "react-router-dom";

interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "legendary";
}

interface Skin {
  id: string;
  name: string;
  price: number;
  image: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  wear: string;
}

export const CaseGrid = () => {
  const navigate = useNavigate();
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [inventory, setInventory] = useState<Skin[]>([]);
  
  // Демо-данные для кейсов
  const cases: Case[] = [
    {
      id: "case1",
      name: "Стандартный кейс",
      price: 499,
      image: "https://images.unsplash.com/photo-1576498212689-9eae242af0f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "common"
    },
    {
      id: "case2",
      name: "Премиум кейс",
      price: 1299,
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "rare"
    },
    {
      id: "case3",
      name: "Золотой кейс",
      price: 2999,
      image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "legendary"
    },
    {
      id: "case4",
      name: "Кейс с ножами",
      price: 3999,
      image: "https://images.unsplash.com/photo-1542481889-6f55a5c4bd3c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "legendary"
    },
    {
      id: "case5",
      name: "Оружейный кейс",
      price: 899,
      image: "https://images.unsplash.com/photo-1516927061785-4b57a323edfb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "rare"
    },
    {
      id: "case6",
      name: "Скрытный кейс",
      price: 699,
      image: "https://images.unsplash.com/photo-1507457379470-08b800bebc67?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      rarity: "common"
    },
  ];

  const getRarityColor = (rarity: Case["rarity"]) => {
    switch (rarity) {
      case "common":
        return "border-blue-500";
      case "rare":
        return "border-purple-500";
      case "legendary":
        return "border-[#f97316]";
      default:
        return "border-gray-500";
    }
  };

  const handleOpenCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setIsOpening(true);
  };

  const handleAddToInventory = (skin: Skin) => {
    setInventory(prev => [...prev, skin]);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <div
            key={caseItem.id}
            className="transform hover:-translate-y-1 transition-transform duration-300"
          >
            <Card className={`bg-[#1a1f2c] border-2 ${getRarityColor(caseItem.rarity)} overflow-hidden hover:shadow-lg hover:shadow-${caseItem.rarity === "legendary" ? "orange" : caseItem.rarity === "rare" ? "purple" : "blue"}-500/20 transition-all duration-300`}>
              <div className="relative pt-[100%]">
                <img 
                  src={caseItem.image} 
                  alt={caseItem.name} 
                  className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1a1f2c]/90"></div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-2">{caseItem.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-[#f97316] font-bold">{caseItem.price.toLocaleString()} ₽</span>
                  <Button 
                    onClick={() => handleOpenCase(caseItem)}
                    className="bg-[#f97316] hover:bg-[#ea580c]"
                  >
                    Открыть
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {isOpening && selectedCase && (
        <CaseOpening 
          caseId={selectedCase.id}
          caseName={selectedCase.name}
          casePrice={selectedCase.price}
          caseImage={selectedCase.image}
          onClose={() => {
            setIsOpening(false);
            setSelectedCase(null);
          }}
          onAddToInventory={handleAddToInventory}
        />
      )}
    </>
  );
};
