import React, { useState, useEffect } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

interface Order {
  id: string;
  item: string;
  status: 'pending' | 'preparing' | 'delivering' | 'delivered';
  timestamp: number;
  estimatedTime: number;
}

interface DeliveryScreenProps {
  onNavigate: (screen: any, contact?: any) => void;
  onGoBack: () => void;
}

const DeliveryScreen: React.FC<DeliveryScreenProps> = ({ onNavigate, onGoBack }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Order delivered
      const updated = orders.map(o =>
        o.id === orders[orders.length - 1]?.id ? { ...o, status: 'delivered' } : o
      );
      setOrders(updated);
      setCountdown(null);
    }
  }, [countdown, orders]);

  const foods: MenuItem[] = [
    { id: '1', name: '红油豆腐鱼', price: 38, icon: '🐟' },
    { id: '2', name: '炒饭', price: 15, icon: '🍚' },
    { id: '3', name: '宫保鸡丁', price: 28, icon: '🍗' },
    { id: '4', name: '麻辣烫', price: 22, icon: '🌶️' },
    { id: '5', name: '汉堡套餐', price: 35, icon: '🍔' },
    { id: '6', name: '奶茶', price: 12, icon: '🧋' },
  ];

  const restaurants = [
    { name: '美食城', foods: foods.slice(0, 3) },
    { name: '快餐店', foods: foods.slice(3, 6) },
  ];

  const placeOrder = (food: MenuItem) => {
    const newOrder: Order = {
      id: Date.now().toString(),
      item: food.name,
      status: 'preparing',
      timestamp: Date.now(),
      estimatedTime: Math.random() * 5 + 8,
    };

    const updated = [...orders, newOrder];
    setOrders(updated);
    setSelectedFood(null);
    setCountdown(Math.ceil(newOrder.estimatedTime * 60)); // Convert to seconds

    alert(`订单已下单！${food.name} - ¥${food.price}`);
  };

  const accelerateDelivery = () => {
    if (countdown !== null && countdown > 0) {
      setCountdown(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="delivery-screen">
      <div className="screen-header">
        <button onClick={onGoBack} className="back-btn">←</button>
        <h2>外卖</h2>
        <div></div>
      </div>

      <div className="delivery-content">
        <div className="restaurants-list">
          {restaurants.map((restaurant) => (
            <div key={restaurant.name} className="restaurant-section">
              <h3>🏪 {restaurant.name}</h3>
              <div className="food-grid">
                {restaurant.foods.map((food) => (
                  <div key={food.id} className="food-item" onClick={() => placeOrder(food)}>
                    <div className="food-icon">{food.icon}</div>
                    <div className="food-name">{food.name}</div>
                    <div className="food-price">¥{food.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {countdown !== null && (
          <div className="delivery-timer">
            <h3>📦 订单配送中</h3>
            <div className="timer-display">
              ⏱️ {formatTime(countdown)}
            </div>
            <button onClick={accelerateDelivery} className="accelerate-btn">
              ⚡ 加速送达
            </button>
          </div>
        )}

        {orders.length > 0 && (
          <div className="orders-history">
            <h3>📋 历史订单</h3>
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <span>{order.item}</span>
                <span className={`status ${order.status}`}>
                  {order.status === 'delivered' && '✓ 已送达'}
                  {order.status === 'preparing' && '🔄 准备中'}
                  {order.status === 'delivering' && '🚗 配送中'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryScreen;
