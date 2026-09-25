import { useState, useEffect } from 'react';
import TaskItem from './components/TaskItem';

function App() {
  // 保存済みのタスクがあれば、それを初期値にする
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  // tasks が変わるたびに localStorage へ保存する
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // タスクを追加する
  const addTask = (event) => {
    event.preventDefault(); // フォーム送信によるページ再読み込みを止める
    const text = input.trim();
    if (text === '') return; // 空文字は追加しない
    setTasks([...tasks, { id: Date.now(), text, done: false }]);
    setInput(''); // 入力欄を空に戻す
  };

  // 完了状態を切り替える
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  };

  // タスクを削除する
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // filter の値に応じて表示するタスクを絞り込む（元の tasks は変えない）
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.done;
    if (filter === 'done') return task.done;
    return true;
  });

  const filters = [
    { key: 'all', label: 'すべて' },
    { key: 'active', label: '未完了' },
    { key: 'done', label: '完了済み' },
  ];

  return (
    <main className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">タスク管理</h1>

      {/* 入力フォーム：ボタンでもEnterでも追加できる */}
      <form onSubmit={addTask} className="flex gap-2 mb-4">
        <input
          className="border rounded px-3 py-2 flex-1"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="新しいタスクを入力..."
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          追加
        </button>
      </form>

      {/* フィルターボタン */}
      <div className="flex gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1 rounded border ${
              filter === f.key
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* タスク一覧 */}
      <ul className="space-y-2">
        {visibleTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        ))}
      </ul>

      {visibleTasks.length === 0 && (
        <p className="text-center text-gray-400 mt-8">タスクがありません</p>
      )}
    </main>
  );
}

export default App;
