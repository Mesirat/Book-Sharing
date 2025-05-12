const StatsCard = ({ title, count, icon: Icon }) => {
  return (
    <div className="flex items-center mx-auto p-4 bg-white shadow-lg cursor-pointer rounded-2xl w-full sm:w-48 hover:shadow-xl transition-shadow duration-300 mb-8">
      <div className="p-4 bg-blue-200 text-blue-700 rounded-full mr-6">
        <Icon className="w-8 h-8" />
      </div>
      <div>
        <p className="text-xs text-gray-600 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
};

export default StatsCard;
