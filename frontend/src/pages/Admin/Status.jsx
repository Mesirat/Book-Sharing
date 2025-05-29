import { useEffect, useState } from "react";
import api from "../../Services/api";
import StatsCard from "./StatsCard";
import { Users, User, BookCopy } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useLocation } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Status = () => {
  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    groups: 0,
    topBooks: [],
    topGroups: [],
  });

  const token = useAuthStore.getState().token;
  const location = useLocation();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  const bookChartData = stats.topBooks.map((book) => ({
    name: book.title,
    value: book.readers,
  }));

  const groupChartData = stats.topGroups.map((group) => ({
    name: group.name,
    value: group.members,
  }));

  return (
    <div className={`${location.pathname === "/admin" ? "space-y-10 mt-4 px-4 md:px-8" : "hidden"}`}>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsCard title="Total Users" count={stats.users} icon={User} />
        <StatsCard title="Total Books" count={stats.books} icon={BookCopy} />
        <StatsCard title="Total Groups" count={stats.groups} icon={Users} />
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Books On Everyone’s Shelf</h2>
          <ul className="bg-white rounded-lg shadow-md p-4 space-y-3 max-h-[410px] overflow-y-auto">
            {stats.topBooks.map((book, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={book.profilePic}
                    alt="Book Cover"
                    className="w-14 h-14 object-cover border rounded"
                  />
                  <span className="text-lg font-medium">{book.title}</span>
                </div>
                <span className="text-gray-600 text-sm">{book.readers} reads</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 lg:mt-10">
          <div className="bg-white rounded-lg shadow-md p-4 h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#5D8AA8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-center text-base font-medium mt-2 text-gray-700">
            Most Read Books - Bar Chart
          </h2>
        </div>
      </div>

    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Most Engaged Communities</h2>
          <ul className="bg-white rounded-lg shadow-md p-4 space-y-3 max-h-[410px] overflow-y-auto">
            {stats.topGroups.map((group, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b pb-2"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={group.profilePic}
                    alt="Group Profile"
                    className="w-14 h-14 object-cover rounded-full border"
                  />
                  <span className="text-lg font-medium">{group.name}</span>
                </div>
                <span className="text-gray-600 text-sm">{group.members} members</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 lg:mt-10">
          <div className="bg-white rounded-lg shadow-md p-4 h-[410px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#5D8AA8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-center text-base font-medium mt-2 text-gray-700">
            Trending Groups - Bar Chart
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Status;
