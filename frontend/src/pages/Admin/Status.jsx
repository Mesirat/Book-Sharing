import { useEffect, useState } from "react";
import api from "../../Services/api";
import StatsCard from "./StatsCard";
import { Users, BookCopy } from "lucide-react";
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
    <div
      className={`${
        location.pathname === "/admin" ? "space-y-6 mt-4" : "hidden"
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 ">
        <StatsCard title="Total Users" count={stats.users} icon={Users} />
        <StatsCard title="Total Books" count={stats.books} icon={BookCopy} />
        <StatsCard title="Total Groups" count={stats.groups} icon={Users} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Books On Everyone’s Shelf
          </h2>
          <ul className="bg-white rounded-lg shadow p-4 space-y-2">
            {stats.topBooks.map((book, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <div className="flex justify-around">
                  <img
                    src={book.profilePic}
                    alt="Profile Preview"
                    className="w-12 h-12 object-cover  border mr-4"
                  />
                  <span className="text-center text-xl mt-2">{book.title}</span>
                </div>
                <span className="text-gray-600">{book.readers} readers</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-4 h-80 min-h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#BFDBFE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-xl text-center mt-2">
            Most Read Books - Bar Chart
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Most Engaged Communities
          </h2>
          <ul className="bg-white rounded-lg shadow p-2 space-y-2">
            {stats.topGroups.map((group, i) => (
              <li key={i} className="flex justify-between border-b pb-1">
                <div className="flex justify-around">
                  <img
                    src={group.profilePic}
                    alt="Profile Preview"
                    className="w-12 h-12 object-cover rounded-full border mr-4"
                  />
                  <span className="text-center text-xl mt-2">{group.name}</span>
                </div>
                <span className="text-gray-600">{group.members} members</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-4 h-80 min-h-[300px] mt-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={groupChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#BFDBFE" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <h2 className="text-xl text-center mt-2">
            Trending Groups - Bar Chart
          </h2>
        </div>
      </div>
    </div>
  );
};

export default Status;
