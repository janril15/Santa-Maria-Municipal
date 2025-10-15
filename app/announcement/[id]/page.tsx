import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import Footer from "@/components/Footer";

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const announcement = await prisma.post.findUnique({
    where: { id: parseInt(params.id) }
  });

  if (!announcement) {
    return {
      title: "Announcement Not Found",
    };
  }

  return {
    title: `${announcement.title} | Santa Maria Municipal`,
    description: announcement.excerpt || announcement.content.substring(0, 160),
  };
}

export default async function AnnouncementPage({ params }: PageProps) {
  const announcement = await prisma.post.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      }
    }
  });

  if (!announcement) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/5" />
        
        <div className="relative max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 md:p-12 shadow-2xl border border-glass-border">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary-foreground">📢</span>
              </div>
              
              <span className="bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                {announcement.category}
              </span>
              
              <h1 className="heading-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {announcement.title}
              </h1>
              
              <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
                <span>📅 {announcement.date}</span>
                <span>•</span>
                <span>⏱️ {announcement.readTime}</span>
                {announcement.author && (
                  <>
                    <span>•</span>
                    <span>👤 {announcement.author.name}</span>
                  </>
                )}
              </div>
            </div>

            {/* Announcement Content */}
            <div className="prose prose-lg max-w-none">
              {announcement.image && announcement.image !== "/images/default-announcement.jpg" && (
                <img 
                  src={announcement.image} 
                  alt={announcement.title}
                  className="w-full h-64 object-cover rounded-xl mb-8"
                />
              )}
              
              <div className="text-foreground leading-relaxed whitespace-pre-line">
                {announcement.content}
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 text-center">
              <a 
                href="/announcements"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105"
              >
                ← Back to All Announcements
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}