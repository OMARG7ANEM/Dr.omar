import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { databases, storage, DB_ID, COLLECTION_CONTACTS, COLLECTION_PROJECTS, BUCKET_IMAGES, client } from "@/integrations/appwrite/client";
import { ID, Query } from "appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Mail,
  User,
  LogOut,
  ArrowLeft,
  Inbox,
  CheckCircle,
  Circle,
  Trash2,
  Loader2,
  LayoutGrid,
  Plus,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContactSubmission {
  $id: string; // Appwrite uses $id
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  $createdAt: string; // Appwrite uses $createdAt
}

interface Project {
  $id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  file_url: string;
  image_position: string | null;
  $createdAt: string;
}

const Admin = () => {
  const { user, loading, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  // State for Messages
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);

  // State for Projects
  const [projects, setProjects] = useState<Project[]>([]);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Loading states
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Form State
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    image_url: "",
    link: "",
    image_position: "50% 50%",
    file_url: "",
  });

  // File Inputs state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchSubmissions();
      fetchProjects();
    }
  }, [user, isAdmin]);

  const fetchSubmissions = async () => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_CONTACTS,
        [Query.orderDesc('$createdAt')]
      );
      // Map Appwrite response to our interface (mostly same, just ensuring typing)
      setSubmissions(response.documents as unknown as ContactSubmission[]);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await databases.listDocuments(
        DB_ID,
        COLLECTION_PROJECTS,
        [Query.orderDesc('$createdAt')]
      );
      setProjects(response.documents as unknown as Project[]);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await databases.updateDocument(DB_ID, COLLECTION_CONTACTS, id, { is_read: true });

      setSubmissions((prev) => prev.map((s) => (s.$id === id ? { ...s, is_read: true } : s)));
      if (selectedSubmission?.$id === id) setSelectedSubmission({ ...selectedSubmission, is_read: true });
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_CONTACTS, id);
      setSubmissions((prev) => prev.filter((s) => s.$id !== id));
      if (selectedSubmission?.$id === id) setSelectedSubmission(null);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete message");
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const uploadFileToAppwrite = async (file: File): Promise<string> => {
    try {
      const response = await storage.createFile(BUCKET_IMAGES, ID.unique(), file);
      // Get the View URL
      // Since Appwrite storage URLs are permissions based, we need to ensure the bucket is "Public" or "Any" has read access.
      // We can generate a view URL directly.
      const result = storage.getFileView(BUCKET_IMAGES, response.$id);
      return result;
    } catch (error: any) {
      throw new Error("Upload failed: " + error.message);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    console.log("Starting upload process...");

    try {
      let imageUrl = projectForm.image_url;
      let fileUrl = projectForm.file_url;

      if (imageFile) {
        console.log("Uploading image...");
        imageUrl = await uploadFileToAppwrite(imageFile);
        console.log("Image uploaded:", imageUrl);
      }

      if (docFile) {
        console.log("Uploading document...");
        fileUrl = await uploadFileToAppwrite(docFile);
        console.log("Document uploaded:", fileUrl);
      }

      const projectData = {
        title: projectForm.title,
        description: projectForm.description,
        link: projectForm.link || null,
        image_url: imageUrl || null,
        file_url: fileUrl || null,
        image_position: projectForm.image_position || "50% 50%",
      };

      console.log("Saving project data:", projectData);

      if (editingProject) {
        await databases.updateDocument(DB_ID, COLLECTION_PROJECTS, editingProject.$id, projectData);
        toast.success("Project updated successfully");
      } else {
        await databases.createDocument(DB_ID, COLLECTION_PROJECTS, ID.unique(), projectData);
        toast.success("Project created successfully");
      }

      setIsProjectDialogOpen(false);
      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error("Error saving project:", error);
      toast.error(`Failed to save project: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await databases.deleteDocument(DB_ID, COLLECTION_PROJECTS, id);
      setProjects((prev) => prev.filter((p) => p.$id !== id));
      toast.success("Project deleted");
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    }
  };

  const resetForm = () => {
    setEditingProject(null);
    setProjectForm({ title: "", description: "", image_url: "", image_position: "50% 50%", link: "", file_url: "" });
    setImageFile(null);
    setDocFile(null);
  };

  const openProjectDialog = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setProjectForm({
        title: project.title,
        description: project.description,
        image_url: project.image_url || "",
        link: project.link || "",
        image_position: project.image_position || "50% 50%",
        file_url: project.file_url || "",
      });
    } else {
      resetForm();
    }
    setIsProjectDialogOpen(true);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-hero-gradient flex items-center justify-center p-6">
        <div className="bg-card p-8 rounded-2xl shadow-elevated border border-border/50 text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/20 flex items-center justify-center">
            <User className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-6">You don't have admin privileges.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>Go Home</Button>
            <Button variant="hero" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = submissions.filter((s) => !s.is_read).length;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === submissions.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(submissions.map(s => s.$id)));
    }
  };

  const toggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedIds.size} messages?`)) return;

    try {
      const promises = Array.from(selectedIds).map(id => databases.deleteDocument(DB_ID, COLLECTION_CONTACTS, id));
      await Promise.all(promises);

      setSubmissions(prev => prev.filter(s => !selectedIds.has(s.$id)));
      setSelectedIds(new Set());
      setSelectedSubmission(null);
      toast.success("Messages deleted");
    } catch (error) {
      console.error("Error deleting messages:", error);
      toast.error("Failed to delete messages");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary dark:bg-card border-b border-border/10 dark:border-white/10 sticky top-0 z-50 transition-colors">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground dark:text-foreground/80 dark:hover:text-foreground transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
            <h1 className="font-display text-xl font-bold text-primary-foreground dark:text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-primary-foreground/70 dark:text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="heroOutline" size="sm" onClick={handleSignOut} className="dark:border-white/20 dark:text-foreground dark:hover:bg-white/10 dark:hover:text-white">
              <LogOut className="w-4 h-4" />
              <span className="ml-2 hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="messages" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="messages" className="gap-2">Messages {unreadCount > 0 && <span className="bg-accent text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}</TabsTrigger>
            <TabsTrigger value="projects" className="gap-2"><LayoutGrid className="w-4 h-4" /> Manage Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="messages" className="space-y-6">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Contact Submissions</h2>
                <p className="text-muted-foreground">{unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}` : "All messages have been read"}</p>
              </div>

              {submissions.length > 0 && (
                <div className="flex items-center gap-2">
                  {selectedIds.size > 0 && (
                    <Button variant="destructive" size="sm" onClick={deleteSelected} className="gap-2 animate-in fade-in slide-in-from-right-4">
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedIds.size})
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                    {selectedIds.size === submissions.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
              )}
            </div>

            {isLoadingMessages ? (
              <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50">
                <Inbox className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No Messages Yet</h3>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-3">
                  {submissions.map((submission) => (
                    <button key={submission.$id} onClick={() => { setSelectedSubmission(submission); if (!submission.is_read) markAsRead(submission.$id); }} className={`w-full text-left p-4 rounded-xl border transition-all relative ${selectedSubmission?.$id === submission.$id ? "bg-accent/10 border-accent/30" : "bg-card border-border/50 hover:border-accent/20"}`}>
                      <div className="absolute top-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.has(submission.$id)}
                          onChange={(e) => { e.stopPropagation(); toggleSelect(submission.$id, e as any); }}
                          className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent"
                        />
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1">{submission.is_read ? <CheckCircle className="w-4 h-4 text-muted-foreground" /> : <Circle className="w-4 h-4 text-accent fill-accent" />}</div>
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex justify-between gap-2 mb-1"><span className={`font-medium truncate ${!submission.is_read ? "text-foreground" : "text-muted-foreground"}`}>{submission.name}</span></div>
                          <p className="text-sm text-muted-foreground truncate">{submission.message}</p>
                          <p className="text-xs text-muted-foreground/70 mt-1">{format(new Date(submission.$createdAt), "MMM d, yyyy")}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="lg:col-span-2">
                  {selectedSubmission ? (
                    <div className="bg-card rounded-2xl border border-border/50 p-6">
                      <div className="flex justify-between mb-6">
                        <div>
                          <h3 className="font-display text-2xl font-bold text-foreground mb-1">{selectedSubmission.name}</h3>
                          <div className="flex gap-4 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="w-4 h-4" />{selectedSubmission.email}</span></div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => deleteSubmission(selectedSubmission.$id)} className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                      <div className="prose prose-sm max-w-none"><p className="text-foreground whitespace-pre-wrap leading-relaxed">{selectedSubmission.message}</p></div>
                      <div className="mt-6 pt-6 border-t border-border/50"><Button variant="hero" asChild><a href={`mailto:${selectedSubmission.email}`}><Mail className="w-4 h-4" /> Reply via Email</a></Button></div>
                    </div>
                  ) : (
                    <div className="bg-card rounded-2xl border border-border/50 p-12 text-center"><Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" /><p className="text-muted-foreground">Select a message to view details</p></div>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="projects">
            <div className="flex justify-between mb-6">
              <div><h2 className="font-display text-2xl font-bold text-foreground">Projects Portfolio</h2><p className="text-muted-foreground">Manage your featured projects. Hosted on Appwrite.</p></div>
              <Button onClick={() => openProjectDialog()} className="gap-2"><Plus className="w-4 h-4" /> Add Project</Button>
            </div>
            {isLoadingProjects ? <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div> : projects.length === 0 ? (
              <div className="text-center py-16 bg-card rounded-2xl border border-border/50"><LayoutGrid className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" /><h3 className="font-display text-xl font-bold text-foreground mb-2">No Projects Yet</h3><Button onClick={() => openProjectDialog()}>Add Project</Button></div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.$id} className="bg-card rounded-xl border border-border/50 overflow-hidden group flex flex-col h-full">
                    <div className="aspect-video w-full bg-muted relative">
                      {project.image_url ? <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground/20">{project.title.charAt(0)}</div>}
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg mb-2">{project.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>
                      <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => openProjectDialog(project)}><Pencil className="w-3 h-3" /> Edit</Button>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => deleteProject(project.$id)}><Trash2 className="w-3 h-3" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle></DialogHeader>
            <form onSubmit={handleProjectSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input required value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} placeholder="Project Title" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea required value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Brief description..." rows={4} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Link (External URL)</label>
                <Input value={projectForm.link} onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })} placeholder="https://..." />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Project Image</label>
                <div className="flex gap-2 items-center">
                  <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="cursor-pointer" />
                </div>
                {projectForm.image_url && !imageFile && (
                  <div className="flex items-center gap-2 mt-2">
                    <img src={projectForm.image_url} alt="Preview" className="w-10 h-10 object-cover rounded" />
                    <p className="text-xs text-muted-foreground break-all">{projectForm.image_url}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="space-y-4">
                  <label className="text-sm font-medium">Image Focus Position (Review in Preview below)</label>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Horizontal (X): {projectForm.image_position?.split(' ')[0] || '50%'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                      value={parseInt(projectForm.image_position?.split(' ')[0] || '50')}
                      onChange={(e) => {
                        const x = e.target.value;
                        const y = projectForm.image_position?.split(' ')[1] || '50%';
                        setProjectForm({ ...projectForm, image_position: `${x}% ${y}` });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Vertical (Y): {projectForm.image_position?.split(' ')[1] || '50%'}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-accent"
                      value={parseInt(projectForm.image_position?.split(' ')[1] || '50')}
                      onChange={(e) => {
                        const y = e.target.value;
                        const x = projectForm.image_position?.split(' ')[0] || '50%';
                        setProjectForm({ ...projectForm, image_position: `${x} ${y}%` });
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              {projectForm.image_url && (
                <div className="space-y-2 border rounded-lg p-4 bg-muted/20">
                  <label className="text-sm font-medium">Live Preview (Card View)</label>
                  <div className="aspect-video w-full bg-muted relative overflow-hidden rounded-t-2xl isolate border border-border">
                    <img
                      src={projectForm.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-500"
                      style={{ objectPosition: projectForm.image_position }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Project File (PDF/Doc)</label>
                <div className="flex gap-2 items-center">
                  <Input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="cursor-pointer" />
                </div>
                {projectForm.file_url && !docFile && (
                  <p className="text-xs text-muted-foreground mt-2">Current File Linked</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsProjectDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isUploading}>
                  {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...</> : editingProject ? "Update Project" : "Add Project"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
