import { useQuery } from "@tanstack/react-query";
import { databases, DB_ID, COLLECTION_PROJECTS } from "@/integrations/appwrite/client";
import { Query } from "appwrite";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectDetailsDialog from "@/components/ProjectDetailsDialog";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface Project {
  $id: string; // Appwrite uses $id
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  file_url: string | null;
  image_position: string | null;
  price_range?: string;
  duration?: string;
  industry?: string;
}

const PortfolioSection = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_PROJECTS,
        [Query.orderDesc('$createdAt')]
      );
      // Map Appwrite documents to our Project interface
      const data = response.documents.map(doc => ({
        id: doc.$id, // Map $id to id for compatibility with existing UI if needed, but UI uses .id logic usually. 
        // Wait, existing UI uses project.id. Let's map it.
        ...doc
      }));
      return data as unknown as Project[]; // The UI expects `id` but we can just use $id in the UI mapping or map it here.
      // Let's actually adjust the UI below to look for $id or map it cleanly.
      // Easiest is to map it:
      return response.documents.map(doc => ({
        id: doc.$id,
        title: doc.title,
        description: doc.description,
        image_url: doc.image_url,
        link: doc.link,
        file_url: doc.file_url,
        image_position: doc.image_position,
        price_range: doc.price_range,
        duration: doc.duration,
        industry: doc.industry
      })) as any[];
    },
  });

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider text-accent uppercase bg-accent/10 rounded-full">
              Portfolio
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Featured <span className="text-gradient">Projects</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              A collection of statistical analysis and research projects
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card dark:bg-white/5 rounded-2xl border border-border dark:border-white/10 overflow-hidden shadow-soft flex flex-col h-full w-full">
                  <Skeleton className="aspect-video w-full rounded-t-2xl" />
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                    <div className="mt-auto pt-4 flex gap-2">
                      <Skeleton className="h-9 flex-1" />
                      <Skeleton className="h-9 flex-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {projects.map((project) => (
                <ProjectDetailsDialog key={project.id} project={project}>
                  <div
                    className="group bg-card/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 hover:border-accent/50 flex flex-col h-full cursor-pointer relative w-full"
                  >
                    <div className="aspect-video w-full bg-muted relative overflow-hidden rounded-t-2xl isolate">
                      {project.image_url ? (
                        <img
                          src={project.image_url.split(',')[0].trim()}
                          alt={project.title}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:blur-[2px] will-change-transform"
                          style={{ objectPosition: project.image_position || 'center' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/20 text-4xl font-bold transition-all duration-500 group-hover:blur-[2px]">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      {/* Overlay hint */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out flex items-center justify-center">
                        <span className="text-white font-medium px-6 py-2.5 border border-white/20 rounded-full bg-black/50 hover:bg-black/70 shadow-xl transform scale-90 group-hover:scale-100 transition-all duration-300">
                          View Details
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <div className="line-clamp-4 overflow-hidden mb-6">
                        <MarkdownRenderer>{project.description}</MarkdownRenderer>
                      </div>
                      {/* Buttons restored */}
                      <div className="mt-auto pt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {project.link && (
                          <Button variant="outline" size="sm" className="flex-1 gap-1" asChild>
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4" /> View
                            </a>
                          </Button>
                        )}
                        {project.file_url && (
                          <Button variant="default" size="sm" className="flex-1 gap-1" asChild>
                            <a href={project.file_url} target="_blank" rel="noopener noreferrer" download>
                              <ExternalLink className="w-4 h-4" /> Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </ProjectDetailsDialog>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
              <p className="text-muted-foreground">No projects added yet.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
