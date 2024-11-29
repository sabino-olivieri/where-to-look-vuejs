import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function AnimateOnScroll() {
    const cards = document.querySelectorAll(".animate");
    console.log(cards);
    
    cards.forEach((card) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "bottom 20%",
                toggleActions: "play none none",
            },
            x: "100%",
            opacity: 0,
            duration: 1,
            ease: "power2.out",
        });
    });
}