import { useQuery } from "@tanstack/react-query";
import { databases, DB_ID, COLLECTION_PROJECTS } from "@/integrations/appwrite/client";
import { Query } from "appwrite";
import { Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Project {
  $id: string; // Appwrite uses $id
  title: string;
  description: string;
  image_url: string | null;
  link: string | null;
  file_url: string | null;
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
        file_url: doc.file_url
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group bg-card rounded-2xl border border-border/50 overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                  <div className="aspect-video w-full bg-muted relative overflow-hidden">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/20 text-4xl font-bold">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-display text-xl font-bold text-foreground mb-3">
                      {project.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 line-clamp-3">
                      {project.description}
                    </p>
                    <div className="mt-auto">
                      {project.link && (
                        <Button variant="outline" className="w-full gap-2 mb-2" asChild>
                          <a href={project.link} target="_blank" rel="noopener noreferrer">
                            View Project Links <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      {project.file_url && (
                        <Button variant="default" className="w-full gap-2" asChild>
                          <a href={project.file_url} target="_blank" rel="noopener noreferrer" download>
                            Download Project Files <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
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
