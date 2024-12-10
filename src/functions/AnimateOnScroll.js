import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function AnimateOnScroll() {
    const elements = document.querySelectorAll(".animate");

    elements.forEach((element) => {
            
            animateElement(element);
        
    });

    function animateElement(element) {

        const defaultOptions = {
            scrollTrigger: {
                trigger: element,
                start: "top 90%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
            },
            x: 200,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
        };


        gsap.from(element, defaultOptions);
    }
}
