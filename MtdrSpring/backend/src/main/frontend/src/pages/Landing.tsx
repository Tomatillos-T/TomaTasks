import tomatoLogo from "../assets/tomato.svg"; {/* Se usa el componente */}
import Typewriter from "../components/Landing/Typewriter";
import GetStarted from "../components/Landing/get-started";
import Footer from "../components/Landing/Footer";
import StickyFeatureShowcase from "../components/Landing/StickyFeatureShowcase";
import type { StickyShowcaseProps } from "../components/Landing/StickyFeatureShowcase";
import './Landing.css';

// Demos
import chatbot from "../assets/demos/chatbot.png";
import kanban from "../assets/demos/kanban.png";
import kpi from "../assets/demos/kpi.png";
import projects from "../assets/demos/projects.png";

// sass
function Landing() {
  const showcaseData: StickyShowcaseProps = {
    mainTitle: "Teamwork solutions for high-performing teams",
    breakpoint: 1024,
    features: [
      {
        id: "feature-1",
        title: "Organiza tus Proyectos",
        description: "Con nuestra interfaz intuitiva y fácil de usar, pordrás organizar tus proyectos y gestionar cambios de acuerdo a tus necesidades.",
        media: {
          desktop: {
            type: "image",
            src: projects,
            alt: "Demostración de Vista de Proyectos"
          },
          mobile: {
            type: "image",
            src: projects,
            alt: "Organiza tus Proyectos"
          }
        },
      },
      {
        id: "feature-2",
        title: "Reportes de KPIs (Key Performance Indicators)",
        description: "Gráficas que muestran el progreso del equpo de manera ordenada. Actúa a tiempo, revisa las métricas y conecta con tu equipo de desarrollo asegurando un ambiente sano y altamente productivo.",
        media: {
          desktop: {
            type: "image",
            src: kpi,
            alt: "KPI reports demonstration"
          },
          mobile: {
            type: "image",
            src: kpi,
            alt: "KPI Reports"
          }
        },
      },
      {
        id: "feature-3",
        title: "Tablero Kanban",
        description: "Utiliza el tablero Kanban para organizar la manera en que trabaja tu equipo de manera interactiva. Revisa la disponibilidad de los demás y visualiza los flujos de trabajo y la carga laboral.",
        media: {
          desktop: {
            type: "image",
            src: kanban,
            alt: "Kanban board demonstration"
          },
          mobile: {
            type: "image",
            src: kanban,
            alt: "Kanban Board"
          }
        },
      },
      {
        id: "feature-4",
        title: "Impulsa tus ideas con la IA",
        description: "Nuestro capaz asistente de Inteligencia Artificial puede ayudarte con la solución de tareas de tu proyecto dando erspuestas con base al repositorio de GitHub.",
        media: {
          desktop: {
            type: "image", // "image" | "video"
            src: chatbot,
            alt: "AI assistance"
          },
          mobile: {
            type: "image",
            src: chatbot,
            alt: "AI Assistant"
          }
        },
        colors: {
          primary: "#f00000ff",
          accent: "#585858ff"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-hidden">
      {/* Adornos */}
      <div
        aria-hidden="true"
        className="fixed inset-x-0
                    -left-50
                    -top-40
                    -z-0
                    transform-gpu
                    overflow-hidden
                    blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            background: "#fa8e9cff",
          }}
          className="relative left-[calc(50%-11rem)]
                      aspect-[1155/678]
                      w-[36rem] -translate-x-1/2
                      rotate-[30deg]
                      bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
                      opacity-70"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-x-0
                    -left-330
                    top-50
                    -z-0
                    transform-gpu
                    overflow-hidden
                    blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            background: "#fa8e9cff",
          }}
          className="relative left-[calc(50%-11rem)]
                      aspect-[1155/678]
                      w-[36rem] -translate-x-1/2
                      rotate-[30deg]
                      bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
                      opacity-70"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-x-0
                    -right-0
                    top-160
                    -z-0
                    transform-gpu
                    overflow-hidden
                    blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            background: "#fa8e9cff",
          }}
          className="relative left-[calc(50%+11rem)]
                      aspect-[1155/678]
                      w-[36rem] -translate-x-1/2
                      rotate-[30deg]
                      bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
                      opacity-70"
        />
      </div>
      <div
        aria-hidden="true"
        className="fixed inset-x-0
                    -right-270
                    top-50
                    -z-0 transform-gpu
                    overflow-hidden
                    blur-3xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            background: "#fa8e9cff",
          }}
          className="relative left-[calc(50%+11rem)]
                      aspect-[1155/678]
                      w-[36rem] -translate-x-1/2
                      rotate-[30deg]
                      bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]
                      opacity-70"
        />
      </div>
      <div className="relative isolate px-0 pt-14 lg:px-0">
        {/* Polígono de prueba */}
        {/*<div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-10"
          style={{
            clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            background: "red",
            width: "200px",
            height: "200px"
          }}
        /> */}

        {/* Contenido de la vista */}
        <div className="mx-auto max-w-5xl py-32 sm:py-48 lg:py-56">    
          <div className="justify-center items-center text-center">
            <div className="flex justify-center">
              <img alt="" src={tomatoLogo} className="h-30 w-30"/>
            </div>
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
              TomaTask
            </h1>

            {/* Typewriter */}
            <Typewriter
              texts = {[
                "Ordena tus Deberes",
                "Aclara el camino",
                "Mejora Continua",
                "Previene desórdenes",
                "Acelera tu progreso"
              ]}
              typingSpeed={100} // Velocidad de Escritura
              deletingSpeed={30} // Velocidad de Borrado
              pauseTime={1500} // Velocidad de Pausa
              className="mt-8
                         text-lg
                         font-medium
                         text-pretty
                         text-gray-400
                         sm:text-xl/8"
            />

            {/* Call To Action */}
            <div className="mt-10 px-0 py-40 flex items-center justify-center gap-x-6">
              <GetStarted 
                texto="Empezar ahora"
                destino="/login"
                tamaño="lg"
                variante="particles"
                mostrarAura={true}
              />
            </div>
          </div>

          <StickyFeatureShowcase
            mainTitle={showcaseData.mainTitle}
            features={showcaseData.features}
            breakpoint={showcaseData.breakpoint}
          />

          <div className="pt-20">
            <div className="flex flex-col items-center mt-60px min-[650px]:flex-row min-[650px]:justify-center min-[650px]:items-center gap-3">
              <h2 className="text-3xl font-mono text-center tracking-tight text-balance text-white sm:text-7sm">
                Organiza tus ideas con TomaTask
              </h2>
              <img alt="Tomato Logo" src={tomatoLogo} className="hidden h-9 w-9 min-[650px]:block"/>
            </div>
            
            <div className="mt-10 px-0 py-0 flex items-center justify-center gap-x-6">
              <GetStarted 
                texto="Empezar ahora"
                destino="/login"
                tamaño="lg"
                variante="particles"
                mostrarAura={true}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Landing;