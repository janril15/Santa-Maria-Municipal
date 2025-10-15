"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  DocumentTextIcon,
  TrashIcon,
  ChartBarIcon,
  ArrowRightOnRectangleIcon,
  PencilIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function AdminPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add form state
  const [addTitle, setAddTitle] = useState("");
  const [addContent, setAddContent] = useState("");
  const [addCategory, setAddCategory] = useState("General");
  const [addImage, setAddImage] = useState("");
  
  // Edit form state
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("General");
  const [editImage, setEditImage] = useState("");
  
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    recentAnnouncements: 0,
    categories: {} as Record<string, number>,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const role = localStorage.getItem("role");
    if (!isLoggedIn || role !== "ADMIN") {
      router.push("/login");
    } else {
      getAnnouncements();
    }
  }, [router]);

  useEffect(() => {
    // Filter announcements based on search term
    if (searchTerm) {
      const filtered = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    } else {
      setFilteredAnnouncements(announcements);
    }
  }, [searchTerm, announcements]);

  async function getAnnouncements() {
    try {
      const res = await fetch("/api/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
        setFilteredAnnouncements(data);
        
        // Calculate stats
        const categories: Record<string, number> = {};
        data.forEach((announcement: any) => {
          categories[announcement.category] = (categories[announcement.category] || 0) + 1;
        });

        setStats({
          totalAnnouncements: data.length,
          recentAnnouncements: data.filter((a: any) => {
            const announcementDate = new Date(a.createdAt);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return announcementDate > weekAgo;
          }).length,
          categories,
        });
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  }

  // Add new announcement
  async function addAnnouncement(e: React.FormEvent) {
  e.preventDefault();
  if (!addTitle.trim() || !addContent.trim()) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    // Get the current user email from localStorage
    const userEmail = localStorage.getItem("userEmail");

    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userEmail}` // Send user email as simple token
      },
      body: JSON.stringify({
        title: addTitle,
        content: addContent,
        category: addCategory,
        image: addImage || "/images/default-announcement.jpg"
      }),
    });

    if (res.ok) {
      setAddTitle("");
      setAddContent("");
      setAddCategory("General");
      setAddImage("");
      getAnnouncements();
      setActiveSection("dashboard");
      alert("Announcement added successfully!");
    } else {
      const error = await res.json();
      alert(`Failed to add announcement: ${error.error}`);
    }
  } catch (err) {
    console.error("Error creating announcement:", err);
    alert("Failed to add announcement");
  }
}

  // Start editing an announcement
  const startEditing = (announcement: any) => {
    setEditId(announcement.id);
    setEditTitle(announcement.title);
    setEditContent(announcement.content);
    setEditCategory(announcement.category);
    setEditImage(announcement.image);
    setActiveSection("edit");
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("General");
    setEditImage("");
  };

  // Update announcement
  async function updateAnnouncement(e: React.FormEvent) {
  e.preventDefault();
  if (!editTitle.trim() || !editContent.trim()) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    // Get the current user email from localStorage
    const userEmail = localStorage.getItem("userEmail");

    const res = await fetch(`/api/announcements/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${userEmail}` // Send user email as simple token
      },
      body: JSON.stringify({
        title: editTitle,
        content: editContent,
        category: editCategory,
        image: editImage || "/images/default-announcement.jpg"
      }),
    });

    if (res.ok) {
      cancelEditing();
      getAnnouncements();
      setActiveSection("dashboard");
      alert("Announcement updated successfully!");
    } else {
      const error = await res.json();
      alert(`Failed to update announcement: ${error.error}`);
    }
  } catch (err) {
    console.error("Error updating announcement:", err);
    alert("Failed to update announcement");
  }
}

  async function deleteAnnouncement(id: number) {
  if (!confirm("Are you sure you want to delete this announcement?")) {
    return;
  }

  try {
    // Get the current user email from localStorage
    const userEmail = localStorage.getItem("userEmail");

    const res = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${userEmail}` // Send user email as simple token
      },
    });

    if (res.ok) {
      getAnnouncements();
      alert("Announcement deleted successfully!");
    } else {
      alert("Failed to delete announcement");
    }
  } catch (err) {
    console.error("Error deleting announcement:", err);
    alert("Failed to delete announcement");
  }
}

  const renderSection = () => {
    switch (activeSection) {
      case "add":
        return (
          <div className="p-8">
            <div className="glass-effect rounded-2xl p-8">
              <h1 className="heading-lg mb-6 text-center">Create New Announcement</h1>
              <form onSubmit={addAnnouncement} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold mb-3">Title *</label>
                  <input
                    placeholder="Enter announcement title..."
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={addTitle}
                    onChange={(e) => setAddTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Content *</label>
                  <textarea
                    placeholder="Write your announcement content here..."
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent h-40 resize-none"
                    value={addContent}
                    onChange={(e) => setAddContent(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Category</label>
                  <select
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={addCategory}
                    onChange={(e) => setAddCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Housing">Housing</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Events">Events</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Image URL (optional)</label>
                  <input
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={addImage}
                    onChange={(e) => setAddImage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                >
                  Publish Announcement
                </button>
              </form>
            </div>
          </div>
        );

      case "edit":
        return (
          <div className="p-8">
            <div className="glass-effect rounded-2xl p-8">
              <h1 className="heading-lg mb-6 text-center">Edit Announcement</h1>
              <form onSubmit={updateAnnouncement} className="space-y-6 max-w-2xl mx-auto">
                <div>
                  <label className="block text-sm font-semibold mb-3">Title *</label>
                  <input
                    placeholder="Enter announcement title..."
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Content *</label>
                  <textarea
                    placeholder="Write your announcement content here..."
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent h-40 resize-none"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Category</label>
                  <select
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                  >
                    <option value="General">General</option>
                    <option value="Housing">Housing</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Events">Events</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3">Image URL (optional)</label>
                  <input
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-4 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={editImage}
                    onChange={(e) => setEditImage(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Update Announcement
                  </button>
                  
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        );

      case "view":
        return (
          <div className="p-8">
            <div className="glass-effect rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="heading-lg">All Announcements</h1>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search announcements..."
                    className="pl-10 pr-4 py-2 rounded-xl border border-glass-border focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-6">
                {filteredAnnouncements.length === 0 ? (
                  <div className="text-center py-12">
                    <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">
                      {searchTerm ? "No announcements found matching your search." : "No announcements available."}
                    </p>
                  </div>
                ) : (
                  filteredAnnouncements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="heading-sm mb-2">{announcement.title}</h3>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                              {announcement.category}
                            </span>
                            <span className="text-muted-foreground text-sm">
                              {announcement.date}
                            </span>
                          </div>
                          <p className="text-foreground mb-4">{announcement.content}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => startEditing(announcement)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
                            title="Edit announcement"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => deleteAnnouncement(announcement.id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
                            title="Delete announcement"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      case "delete":
        return (
          <div className="p-8">
            <div className="glass-effect rounded-2xl p-8">
              <h1 className="heading-lg mb-6 text-center text-red-600">Manage Announcements</h1>
              <div className="space-y-6">
                {announcements.length === 0 ? (
                  <div className="text-center py-12">
                    <TrashIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground text-lg">No announcements to delete.</p>
                  </div>
                ) : (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="border-2 border-red-300 rounded-xl p-6 bg-red-50/10"
                    >
                      <h3 className="heading-sm mb-2">{announcement.title}</h3>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="bg-red-500/20 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {announcement.category}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {announcement.date}
                        </span>
                      </div>
                      <p className="text-foreground mb-4 line-clamp-2">{announcement.content}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(announcement)}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
                        >
                          Delete Announcement
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8">
            <div className="glass-effect rounded-2xl p-8 mb-8">
              <h1 className="heading-lg mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground mb-8">Manage announcements and content for Santa Maria Municipality</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                  <ChartBarIcon className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <h3 className="heading-sm mb-2">Total Announcements</h3>
                  <p className="text-3xl font-bold text-primary">{stats.totalAnnouncements}</p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                  <DocumentTextIcon className="w-12 h-12 mx-auto mb-3 text-secondary" />
                  <h3 className="heading-sm mb-2">This Week</h3>
                  <p className="text-3xl font-bold text-secondary">{stats.recentAnnouncements}</p>
                </div>
                
                <div className="glass-effect rounded-xl p-6 text-center hover:scale-105 transition-all duration-300">
                  <PlusIcon className="w-12 h-12 mx-auto mb-3 text-accent" />
                  <h3 className="heading-sm mb-2">Quick Actions</h3>
                  <button
                    onClick={() => setActiveSection("add")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:scale-105"
                  >
                    Create New
                  </button>
                </div>
              </div>

              {Object.keys(stats.categories).length > 0 && (
                <div className="glass-effect rounded-xl p-6">
                  <h3 className="heading-sm mb-4">Announcements by Category</h3>
                  <div className="space-y-3">
                    {Object.entries(stats.categories).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="font-semibold">{category}</span>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {announcements.length > 0 && (
              <div className="glass-effect rounded-2xl p-8">
                <h2 className="heading-md mb-6">Recent Announcements</h2>
                <div className="space-y-4">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div
                      key={announcement.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-glass-border hover:bg-glass-bg transition-all duration-300"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{announcement.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{announcement.category}</span>
                          <span>•</span>
                          <span>{announcement.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(announcement)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Edit announcement"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110"
                          title="Delete announcement"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {announcements.length > 3 && (
                  <button
                    onClick={() => setActiveSection("view")}
                    className="w-full mt-6 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    View All Announcements
                  </button>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="glass-effect border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="heading-lg">Santa Maria Municipal Government</h1>
              <p className="text-muted-foreground">Admin Dashboard</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("role");
                router.push("/login");
              }}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:scale-105"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-screen glass-effect border-r border-glass-border">
          <div className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveSection("dashboard")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                  activeSection === "dashboard" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-glass-bg"
                }`}
              >
                <ChartBarIcon className="w-5 h-5" />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveSection("add")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                  activeSection === "add" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-glass-bg"
                }`}
              >
                <PlusIcon className="w-5 h-5" />
                Add News
              </button>

              <button
                onClick={() => setActiveSection("edit")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                  activeSection === "edit" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-glass-bg"
                }`}
              >
                <PencilIcon className="w-5 h-5" />
                Edit News
              </button>
              
              <button
                onClick={() => setActiveSection("view")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                  activeSection === "view" 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-glass-bg"
                }`}
              >
                <DocumentTextIcon className="w-5 h-5" />
                View All News
              </button>
              
              <button
                onClick={() => setActiveSection("delete")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all duration-300 hover:scale-105 ${
                  activeSection === "delete" 
                    ? "bg-red-500 text-white" 
                    : "hover:bg-red-500/10 text-red-600"
                }`}
              >
                <TrashIcon className="w-5 h-5" />
                Delete News
              </button>
            </div>
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}