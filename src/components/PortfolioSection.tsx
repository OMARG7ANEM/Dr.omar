import { useQuery } from "@tanstack/react-query";
import { databases, DB_ID, COLLECTION_PROJECTS } from "@/integrations/appwrite/client";
import { Query } from "appwrite";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectDetailsDialog from "@/components/ProjectDetailsDialog";

interface Project {
  $id: string; // Appwrite uses $id
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  file_url: string | null;
  image_position: string | null;
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
        image_position: doc.image_position
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
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : projects && projects.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-12 max-w-7xl mx-auto">
              {projects.map((project) => (
                <ProjectDetailsDialog key={project.id} project={project}>
                  <div
                    className="group bg-card dark:bg-white/5 rounded-2xl border border-border dark:border-white/10 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 hover:border-accent/50 dark:hover:border-accent/50 flex flex-col h-full cursor-pointer relative w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)]"
                    style={{ WebkitMaskImage: "-webkit-radial-gradient(white, black)" }}
                  >
                    <div className="aspect-video w-full bg-muted relative overflow-hidden rounded-t-2xl isolate">
                      {project.image_url ? (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
                          style={{ objectPosition: project.image_position || 'center' }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/20 text-4xl font-bold">
                          {project.title.charAt(0)}
                        </div>
                      )}
                      {/* Overlay hint */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white font-medium px-4 py-2 border border-white/30 rounded-full backdrop-blur-sm">View Details</span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="font-display text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 line-clamp-4 leading-relaxed break-all">
                        {project.description}
                      </p>
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
