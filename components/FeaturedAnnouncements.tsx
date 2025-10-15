"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "@/lib/motion";

export default function FeaturedAnnouncements() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await fetch("/api/announcements");
        if (res.ok) {
          const data = await res.json();
          // Get latest 3 announcements
          setAnnouncements(data.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading announcements...</div>;
  }

  if (announcements.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="heading-lg text-center mb-12">Latest Announcements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {announcements.map((announcement) => (
            <Link key={announcement.id} href={`/announcement/${announcement.id}`}>
              <motion.article
                className="glass-effect rounded-2xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <h3 className="heading-sm mb-3">{announcement.title}</h3>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {announcement.excerpt || announcement.content.substring(0, 150) + "..."}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded">
                    {announcement.category}
                  </span>
                  <span>{announcement.date}</span>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
        
        {announcements.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/announcements"
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold py-3 px-8 rounded-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              View All Announcements →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}