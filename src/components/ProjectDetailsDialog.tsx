import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Download, X, ArrowLeft, ArrowRight, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

interface ProjectDetailsDialogProps {
    project: {
        id: string; // or $id
        title: string;
        description: string;
        image_url: string | null;
        link: string | null;
        file_url: string | null;
        image_position: string | null;
        price_range?: string; // Optional metadata
        duration?: string;   // Optional metadata
        industry?: string;   // Optional metadata
    };
    children: React.ReactNode;
}

const ProjectDetailsDialog = ({ project, children }: ProjectDetailsDialogProps) => {
    // Parse multiple images: Assuming image_url can be comma-separated or just one
    const images = project.image_url ? project.image_url.split(',').map(url => url.trim()) : [];

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-background border border-border/50 shadow-2xl flex flex-col gap-0 sm:rounded-xl">

                {/* Header: Author + Nav + Close */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden border border-accent/20">
                            {/* Placeholder avatar or initial */}
                            <User className="w-5 h-5 text-accent" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-muted-foreground uppercase tracking-wider">Made by</span>
                            <span className="text-sm font-bold text-foreground">Omar Ghanem</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Navigation placeholders (can be hooked up later) */}
                        <div className="hidden sm:flex items-center gap-1 bg-muted/50 rounded-full px-3 py-1 text-xs text-muted-foreground border border-border/50">
                            1 of 1 {/* Dynamic in future */}
                        </div>

                        <div className="flex gap-1 ml-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <DialogClose className="ml-2 p-2 rounded-full hover:bg-muted transition-colors">
                            <X className="w-5 h-5 text-muted-foreground" />
                        </DialogClose>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <ScrollArea className="flex-1 w-full bg-background">
                    <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">

                        {/* Project Header: Date, Title, Links */}
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">From: {new Date().getFullYear()} {/* Or date if available */}</p>
                                    <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground leading-tight">
                                        {project.title}
                                    </h1>
                                </div>

                                {/* Action Buttons (Top Right on desktop) */}
                                <div className="flex gap-2 shrink-0">
                                    {project.link && (
                                        <Button size="sm" className="gap-2" asChild>
                                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-4 h-4" />
                                                Live Site
                                            </a>
                                        </Button>
                                    )}
                                    {project.file_url && (
                                        <Button size="sm" variant="outline" className="gap-2" asChild>
                                            <a href={project.file_url} target="_blank" rel="noopener noreferrer" download>
                                                <Download className="w-4 h-4" />
                                                Files
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose dark:prose-invert max-w-none text-lg text-muted-foreground leading-relaxed">
                            <MarkdownRenderer>{project.description}</MarkdownRenderer>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 p-8 bg-card/30 rounded-xl border border-border/50">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Price Range</h4>
                                <p className="text-lg font-bold text-foreground">{project.price_range || "$50-$100"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Project Duration</h4>
                                <p className="text-lg font-bold text-foreground">{project.duration || "1-3 months"}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">Industry</h4>
                                <p className="text-lg font-bold text-foreground">{project.industry || "Research & Analysis"}</p>
                            </div>
                        </div>

                        {/* Images Section */}
                        {images.length > 0 && (
                            <div className="space-y-8 mt-12">
                                {images.map((imgUrl, index) => (
                                    <div key={index} className="w-full relative">
                                        <img
                                            src={imgUrl}
                                            alt={`${project.title} - Image ${index + 1}`}
                                            className="w-full h-auto rounded-lg shadow-lg border border-border/20"
                                        />
                                        {/* Thin line separator, only if not last image */}
                                        {index < images.length - 1 && (
                                            <div className="mt-8 border-b border-border/20 w-full" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </ScrollArea>

            </DialogContent>
        </Dialog>
    );
};

export default ProjectDetailsDialog;
