/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { FaCog, FaTimesCircle } from 'react-icons/fa';
import Navbar from '@/app/components/Navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';

export default function UserTable() {
  type UserStatus = 'active' | 'suspended' | 'inactive';

  interface User {
    id: number;
    name: string;
    email: string;
    createdAt: string;
    role: string;
    status: UserStatus;
  }

  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) {
      router.push('/signin');
    }
  }, [session, router]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(`/api/getUsers`);
        const data = await response.json();
        setUsers(Array.isArray(data.data) ? data.data : []);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  const deleteUser = async (email: string) => {
    if (!session || session.user.role !== "admin") {
        toast.error("Only admins can delete users.");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete ${email}?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/deleteUser`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        alert("User deleted successfully.");
        setUsers(prevUsers => prevUsers.filter(user => user.email !== email));
      } else {
        toast.error(`Failed to delete user: ${data.message}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('An error occurred while deleting the user.');
    }
  };

  const totalPages = users.length > 0 ? Math.ceil(users.length / usersPerPage) : 1;
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser).map(user => ({
    ...user,
    status: session?.user?.email === user.email ? 'active' : user.status,
  }));

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="flex flex-col mt-16 justify-center items-center min-h-screen text-black bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg min-h-screen w-full md:mx-24 max-sm:mx-4">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">User List</h2>

          <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse rounded-lg overflow-hidden min-w-[600px]">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="py-3 px-4 text-left">#</th>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Date Created</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => (
                  <tr key={user.email} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-4">{indexOfFirstUser + index + 1}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <img
                        src={`https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                        alt={user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      {user.name}
                    </td>
                    <td className="py-3 px-4">
                      {user.createdAt ? format(new Date(user.createdAt), 'dd/MM/yyyy') : 'N/A'}
                    </td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td
                      className={`py-3 px-4 font-semibold ${
                        user.status === 'active' ? 'text-green-500' :
                        user.status === 'suspended' ? 'text-red-500' :
                        user.status === 'inactive' ? 'text-yellow-500' :
                        'text-gray-500'
                      }`}
                    >
                      {user.status}
                    </td>
                    <td className="py-3 px-4 text-center flex justify-center gap-2">
                      <FaCog className="text-blue-500 text-2xl cursor-pointer hover:text-blue-700" />
                      <FaTimesCircle
                        className="text-red-500 text-2xl cursor-pointer hover:text-red-700"
                        onClick={() => deleteUser(user.email)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
