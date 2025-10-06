import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://okbzdxktvxvtcjsuovtv.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rYnpkeGt0dnh2dGNqc3VvdnR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3MzUwOTIsImV4cCI6MjA3NTMxMTA5Mn0.IxNlluD5O4kHt_wFfyMB14GBeMdFaBD3tYLvruyKp0c';
const supabase = createClient(supabaseUrl, supabaseKey);

function ClickerGame() {
  const [clicks, setClicks] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [autoClickersCount, setAutoClickersCount] = useState(0);
  const [autoClickerCost, setAutoClickerCost] = useState(10);
  const [powerUpCost, setPowerUpCost] = useState(5);
  const [totalClicks, setTotalClicks] = useState(0);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [loading, setLoading] = useState(true);
  const [clickAnimation, setClickAnimation] = useState(false);

  useEffect(() => {
    loadGameData();
    const interval = setInterval(() => {
      if (autoClickersCount > 0) {
        handleAutoClick();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [autoClickersCount]);

  const loadGameData = async () => {
    try {
      const { data, error } = await supabase
        .from('clicker_game_state')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading game data:', error);
      }

      if (data) {
        setClicks(data.clicks || 0);
        setClickPower(data.click_power || 1);
        setAutoClickersCount(data.auto_clickers || 0);
        setAutoClickerCost(data.auto_clicker_cost || 10);
        setPowerUpCost(data.power_up_cost || 5);
        setTotalClicks(data.total_clicks || 0);
      }
    } catch (err) {
      console.error('Error loading game:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveGameData = async (gameState) => {
    try {
      const { error } = await supabase
        .from('clicker_game_state')
        .upsert({
          session_id: sessionId,
          clicks: gameState.clicks,
          click_power: gameState.clickPower,
          auto_clickers: gameState.autoClickersCount,
          auto_clicker_cost: gameState.autoClickerCost,
          power_up_cost: gameState.powerUpCost,
          total_clicks: gameState.totalClicks,
          updated_at: new Date().toISOString()
        }, { onConflict: 'session_id' });

      if (error) {
        console.error('Error saving game data:', error);
      }
    } catch (err) {
      console.error('Error saving game:', err);
    }
  };

  const handleClick = () => {
    const newClicks = clicks + clickPower;
    const newTotalClicks = totalClicks + clickPower;
    setClicks(newClicks);
    setTotalClicks(newTotalClicks);
    setClickAnimation(true);
    setTimeout(() => setClickAnimation(false), 100);

    saveGameData({
      clicks: newClicks,
      clickPower,
      autoClickersCount,
      autoClickerCost,
      powerUpCost,
      totalClicks: newTotalClicks
    });
  };

  const handleAutoClick = () => {
    const newClicks = clicks + autoClickersCount;
    const newTotalClicks = totalClicks + autoClickersCount;
    setClicks(newClicks);
    setTotalClicks(newTotalClicks);

    saveGameData({
      clicks: newClicks,
      clickPower,
      autoClickersCount,
      autoClickerCost,
      powerUpCost,
      totalClicks: newTotalClicks
    });
  };

  const buyPowerUp = () => {
    if (clicks >= powerUpCost) {
      const newClicks = clicks - powerUpCost;
      const newClickPower = clickPower + 1;
      const newPowerUpCost = Math.floor(powerUpCost * 1.5);

      setClicks(newClicks);
      setClickPower(newClickPower);
      setPowerUpCost(newPowerUpCost);

      saveGameData({
        clicks: newClicks,
        clickPower: newClickPower,
        autoClickersCount,
        autoClickerCost,
        powerUpCost: newPowerUpCost,
        totalClicks
      });
    }
  };

  const buyAutoClicker = () => {
    if (clicks >= autoClickerCost) {
      const newClicks = clicks - autoClickerCost;
      const newAutoClickersCount = autoClickersCount + 1;
      const newAutoClickerCost = Math.floor(autoClickerCost * 1.5);

      setClicks(newClicks);
      setAutoClickersCount(newAutoClickersCount);
      setAutoClickerCost(newAutoClickerCost);

      saveGameData({
        clicks: newClicks,
        clickPower,
        autoClickersCount: newAutoClickersCount,
        autoClickerCost: newAutoClickerCost,
        powerUpCost,
        totalClicks
      });
    }
  };

  const resetGame = async () => {
    setClicks(0);
    setClickPower(1);
    setAutoClickersCount(0);
    setAutoClickerCost(10);
    setPowerUpCost(5);
    setTotalClicks(0);

    try {
      await supabase
        .from('clicker_game_state')
        .delete()
        .eq('session_id', sessionId);
    } catch (err) {
      console.error('Error resetting game:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-2">Click Simulator</h1>
        <p className="text-blue-200 text-lg">Click your way to glory!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-blue-500">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-6xl font-bold text-blue-400 mb-2">{clicks.toLocaleString()}</div>
              <div className="text-xl text-blue-200">Clicks</div>
            </div>

            <button
              onClick={handleClick}
              className={`w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold text-3xl shadow-lg transform transition-all duration-100 hover:scale-105 active:scale-95 ${clickAnimation ? 'scale-110' : ''}`}
            >
              CLICK ME!
            </button>

            <div className="mt-8 text-blue-200">
              <div className="text-lg">Click Power: <span className="text-white font-bold">{clickPower}</span></div>
              <div className="text-lg">Auto-Clickers: <span className="text-white font-bold">{autoClickersCount}</span></div>
              <div className="text-lg">Total Clicks: <span className="text-white font-bold">{totalClicks.toLocaleString()}</span></div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-green-500">
            <h2 className="text-2xl font-bold text-white mb-4">Upgrades</h2>

            <div className="space-y-4">
              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-white font-bold text-lg">Click Power +1</div>
                    <div className="text-green-300 text-sm">Increase clicks per click</div>
                  </div>
                  <button
                    onClick={buyPowerUp}
                    disabled={clicks < powerUpCost}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      clicks >= powerUpCost
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {powerUpCost} Clicks
                  </button>
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="text-white font-bold text-lg">Auto-Clicker</div>
                    <div className="text-green-300 text-sm">+1 click per second</div>
                  </div>
                  <button
                    onClick={buyAutoClicker}
                    disabled={clicks < autoClickerCost}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      clicks >= autoClickerCost
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {autoClickerCost} Clicks
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-red-500">
            <h2 className="text-2xl font-bold text-white mb-4">Actions</h2>
            <button
              onClick={resetGame}
              className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition-all"
            >
              Reset Game
            </button>
          </div>

          <div className="bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-3">How to Play</h2>
            <ul className="text-blue-200 space-y-2">
              <li>• Click the button to earn clicks</li>
              <li>• Buy upgrades to increase your clicking power</li>
              <li>• Purchase auto-clickers for passive income</li>
              <li>• Watch your clicks grow exponentially!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClickerGame;
