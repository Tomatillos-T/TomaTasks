import React, { useEffect, useRef, useState } from "react";

// Types --------------------------------------------------------
export interface FeatureSection {
  id: string;
  title: string;
  description: string;
  media: {
    desktop: {
      type: "video" | "image";
      src: string;
      alt: string;
    };
    mobile: {
      type: "image";
      src: string;
      alt: string;
    };
  };
  colors?: {
    primary: string;
    accent: string;
  };
}

export interface StickyShowcaseProps {
  mainTitle: string;
  features: FeatureSection[];
  breakpoint?: number;
}

// Component ------------------------------------------------------
const StickyFeatureShowcase: React.FC<StickyShowcaseProps> = ({
  mainTitle,
  features,
  breakpoint = 1024,
}) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= breakpoint);
  const [activeIndex, setActiveIndex] = useState(0);

  // Referencias a contenedores (div)
  const observerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const stickyUnitRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [stickyMode, setStickyMode] =
    useState<"sticky" | "fixed" | "bottom">("sticky");

  // Detect active feature via IntersectionObserver ---------------
  useEffect(() => {
    if (!isDesktop || !wrapperRef.current || !observerRef.current) return;

    const observerElement = observerRef.current;
    let ticking = false;

    const updateActiveFeature = () => {
      if (!observerElement) return;

      const observerRect = observerElement.getBoundingClientRect();
      const observerCenterY = observerRect.top + observerRect.height / 2;

      let closestIndex = -1;
      let minDistance = Infinity;

      itemRefs.current.forEach((el, idx) => {
        if (!el) return;

        const rect = el.getBoundingClientRect();
        
        // Solo considerar elementos visibles en el viewport
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const featureCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(featureCenterY - observerCenterY);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = idx;
        }
      });

      if (closestIndex !== -1 && closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    // ----------- throttle via requestAnimationFrame -----------
    const scheduleUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveFeature();
          ticking = false;
        });
        ticking = true;
      }
    };

    // ----------- Intersection Observer -----------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            scheduleUpdate();
          }
        });
      },
      {
        rootMargin: "0px",
        threshold: 0.1 // 10% de visibilidad
      }
    );

    itemRefs.current.forEach((ref) => ref && observer.observe(ref));

    // Escuchar scroll para actualizaciones continuas
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
        
  }, [isDesktop, features.length, activeIndex]); // Añadido activeIndex como dependencia

  // Control del sticky que debe quedarse dentro del wrapper ------
  useEffect(() => {
    if (!isDesktop || !wrapperRef.current || !stickyUnitRef.current) return;

    const onScroll = () => {
      const wrapper = wrapperRef.current!;
      const sticky = stickyUnitRef.current!;

      const rect = wrapper.getBoundingClientRect();
      const stickyHeight = sticky.offsetHeight;
      const wrapperTop = rect.top;
      const wrapperBottom = rect.bottom;

      if (wrapperTop > 20) {
        setStickyMode("sticky");
      } else if (wrapperTop <= 20 && wrapperBottom > stickyHeight + 40) {
        setStickyMode("fixed");
      } else {
        setStickyMode("bottom");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  // --------------------------------------------------------------
  // DESKTOP LAYOUT -----------------------------------------------
  // --------------------------------------------------------------
  if (isDesktop) {
    const active = features[activeIndex];

    return (
      <div
        ref={wrapperRef}
        className="relative w-full pt-32 pb-40 max-w-[1400px] mx-auto"
      >
        {/* === Capa 4 — Features (scroll normal) === */}
        <div className="relative z-0 w-full max-w-[500px] space-y-50">
          {features.map((f, i) => (
            <div
              key={f.id}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className="text-white"
            >
              
              {/* Contenido visible */}
              <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
              <p className="text-lg opacity-90">{f.description}</p>
            </div>
          ))}
        </div>

        {/* === Capa 2 y 3 — Overlay Sticky Unit (Título + Observer + Video) === */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            ref={stickyUnitRef}
            className={`
              pointer-events-auto w-[900px] mx-auto grid grid-cols-2 gap-10
              transition-all duration-0
              ${stickyMode === "sticky" ? "sticky top-10" : ""}
              ${stickyMode === "fixed" ? "fixed top-10 left-1/2 -translate-x-1/2" : ""}
              ${stickyMode === "bottom" ? "absolute bottom-10 left-1/2 -translate-x-1/2" : ""}
            `}
          >
            {/* === Título centrado encima === */}
            <div className="col-span-2">
              <div className="bg-[#2D1200] text-white py-4 px-5 rounded-lg text-center mb-6">
                <h2 className="text-3xl font-bold">{mainTitle}</h2>
              </div>
            </div>

            {/* === Observer (columna izquierda del grid) === */}
            <div
              ref={observerRef} // Referencia al observer
              className="flex items-start justify-center h-full"
            > {/* Invisible para que no se vea y respetar el espacio */}
              <div className="bg-white/10 text-white p-4 rounded-lg invisible">
                Observer Target
              </div>
            </div>

            {/* === Video (columna derecha del grid) === */}
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              {active.media.desktop.type === "video" ? (
                <video
                  key={active.id} // Para reiniciar el video al cambiar de Feature
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full border-0"
                  src={active.media.desktop.src}
                  aria-label={active.title}
                /> /**/
              ) : (
                <img
                  src={active.media.desktop.src}
                  alt={active.media.desktop.alt}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------
  // MOBILE LAYOUT -------------------------------------------------
  // --------------------------------------------------------------
  return (
    <div className="w-full max-w-3xl mx-auto px-5 py-16">
      <h2 className="text-3xl font-bold text-center text-white mb-14">
        {mainTitle}
      </h2>

      <div className="space-y-20">
        {features.map((f) => (
          <div key={f.id} className="text-center">
            <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
            <p className="text-lg text-white/90 mb-6">{f.description}</p>

            <img
              src={f.media.mobile.src}
              alt={f.media.mobile.alt}
              className="w-full rounded-lg object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StickyFeatureShowcase;