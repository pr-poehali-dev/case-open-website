
import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { Users, ArrowUp, ChevronUp, ChevronDown, BarChart3 } from "lucide-react";

interface BetHistory {
  id: number;
  username: string;
  amount: number;
  multiplier: number;
  profit: number;
  timestamp: string;
}

const FAKE_USERS = [
  "User452",
  "CS2Pro",
  "SkinsHunter",
  "LuckyDrop",
  "GamingWizard",
  "HighRoller",
  "SkinsMaster",
  "AWPLover",
  "KnifeDrop",
  "LegendaryDrop"
];

const CrashPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [betAmount, setBetAmount] = useState<string>("100");
  const [autoWithdrawAt, setAutoWithdrawAt] = useState<string>("2.00");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.00);
  const [isCrashed, setIsCrashed] = useState<boolean>(false);
  const [hasWithdrawn, setHasWithdrawn] = useState<boolean>(false);
  const [gameHistory, setGameHistory] = useState<number[]>([]);
  const [betHistory, setBetHistory] = useState<BetHistory[]>([]);
  const [activeBets, setActiveBets] = useState<BetHistory[]>([]);
  const [timer, setTimer] = useState<number>(5);
  const [userBet, setUserBet] = useState<BetHistory | null>(null);
  const [gameInterval, setGameInterval] = useState<NodeJS.Timer | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем статус авторизации при загрузке страницы
    const loginStatus = localStorage.getItem('cs2-login-status');
    if (loginStatus === 'logged-in') {
      setIsLoggedIn(true);
      
      // Получаем баланс из localStorage
      const storedBalance = localStorage.getItem('cs2-balance');
      if (storedBalance) {
        setBalance(Number(storedBalance));
      }
    }
    
    // Генерируем историю игр
    const fakeHistory = Array.from({ length: 15 }, () => {
      return parseFloat((Math.random() * 4 + 1).toFixed(2));
    });
    setGameHistory(fakeHistory);
    
    // Генерируем историю ставок
    const fakeBetHistory = Array.from({ length: 10 }, (_, index) => {
      const amount = Math.floor(Math.random() * 1000) + 100;
      const multiplier = parseFloat((Math.random() * 4 + 1).toFixed(2));
      return {
        id: index + 1,
        username: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
        amount: amount,
        multiplier: multiplier,
        profit: Math.floor(amount * multiplier - amount),
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toLocaleTimeString()
      };
    });
    setBetHistory(fakeBetHistory);
    
    // Начинаем игру
    startGameLoop();
    
    return () => {
      if (gameInterval) {
        clearInterval(gameInterval);
      }
    };
  }, []);

  const startGameLoop = () => {
    // Запускаем таймер перед началом игры
    let countdown = 5;
    setTimer(countdown);
    setIsCrashed(false);
    setIsPlaying(false);
    setCurrentMultiplier(1.00);
    setHasWithdrawn(false);
    setUserBet(null);
    
    // Генерируем случайные ставки других пользователей
    const randomBets = Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, index) => {
      const amount = Math.floor(Math.random() * 1000) + 100;
      return {
        id: Date.now() + index,
        username: FAKE_USERS[Math.floor(Math.random() * FAKE_USERS.length)],
        amount: amount,
        multiplier: 0,
        profit: 0,
        timestamp: new Date().toLocaleTimeString()
      };
    });
    setActiveBets(randomBets);
    
    const countdownInterval = setInterval(() => {
      countdown--;
      setTimer(countdown);
      
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        startCrashGame();
      }
    }, 1000);
  };

  const startCrashGame = () => {
    setIsPlaying(true);
    
    // Определяем, когда игра разобьется (случайный множитель)
    const crashMultiplier = getRandomCrashPoint();
    
    let currentValue = 1.00;
    const interval = 50; // ms
    const increment = 0.01;
    
    const gameTimer = setInterval(() => {
      currentValue = parseFloat((currentValue + increment).toFixed(2));
      setCurrentMultiplier(currentValue);
      
      // Автоматический вывод ставки пользователя
      if (userBet && !hasWithdrawn && currentValue >= parseFloat(autoWithdrawAt)) {
        withdrawBet();
      }
      
      // Автоматический вывод ставок ботов
      const updatedActiveBets = activeBets.map(bet => {
        // Если бот еще не вывел свою ставку и его цель достигнута
        if (bet.multiplier === 0 && Math.random() < 0.05) {
          return {
            ...bet,
            multiplier: currentValue,
            profit: Math.floor(bet.amount * currentValue - bet.amount)
          };
        }
        return bet;
      });
      setActiveBets(updatedActiveBets);
      
      // Игра разбивается, когда достигнут целевой множитель
      if (currentValue >= crashMultiplier) {
        clearInterval(gameTimer);
        setGameInterval(null);
        setIsCrashed(true);
        
        // Добавляем результат в историю
        setGameHistory(prev => [crashMultiplier, ...prev].slice(0, 15));
        
        // Обновляем историю ставок
        const successfulBets = updatedActiveBets.filter(bet => bet.multiplier > 0);
        setBetHistory(prev => [...successfulBets, ...prev].slice(0, 10));
        
        // Запускаем новую игру через 3 секунды
        setTimeout(() => {
          startGameLoop();
        }, 3000);
      }
    }, interval);
    
    setGameInterval(gameTimer);
  };

  const getRandomCrashPoint = () => {
    // Большинство игр разбивается на значении от 1.00 до 3.00
    // Но иногда могут быть значения до 10.00
    const rand = Math.random();
    if (rand < 0.7) {
      return parseFloat((Math.random() * 2 + 1).toFixed(2));
    } else if (rand < 0.95) {
      return parseFloat((Math.random() * 5 + 2).toFixed(2));
    } else {
      return parseFloat((Math.random() * 5 + 5).toFixed(2));
    }
  };

  const placeBet = () => {
    if (!isLoggedIn) {
      navigate('/');
      return;
    }
    
    const amount = parseFloat(betAmount);
    if (isNaN(amount) || amount <= 0 || amount > balance) {
      return;
    }
    
    // Снимаем сумму с баланса
    const newBalance = balance - amount;
    setBalance(newBalance);
    localStorage.setItem('cs2-balance', newBalance.toString());
    
    // Создаем объект ставки
    const bet: BetHistory = {
      id: Date.now(),
      username: "Вы",
      amount: amount,
      multiplier: 0,
      profit: -amount,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setUserBet(bet);
  };

  const withdrawBet = () => {
    if (!userBet || hasWithdrawn || !isPlaying || isCrashed) {
      return;
    }
    
    // Рассчитываем выигрыш
    const winAmount = userBet.amount * currentMultiplier;
    const profit = winAmount - userBet.amount;
    
    // Обновляем баланс
    const newBalance = balance + winAmount;
    setBalance(newBalance);
    localStorage.setItem('cs2-balance', newBalance.toString());
    
    // Обновляем ставку
    const updatedBet = {
      ...userBet,
      multiplier: currentMultiplier,
      profit: profit
    };
    setUserBet(updatedBet);
    
    // Добавляем в историю успешных ставок
    setBetHistory(prev => [updatedBet, ...prev].slice(0, 10));
    
    setHasWithdrawn(true);
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

  const handleAmountChange = (value: string) => {
    // Только числа
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setBetAmount(value);
    }
  };

  const handleAutoWithdrawChange = (value: string) => {
    // Только числа с точкой
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAutoWithdrawAt(value);
    }
  };

  // Функция для расчета цвета множителя
  const getMultiplierColor = (multiplier: number) => {
    if (multiplier < 2) return "text-blue-500";
    if (multiplier < 3) return "text-purple-500";
    if (multiplier < 5) return "text-pink-500";
    return "text-[#f97316]";
  };

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
        <h1 className="text-2xl font-bold mb-6">Игра "Краш"</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-[#1a1f2c] border-gray-800 h-full">
              <CardContent className="p-6">
                <div className="mb-4 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">История:</span>
                    <div className="flex space-x-1">
                      {gameHistory.slice(0, 8).map((multi, index) => (
                        <span 
                          key={index} 
                          className={`text-xs font-medium px-2 py-1 rounded ${getMultiplierColor(multi)} bg-[#0e1015]`}
                        >
                          {multi.toFixed(2)}x
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 mr-1.5 text-[#f97316]" />
                    <span>Онлайн: {Math.floor(Math.random() * 50) + 150}</span>
                  </div>
                </div>
                
                <div className="h-80 bg-[#0e1015] rounded-lg relative overflow-hidden flex items-center justify-center mb-6">
                  {!isPlaying && !isCrashed ? (
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-2">Начало игры через</p>
                      <p className="text-6xl font-bold text-[#f97316]">{timer}</p>
                    </div>
                  ) : isCrashed ? (
                    <div className="text-center">
                      <p className="text-3xl font-bold text-red-500 animate-pulse mb-2">РАЗБИЛСЯ</p>
                      <p className={`text-6xl font-bold ${getMultiplierColor(currentMultiplier)}`}>{currentMultiplier.toFixed(2)}x</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-bold mb-2">Множитель</p>
                      <p className={`text-6xl font-bold ${getMultiplierColor(currentMultiplier)}`}>{currentMultiplier.toFixed(2)}x</p>
                      <div className="mt-6">
                        <ArrowUp className={`h-12 w-12 mx-auto ${getMultiplierColor(currentMultiplier)}`} />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Сумма ставки</label>
                    <Input
                      value={betAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      className="bg-[#0e1015] border-gray-800"
                      disabled={isPlaying && !isCrashed && userBet !== null}
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[100, 250, 500, 1000].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="border-gray-800"
                          onClick={() => setBetAmount(amount.toString())}
                          disabled={isPlaying && !isCrashed && userBet !== null}
                        >
                          {amount}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Авто-вывод при</label>
                    <Input
                      value={autoWithdrawAt}
                      onChange={(e) => handleAutoWithdrawChange(e.target.value)}
                      className="bg-[#0e1015] border-gray-800"
                      disabled={isPlaying && !isCrashed && userBet !== null}
                    />
                    <div className="grid grid-cols-4 gap-2">
                      {[1.5, 2, 3, 5].map((amount) => (
                        <Button
                          key={amount}
                          variant="outline"
                          size="sm"
                          className="border-gray-800"
                          onClick={() => setAutoWithdrawAt(amount.toString())}
                          disabled={isPlaying && !isCrashed && userBet !== null}
                        >
                          {amount}x
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-end">
                    {userBet === null ? (
                      <Button
                        className={`h-full bg-[#f97316] hover:bg-[#ea580c] text-white ${(!isLoggedIn || isPlaying) && "opacity-50"}`}
                        disabled={!isLoggedIn || isPlaying}
                        onClick={placeBet}
                      >
                        Поставить
                      </Button>
                    ) : hasWithdrawn || isCrashed ? (
                      <div className="h-full flex items-center justify-center bg-[#0e1015] rounded-md p-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Результат:</p>
                          <p className={`text-xl font-bold ${hasWithdrawn ? "text-green-500" : "text-red-500"}`}>
                            {hasWithdrawn ? `+${(userBet.amount * currentMultiplier).toFixed(0)} ₽` : `-${userBet.amount} ₽`}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        className="h-full bg-green-500 hover:bg-green-600 text-white"
                        onClick={withdrawBet}
                      >
                        Вывести {(userBet.amount * currentMultiplier).toFixed(0)} ₽
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-[#1a1f2c] border-gray-800 h-full">
              <CardContent className="p-4">
                <h3 className="text-lg font-bold mb-4">Активные ставки</h3>
                
                <div className="space-y-3 mb-4">
                  {userBet && (
                    <div className={`p-3 rounded bg-[#0e1015] ${hasWithdrawn ? "border-l-4 border-green-500" : "border-l-4 border-[#f97316]"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Вы</span>
                        <span className="text-[#f97316] font-bold">{userBet.amount} ₽</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-400">
                          {hasWithdrawn ? `Выведено на ${userBet.multiplier.toFixed(2)}x` : "В игре"}
                        </span>
                        {hasWithdrawn && (
                          <span className="text-green-500 font-bold">+{(userBet.amount * userBet.multiplier - userBet.amount).toFixed(0)} ₽</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {activeBets.map((bet) => (
                    <div 
                      key={bet.id} 
                      className={`p-3 rounded bg-[#0e1015] ${bet.multiplier > 0 ? "border-l-4 border-green-500" : "border-l-4 border-gray-700"}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{bet.username}</span>
                        <span className="text-[#f97316] font-bold">{bet.amount} ₽</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-400">
                          {bet.multiplier > 0 ? `Выведено на ${bet.multiplier.toFixed(2)}x` : "В игре"}
                        </span>
                        {bet.multiplier > 0 && (
                          <span className="text-green-500 font-bold">+{bet.profit} ₽</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4 bg-gray-800" />
                
                <h3 className="text-lg font-bold mb-4">История ставок</h3>
                <div className="max-h-[300px] overflow-y-auto pr-2 -mr-2">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="text-gray-400">Игрок</TableHead>
                        <TableHead className="text-gray-400 text-right">Ставка</TableHead>
                        <TableHead className="text-gray-400 text-right">Множитель</TableHead>
                        <TableHead className="text-gray-400 text-right">Выигрыш</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {betHistory.map((bet) => (
                        <TableRow key={bet.id} className="hover:bg-[#0e1015]/50 border-gray-800">
                          <TableCell className="font-medium">{bet.username}</TableCell>
                          <TableCell className="text-right">{bet.amount} ₽</TableCell>
                          <TableCell className={`text-right ${getMultiplierColor(bet.multiplier)}`}>
                            {bet.multiplier.toFixed(2)}x
                          </TableCell>
                          <TableCell className="text-right text-green-500">+{bet.profit} ₽</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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

export default CrashPage;
