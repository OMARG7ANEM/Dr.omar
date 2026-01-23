const tools = [
  {
    name: "SPSS",
    description: "Advanced statistical analysis for social sciences and healthcare research",
    icon: "📊",
  },
  {
    name: "R Studio",
    description: "Comprehensive data analysis, visualization, and statistical modeling",
    icon: "📈",
  },
  {
    name: "SmartPLS",
    description: "Structural equation modeling and path analysis",
    icon: "🔬",
  },
  {
    name: "RevMan",
    description: "Systematic reviews and meta-analysis for Cochrane standards",
    icon: "📚",
  },
];

const services = [
  "Statistical Consultation",
  "Data Analysis & Interpretation",
  "Manuscript Statistical Review",
  "PhD Research Support",
  "Meta-Analysis",
  "Sample Size Calculation",
];

const SkillsSection = () => {
  return (
    <section id="skills" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider text-accent uppercase bg-accent/10 rounded-full">
              Expertise
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Tools & <span className="text-gradient">Skills</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
              Expert proficiency in industry-leading statistical software and methodologies
            </p>
          </div>

          {/* Tools grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {tools.map((tool, index) => (
              <div
                key={tool.name}
                className="group relative p-8 bg-card rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-2 border border-border/50 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors" />
                <div className="relative">
                  <span className="text-4xl mb-4 block">{tool.icon}</span>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Services tags */}
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold text-foreground mb-8">
              Services Offered
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {services.map((service) => (
                <span
                  key={service}
                  className="px-5 py-2.5 bg-card rounded-full text-sm font-medium text-foreground border border-border/50 shadow-soft hover:shadow-elevated hover:border-accent/30 transition-all duration-300 cursor-default"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
