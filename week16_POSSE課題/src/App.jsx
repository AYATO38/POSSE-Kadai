import { useState, useEffect } from 'react';

const WHEEL_SIZE = 256; // px
const COLORS = [
  '#f87171',
  '#fbbf24',
  '#34d399',
  '#60a5fa',
  '#a78bfa',
  '#f472b6',
  '#fb923c',
  '#4ade80',
];

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('roulette-items');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [pendingWinnerIndex, setPendingWinnerIndex] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [savedRoulettes, setSavedRoulettes] = useState(() => {
    const saved = localStorage.getItem('roulette-saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [saveName, setSaveName] = useState('');

  const sliceAngle = items.length > 0 ? 360 / items.length : 0;

  // items が変わるたびに localStorage へ保存する
  useEffect(() => {
    localStorage.setItem('roulette-items', JSON.stringify(items));
  }, [items]);

  // savedRoulettes が変わるたびに localStorage へ保存する
  useEffect(() => {
    localStorage.setItem('roulette-saved', JSON.stringify(savedRoulettes));
  }, [savedRoulettes]);

  // 項目を追加する
  const addItem = (event) => {
    event.preventDefault();
    const text = input.trim();
    if (text === '') return;
    setItems([...items, text]);
    setInput('');
  };

  // 選択中の項目を削除する
  const deleteSelected = () => {
    if (selectedIndex === null) return;
    setItems(items.filter((_, index) => index !== selectedIndex));
    setSelectedIndex(null);
  };

  // ルーレットを円形に回転させ、当選スロットの中心でぴったり止める
  const spin = () => {
    if (items.length === 0 || spinning) return;

    const winner = Math.floor(Math.random() * items.length);
    // ポインターは常に真上（0deg）固定。当選スロットの中心をそこに合わせる角度を逆算する
    const targetMod = (360 - (winner * sliceAngle + sliceAngle / 2) + 360) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    const extraSpins = 5; // 見た目のための余分な回転数
    const delta = (targetMod - currentMod + 360) % 360;

    setPendingWinnerIndex(winner);
    setWinnerIndex(null);
    setResult(null);
    setSelectedIndex(null);
    setSpinning(true);
    setRotation(rotation + extraSpins * 360 + delta);
  };

  // 回転アニメーションが終わったタイミングで結果を確定する
  const handleSpinEnd = () => {
    if (!spinning) return;
    setWinnerIndex(pendingWinnerIndex);
    setResult(items[pendingWinnerIndex]);
    setSpinning(false);
  };

  // 現在の項目リストを名前付きで保存する
  const saveRoulette = (event) => {
    event.preventDefault();
    const name = saveName.trim();
    if (name === '' || items.length === 0) return;
    setSavedRoulettes([...savedRoulettes, { id: Date.now(), name, items }]);
    setSaveName('');
  };

  // 保存済みルーレットを呼び出して現在のリストに反映する
  const loadRoulette = (roulette) => {
    if (spinning) return;
    setItems(roulette.items);
    setSelectedIndex(null);
    setWinnerIndex(null);
    setResult(null);
  };

  // 保存済みルーレットを削除する
  const deleteSavedRoulette = (id) => {
    setSavedRoulettes(savedRoulettes.filter((roulette) => roulette.id !== id));
  };

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ルーレット</h1>

      {/* 円形のルーレット本体 */}
      <div
        className="relative mx-auto mb-6"
        style={{ width: WHEEL_SIZE, height: WHEEL_SIZE }}
      >
        {/* ポインター（常に真上・固定） */}
        <div className="absolute left-1/2 -top-1 z-10 h-0 w-0 -translate-x-1/2 border-x-10 border-t-18 border-x-transparent border-t-red-600" />

        {/* 回転する円盤 */}
        <div
          onTransitionEnd={handleSpinEnd}
          className="h-full w-full rounded-full border-4 border-white shadow-lg"
          style={{
            background:
              items.length > 0
                ? `conic-gradient(${items
                    .map((_, index) => {
                      const color = COLORS[index % COLORS.length];
                      const from = (index * sliceAngle).toFixed(2);
                      const to = ((index + 1) * sliceAngle).toFixed(2);
                      return `${color} ${from}deg ${to}deg`;
                    })
                    .join(', ')})`
                : '#e5e7eb',
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
        >
          {items.map((item, index) => {
            const mid = index * sliceAngle + sliceAngle / 2;
            const radius = WHEEL_SIZE / 2 - 24;
            return (
              <div
                key={index}
                className="absolute left-1/2 top-1/2"
                style={{
                  // 中心から角度分だけ外側へ移動させたあと、逆回転で向きだけ元に戻す
                  // → 円周上の正しい位置に、文字は常に水平のまま配置できる
                  transform: `rotate(${mid}deg) translate(0, -${radius}px) rotate(${-mid}deg)`,
                }}
              >
                <span className="absolute -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white whitespace-nowrap">
                  {item}
                </span>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <p className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            項目を追加してください
          </p>
        )}
      </div>

      {/* 項目の追加 */}
      <form onSubmit={addItem} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="項目を入力..."
          disabled={spinning}
        />
        <button
          type="submit"
          disabled={spinning}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          追加
        </button>
      </form>

      {/* 項目一覧（クリックで選択、削除ボタンで選択中を削除） */}
      <ul className="space-y-2 mb-4">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={() => !spinning && setSelectedIndex(index)}
            className={`cursor-pointer rounded-lg border px-4 py-2 text-center transition-colors ${
              index === winnerIndex
                ? 'bg-yellow-200 border-yellow-400'
                : index === selectedIndex
                  ? 'bg-blue-100 border-blue-400'
                  : 'bg-white border-gray-200'
            }`}
          >
            {item}
          </li>
        ))}
      </ul>

      {items.length === 0 && (
        <p className="text-center text-gray-400 mb-4">項目がありません</p>
      )}

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={spin}
          disabled={items.length === 0 || spinning}
          className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {spinning ? '回転中...' : 'まわす'}
        </button>
        <button
          type="button"
          onClick={deleteSelected}
          disabled={selectedIndex === null || spinning}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-500 disabled:opacity-50"
        >
          削除
        </button>
      </div>

      {/* 当たった項目を大きく表示 */}
      {result && (
        <p className="text-center text-3xl font-bold text-orange-500 mb-6">
          🎉 {result}
        </p>
      )}

      <hr className="my-6 border-gray-200" />

      {/* 保存済みルーレット */}
      <h2 className="text-lg font-bold mb-2">保存済みルーレット</h2>
      <form onSubmit={saveRoulette} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={saveName}
          onChange={(event) => setSaveName(event.target.value)}
          placeholder="保存名を入力..."
        />
        <button
          type="submit"
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          保存
        </button>
      </form>

      <ul className="space-y-2">
        {savedRoulettes.map((roulette) => (
          <li
            key={roulette.id}
            className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2"
          >
            <span className="flex-1">{roulette.name}</span>
            <button
              type="button"
              onClick={() => loadRoulette(roulette)}
              disabled={spinning}
              className="text-blue-500 hover:text-blue-700 text-sm disabled:opacity-50"
            >
              呼び出す
            </button>
            <button
              type="button"
              onClick={() => deleteSavedRoulette(roulette.id)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              削除
            </button>
          </li>
        ))}
      </ul>

      {savedRoulettes.length === 0 && (
        <p className="text-center text-gray-400 mt-4">
          保存済みルーレットがありません
        </p>
      )}
    </main>
  );
}

export default App;
