import tomatoLogo from "../assets/tomato.svg"; {/* Se usa el componente */}
import Typewriter from "../components/Landing/Typewriter";
import GetStarted from "../components/Landing/get-started";
import Footer from "../components/Landing/Footer";
import StickyFeatureShowcase from "../components/Landing/StickyFeatureShowcase";
import type { StickyShowcaseProps } from "../components/Landing/StickyFeatureShowcase";
import './Landing.css';
// sass
function Landing() {
  const showcaseData: StickyShowcaseProps = {
    mainTitle: "Planea Proyectos, Crea Soluciones",
    breakpoint: 1024,
    features: [
      {
        id: "feature-1",
        title: "AI Chat Bot",
        description: "Utiliza el chatbot de Inteligencia Artificial generativa para escribir elementos, corregir errores y orgnizar tus ideas.",
        media: {
          desktop: {
            type: "video",
            src: "../Demos/feature1.mp4",
            alt: "Planning and tracking demonstration"
          },
          mobile: {
            type: "image",
            src: "https://www.buenprovecho.hn/wp-content/uploads/2020/09/tomate-1024x680-1.jpg",
            alt: "AI Chat Bot"
          }
        },
      },
      {
        id: "feature-2",
        title: "Kanban Board",
        description: "Descripción larga de la feature.",
        media: {
          desktop: {
            type: "video",
            src: "../Demos/feature2.mp4",
            alt: "Kanban Board"
          },
          mobile: {
            type: "image",
            src: "https://misremedios.com/wp-content/uploads/2016/03/tomate-rodajas-cortado-700x466.jpg",
            alt: "Kanban Board"
          }
        },
      },
      {
        id: "feature-3",
        title: "KPIs",
        description: "Descripción larga de la Feature.",
        media: {
          desktop: {
            type: "video",
            src: "../Demos/feature2.mp4",
            alt: "KPIs"
          },
          mobile: {
            type: "image",
            src: "https://misremedios.com/wp-content/uploads/2016/02/Tomates2-700x465.jpg",
            alt: "Planning feature"
          }
        },
      },
      {
        id: "feature-4",
        title: "Feature 4",
        description: "Connect and consolidate scattered docs and disconnected teammates in one, central source of truth. Connect and consolidate scattered docs and disconnected teammates in one, central source of truth.",
        media: {
          desktop: {
            type: "video",
            src: "../Demos/feature4.mp4",
            alt: "Feature 4"
          },
          mobile: {
            type: "image",
            src: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.ooreka.fr%2Fpublic%2Fimage%2Fplant%2F265%2FmainImage-source-10006168.jpg&f=1&nofb=1&ipt=ebafd0ffc6308bd796422b7e371b1c77237121c03424dbdb081b4e4bbf8ac667",
            alt: "Knowledge scaling"
          }
        },
        colors: {
          primary: "#f00000ff",
          accent: "#585858ff"
        }
      }
      // Puedes añadir más features aquí
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
                destino="/Login"
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