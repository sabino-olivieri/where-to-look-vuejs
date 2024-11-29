import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function AnimateOnScroll(options = {}) {
    const elements = document.querySelectorAll(".animate");

    elements.forEach((element) => {
        // Gestisci iframe: attendi il caricamento prima di animare
        if (element.tagName === "IFRAME") {
            element.addEventListener("load", () => {
                animateElement(element, options);
            });
        } else {
            animateElement(element, options);
        }
    });

    function animateElement(element, options) {
        // Parametri di default per GSAP
        const defaultOptions = {
            scrollTrigger: {
                trigger: element,
                start: "top 95%",
                end: "bottom 20%",
                toggleActions: "play none none none", // Cambia a "play reverse play reverse" se serve
            },
            x: 200,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        };

        // Unione tra opzioni fornite e quelle di default
        const animationOptions = { ...defaultOptions, ...options };

        // Applica l'animazione
        gsap.from(element, animationOptions);
    }
}
