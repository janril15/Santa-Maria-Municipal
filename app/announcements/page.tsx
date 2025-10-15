import SearchBar from "@/components/SearchBar";
import AllAnnouncementsGrid from "@/components/AllAnnouncementsGrid";
import Footer from "@/components/Footer";

export default function AnnouncementsPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section for Announcements Page - Theme Responsive */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background with theme support */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5" />
        
        {/* Glass container */}
        <div className="relative max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-2xl border border-glass-border">
            <div className="text-center">
              {/* Icon/Badge */}
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">📢</span>
              </div>
              
              {/* Title */}
              <h1 className="heading-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Public Announcements
              </h1>
              
              {/* Description */}
              <p className="body-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Stay up to date with the latest news, updates, and important announcements 
                from Santa Maria Municipal Government.
              </p>
              
              {/* Stats/Info */}
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  📅 Latest Updates
                </div>
                <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold">
                  🏛️ Official News
                </div>
                <div className="bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                  👥 Community Focused
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <SearchBar />

      {/* All Announcements Grid with Pagination */}
      <AllAnnouncementsGrid />

      {/* Footer */}
      <Footer />
    </main>
  );
}