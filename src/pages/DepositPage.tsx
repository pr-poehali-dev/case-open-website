
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { CheckCircle, CreditCard, DollarSign, Shield, WalletCards } from "lucide-react";

const DepositPage = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryDate, setExpiryDate] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [isDepositing, setIsDepositing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [balance, setBalance] = useState(() => {
    const storedBalance = localStorage.getItem('cs2-balance');
    return storedBalance ? Number(storedBalance) : 5000;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cs2-login-status') === 'logged-in';
  });
  
  const navigate = useNavigate();

  // Обработчик для установки предопределенных сумм
  const handlePresetAmount = (value: string) => {
    setAmount(value);
  };

  // Обработчик для депозита
  const handleDeposit = () => {
    if (!cardNumber || !expiryDate || !cvv || !amount) {
      return;
    }

    setIsDepositing(true);

    // Имитация процесса пополнения баланса
    setTimeout(() => {
      const newBalance = balance + Number(amount);
      setBalance(newBalance);
      localStorage.setItem('cs2-balance', newBalance.toString());
      
      setIsDepositing(false);
      setIsSuccess(true);
      
      // Очистка формы через некоторое время после успешного пополнения
      setTimeout(() => {
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };

  // Обработчики логина/логаута
  const handleLogin = () => {
    navigate('/');
  };
  
  const handleRegister = () => {
    navigate('/');
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('cs2-login-status');
    navigate('/');
  };

  // Проверка авторизации
  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Пополнение баланса</h1>
          <div className="flex items-center gap-3 bg-[#1a1f2c] py-2 px-4 rounded-lg">
            <WalletCards className="text-[#f97316] h-5 w-5" />
            <div>
              <span className="text-gray-400 text-sm">Баланс:</span>
              <span className="text-white font-bold ml-2">{balance.toLocaleString()} ₽</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="w-full bg-[#1a1f2c] mb-6">
                <TabsTrigger value="card" className="flex-1 data-[state=active]:bg-[#f97316]">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Банковская карта
                </TabsTrigger>
                <TabsTrigger value="qiwi" className="flex-1 data-[state=active]:bg-[#f97316]">
                  QIWI
                </TabsTrigger>
                <TabsTrigger value="crypto" className="flex-1 data-[state=active]:bg-[#f97316]">
                  Криптовалюта
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="mt-0">
                <Card className="bg-[#1a1f2c] border-gray-800">
                  <CardHeader>
                    <CardTitle>Оплата банковской картой</CardTitle>
                    <CardDescription className="text-gray-400">
                      Мгновенное пополнение баланса через банковскую карту
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Сумма пополнения (₽)</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Введите сумму"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-[#0e1015] border-gray-800"
                      />
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {["500", "1000", "2500", "5000"].map((value) => (
                          <Button
                            key={value}
                            type="button"
                            variant={amount === value ? "default" : "outline"}
                            className={amount === value ? "bg-[#f97316] hover:bg-[#ea580c]" : "border-gray-800 hover:bg-white/10"}
                            onClick={() => handlePresetAmount(value)}
                          >
                            {value} ₽
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="card-number">Номер карты</Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="bg-[#0e1015] border-gray-800"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiry">Срок действия</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          className="bg-[#0e1015] border-gray-800"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          className="bg-[#0e1015] border-gray-800"
                          maxLength={3}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleDeposit}
                      disabled={isDepositing || !cardNumber || !expiryDate || !cvv || !amount}
                      className="w-full bg-[#f97316] hover:bg-[#ea580c] py-6 text-lg"
                    >
                      {isDepositing ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Обработка...
                        </span>
                      ) : isSuccess ? (
                        <span className="flex items-center">
                          <CheckCircle className="mr-2 h-5 w-5" />
                          Успешно пополнено!
                        </span>
                      ) : (
                        `Пополнить на ${amount} ₽`
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="qiwi" className="mt-0">
                <Card className="bg-[#1a1f2c] border-gray-800">
                  <CardHeader>
                    <CardTitle>QIWI Кошелек</CardTitle>
                    <CardDescription className="text-gray-400">
                      Пополнение баланса через QIWI
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-400">Функционал скоро будет доступен</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto" className="mt-0">
                <Card className="bg-[#1a1f2c] border-gray-800">
                  <CardHeader>
                    <CardTitle>Криптовалюта</CardTitle>
                    <CardDescription className="text-gray-400">
                      Пополнение баланса с помощью Bitcoin, Ethereum и других криптовалют
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-gray-400">Функционал скоро будет доступен</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card className="bg-[#1a1f2c] border-gray-800">
              <CardHeader>
                <CardTitle>Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="text-[#f97316] h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Безопасность</h4>
                    <p className="text-sm text-gray-400">Все платежи защищены и полностью безопасны.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <DollarSign className="text-[#f97316] h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Минимальная сумма</h4>
                    <p className="text-sm text-gray-400">Минимальная сумма пополнения – 100 ₽</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-[#f97316] h-5 w-5 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Зачисление средств</h4>
                    <p className="text-sm text-gray-400">Моментальное зачисление на ваш баланс.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-[#1a1f2c] border-gray-800 mt-6">
              <CardHeader>
                <CardTitle>Бонусы</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gradient-to-r from-[#f97316]/20 to-transparent rounded-lg mb-4">
                  <h4 className="font-medium text-[#f97316]">+10% к пополнению</h4>
                  <p className="text-sm text-gray-400">При пополнении от 5000 ₽</p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-[#f97316]/20 to-transparent rounded-lg">
                  <h4 className="font-medium text-[#f97316]">+15% к пополнению</h4>
                  <p className="text-sm text-gray-400">При пополнении от 10000 ₽</p>
                </div>
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

export default DepositPage;
