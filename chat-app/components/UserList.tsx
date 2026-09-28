'use client';

interface UserListProps {
  users: string[];
  currentUser: string | null;
}

export default function UserList({ users, currentUser }: UserListProps) {
  return (
    <aside className="w-56 bg-gray-100 border-r border-gray-200 p-4 flex flex-col">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
        En línea — {users.length}
      </h2>
      <ul className="space-y-2 flex-1 overflow-y-auto">
        {users.map((user) => (
          <li
            key={user}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
            <span className={user === currentUser ? 'font-semibold' : ''}>
              {user}
              {user === currentUser && ' (tú)'}
            </span>
          </li>
        ))}
        {users.length === 0 && (
          <li className="text-xs text-gray-400 italic">Nadie conectado</li>
        )}
      </ul>
    </aside>
  );
}