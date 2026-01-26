import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectDetailsDialogProps {
    project: {
        id: string; // or $id depending on usage, keeping it generic since we map it in PortfolioSection
        title: string;
        description: string;
        image_url: string | null;
        link: string | null;
        file_url: string | null;
        image_position: string | null;
    };
    children: React.ReactNode;
}

const ProjectDetailsDialog = ({ project, children }: ProjectDetailsDialogProps) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-card/95 dark:bg-slate-950/95 backdrop-blur-xl border-border dark:border-white/10 flex flex-col [&>button]:hidden">
                <div className="relative h-full flex flex-col">
                    {/* Close button is built-in to DialogContent usually, but we can style it ourselves if needed or rely on default */}
                    <DialogClose className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors border border-white/20">
                        <X className="w-5 h-5" />
                    </DialogClose>

                    {/* Image Banner */}
                    <div className="w-full h-[40%] min-h-[250px] bg-muted relative overflow-hidden shrink-0">
                        {project.image_url ? (
                            <img
                                src={project.image_url}
                                alt={project.title}
                                className="w-full h-full object-cover"
                                style={{ objectPosition: project.image_position || 'center' }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-accent/5 text-accent/20 text-6xl font-bold">
                                {project.title.charAt(0)}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                        <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                            <DialogTitle className="font-display text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
                                {project.title}
                            </DialogTitle>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 flex flex-col min-h-0 bg-background/50">
                        <ScrollArea className="flex-1 w-full">
                            <div className="p-6 md:p-8 space-y-6">
                                <div className="prose dark:prose-invert max-w-none w-full">
                                    <h3 className="text-xl font-bold mb-4 text-accent">About the Project</h3>
                                    <div className="w-full max-h-[300px] overflow-y-auto border rounded-lg p-4 bg-muted/30 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-muted-foreground/20">
                                        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap break-all">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>

                        {/* Fixed Footer Actions */}
                        <div className="p-6 md:p-8 border-t border-border/50 bg-background/80 backdrop-blur-sm mt-auto">
                            <div className="flex flex-col sm:flex-row gap-4">
                                {project.link && (
                                    <Button size="lg" className="flex-1 gap-2" asChild>
                                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-5 h-5" />
                                            View Live Project
                                        </a>
                                    </Button>
                                )}
                                {project.file_url && (
                                    <Button size="lg" variant="outline" className="flex-1 gap-2 border-accent/20 hover:bg-accent/10 hover:text-accent" asChild>
                                        <a href={project.file_url} target="_blank" rel="noopener noreferrer" download>
                                            <Download className="w-5 h-5" />
                                            Download Files
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetailsDialog;
