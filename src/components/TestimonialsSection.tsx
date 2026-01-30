import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        author: "lody_sayed",
        role: "Repeat Client",
        country: "Egypt",
        flag: "🇪🇬",
        text: "Omar Ghanem truly impressed with his exceptional data analytics skills, consistently exceeding expectations while showcasing remarkable professionalism and attention to detail. Working with Omar was a breeze as he ensured proactive communication, went above and beyond in EVERY task, and responded swiftly. Highly recommend! 👍",
        rating: 5,
    },
    {
        author: "altheatanedo",
        role: "Client",
        country: "Philippines",
        flag: "🇵🇭",
        text: "Easy to communicate with, very accommodating, and delivered the work on time. Met the deadline without any issues and was a pleasure to work with. Highly recommended for statistical analysis projects.",
        rating: 5,
    },
    {
        author: "snadeem95",
        role: "Client",
        country: "United States",
        flag: "🇺🇸",
        text: "Omar was great to work with. Has a great understanding, highly recommend!",
        rating: 5,
    },
];

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/3 translate-x-1/3" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 mb-4 text-sm font-medium tracking-wider text-accent uppercase bg-accent/10 rounded-full">
                        Testimonials
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                        Client <span className="text-gradient">Feedback</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                        Trusted by clients worldwide for delivering exceptional statistical analysis and research support.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-card/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-soft hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                        >
                            <div className="flex items-center gap-1 mb-6 text-accent">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-current" />
                                ))}
                            </div>

                            <div className="flex-grow mb-6 relative">
                                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-accent/10 rotate-180" />
                                <p className="text-muted-foreground relative z-10 pl-4 italic">
                                    "{testimonial.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-6">
                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
                                    {testimonial.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h4 className="font-bold text-foreground flex items-center gap-2">
                                        {testimonial.author}
                                        {testimonial.flag && <span title={testimonial.country} className="text-sm">{testimonial.flag}</span>}
                                    </h4>
                                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
