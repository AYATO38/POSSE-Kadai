function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
      <span
        className={`flex-1 cursor-pointer ${task.done ? 'line-through text-gray-400' : ''}`}
        onClick={() => onToggle(task.id)}
      >
        {task.text}
      </span>
      <button
        className="text-red-400 hover:text-red-600 text-sm"
        onClick={() => onDelete(task.id)}
      >
        削除
      </button>
    </li>
  );
}

export default TaskItem;
