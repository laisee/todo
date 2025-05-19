const Header = ({ todoCount = 0, overdueCount = 0 }) => {
  return (
    <div className="container mx-auto">
      <header className="w-full bg-blue-200 text-blue p-4 text-center shadow border-2 border-blue-300 rounded mt-4 mb-0">
        <h1 className="text-3xl font-bold flex justify-center items-center gap-2">
          Manage Your ToDo List
          <span className="inline-block animate-bounce">✅</span>
        </h1>
        <p className="text-sm italic mt-2 text-green-800">
          {todoCount} {todoCount === 1 ? 'item' : 'items'} in your list
          {overdueCount > 0 && (
            <span className="ml-2 text-red-600 font-medium">
              ({overdueCount} {overdueCount === 1 ? 'task' : 'tasks'} overdue)
            </span>
          )}
        </p>
      </header>
    </div>
  );
};

export default Header;
