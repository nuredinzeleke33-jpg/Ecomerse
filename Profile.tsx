"use client";

import { useState } from "react";
import { FaEdit, FaMoon, FaSun, FaSignOutAlt, FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import { auth, storage } from "../lib/firebase";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateProfile } from "firebase/auth";

export default function ProfilePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Nurye Zeleke",
    email: "nurye@example.com",
    avatar: "https://i.pravatar.cc/150?img=3",
  });
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (typeof window !== "undefined") {
        document.documentElement.classList.toggle("dark", next);
      }
      return next;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // if a file is selected, upload it first
    const doSave = async () => {
      if (selectedFile && storage) {
        try {
          setUploading(true);
          const uid = auth?.currentUser?.uid || `anon-${Date.now()}`;
          const path = `avatars/${uid}-${Date.now()}-${selectedFile.name}`;
          const sRef = storageRef(storage, path);
          const uploadTask = uploadBytesResumable(sRef, selectedFile);
          await new Promise((res, rej) => {
            uploadTask.on('state_changed', undefined, (err) => rej(err), () => res(null));
          });
          const url = await getDownloadURL(sRef);
          setUser(prev => ({ ...prev, avatar: url }));
          // if logged in, update Firebase auth profile
          if (auth?.currentUser) {
            try { await updateProfile(auth.currentUser, { photoURL: url }); } catch (e) { console.warn('updateProfile failed', e); }
          }
        } catch (err) {
          console.error('Upload failed', err);
          alert('Avatar upload failed');
        } finally {
          setUploading(false);
        }
      }
      setEditing(false);
    };

    void doSave();
  };

  const handleFileChange = (f?: FileList | null) => {
    const file = f && f[0] ? f[0] : null;
    setSelectedFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-8 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          My Profile
        </h1>
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 rounded-full p-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          <span className="text-sm">{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0 flex flex-col items-center md:items-start gap-4">
          <img
            src={user.avatar}
            alt="Profile Avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500"
          />
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-blue-500 hover:underline text-sm"
          >
            <FaEdit /> Edit Profile
          </button>
        </div>

        {/* User Info */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Name
            </h2>
            <p className="text-gray-500 dark:text-gray-300">{user.name}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Email
            </h2>
            <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
          </div>
        </div>

        {/* Logout */}
        <div className="flex flex-col justify-center items-center md:items-end">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            <FaSignOutAlt /> Logout
          </Link>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          My Orders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Example order card */}
          {[1, 2, 3].map(order => (
            <div
              key={order}
              className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 flex justify-between items-center transition hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <FaShoppingBag className="text-blue-500 text-2xl" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-200">
                    Order #{1000 + order}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    3 items - $120
                  </p>
                </div>
              </div>
              <button className="text-sm text-blue-500 hover:underline">
                View
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <button
              onClick={() => setEditing(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 text-lg"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Edit Profile
            </h2>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                />
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Avatar</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                    <img src={filePreview || user.avatar} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e.target.files)} className="text-sm text-gray-600" />
                    {uploading && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) =>
                    setUser((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
