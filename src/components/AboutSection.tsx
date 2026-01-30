import { Award, BookOpen, Users, TrendingUp } from "lucide-react";
import { CountUpStat } from "@/components/CountUpStat";

const stats = [
  { icon: Award, label: "Years Experience", value: "5+", numeric: 5, suffix: "+" },
  { icon: BookOpen, label: "Q1 Publications", value: "Multiple", numeric: null },
  { icon: Users, label: "Researchers Helped", value: "100+", numeric: 100, suffix: "+" },
  { icon: TrendingUp, label: "Success Rate", value: "98%", numeric: 98, suffix: "%" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider text-accent uppercase bg-accent/10 rounded-full">
              About Me
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Passionate About <span className="text-gradient">Statistics</span> & Research
            </h2>
          </div>

          {/* Bio content */}
          <div className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gold-gradient rounded-full hidden md:block" />
            <div className="md:pl-12">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                Hi, I'm <span className="text-foreground font-medium">Dr. Omar Ghanem</span>.
                With 5 years of experience as a professional statistician and data analyst,
                I have a deep passion for statistics and medical research.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                After successfully publishing my own papers in prestigious <span className="text-accent font-medium">Q1 journals like Springer Nature</span>,
                I started helping other researchers and PhD students achieve the same goal.
              </p>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                I don't just provide numbers; I deliver analysis that stands up to peer review,
                blending strict rigor with clear, actionable insights.
                <span className="text-foreground font-medium"> Let's connect and drive your project forward!</span>
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group p-6 bg-card/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 mb-4 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-display font-bold text-foreground mb-1">
                  {stat.numeric !== null ? (
                    <CountUpStat end={stat.numeric} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
