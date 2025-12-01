/***********************************************************
 *   Originalmente se usa con Typescript + Vite + React    *
 ***********************************************************/ 

import { useNavigate } from 'react-router-dom';
import React, { useRef, useEffect } from 'react';
import tomato from "../../assets/tomato.svg";
//import test from "../assets/react.svg";

// Interfaz para los props
/* Prop: Datos que pasan de un componente
 *       padre a un componente hijo.
 */
interface GetStartedProps {
    texto?: string;
    destino?: string;
    onClick?: () => boolean | void;
    tamaño?: 'sm' | 'md' | 'lg';
    deshabilitado?: boolean;
    className?: string;
    tipo?: 'button' | 'submit' | 'reset';
    reemplazar?: boolean;
    variante?: 'primario' | 'secundario' | 'classic' | 'particles';
    mostrarAura?: boolean;
}

// Componente funcional con Typescript
const GetStarted = ({
    texto = '¡Empieza Ya!',
    destino,
    onClick,
    tamaño = 'md',
    deshabilitado = false,
    className = '',
    tipo = 'button',
    reemplazar = false,
    variante = 'particles',
    mostrarAura = false // <-- Para evitar 'undefined'
}: GetStartedProps) => {
    const navigate = useNavigate();
    const styleRef = useRef<HTMLStyleElement>(null);

    useEffect(() => {
        if (!styleRef.current) {
            const style = document.createElement('style');
            style.innerHTML = `
                /* Animaciones para aura de partículas */
                @keyframes float-aura-1 {
                    0% { transform: translate(-50%, 0) rotate(0deg); }
                    25% { transform: translate(-50%, -23px) rotate(90deg); } /* 1/4 de Tiempo */
                    50% { transform: translate(-50%, -45px) rotate(180deg); } /* 2/4 Tiempo */
                    75% { transform: translate(-50%, -23px) rotate(270deg); } /* 3/4 Tiempo */
                    100% { transform: translate(-50%, 0px) rotate(360deg); } /* Fin */
                }

                @keyframes float-aura-2 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-15px, 23px) rotate(90deg); }
                    50% { transform: translate(-30px, 45px) rotate(180deg); }
                    75% { transform: translate(-10px, 23px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-3 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(25px, -20px) rotate(90deg); }
                    50% { transform: translate(40px, -35px) rotate(180deg); }
                    75% { transform: translate(30px, -15px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-4 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(35px, -50px) rotate(180deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-5 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(20px, 20px) rotate(90deg); }
                    50% { transform: translate(35px, 40px) rotate(180deg); }
                    75% { transform: translate(25px, 20px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-6 {
                    0%{ transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-40px, 25px) rotate(180deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-7 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(0, -25px) rotate(90deg); }
                    50% { transform: translate(0, -40px) rotate(180deg); }
                    75% { transform: translate(0, -30px) rotate(270deg); }
                    100% { transform: translate(0, 0px) rotate(360deg); }
                }

                @keyframes float-aura-8 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(10px, 25px) rotate(90deg); }
                    50% { transform: translate(20px, 50px) rotate(180deg); }
                    75% { transform: translate(15px, 25px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }
                
                @keyframes float-aura-9 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(-15px, 23px) rotate(90deg); }
                    50% { transform: translate(-30px, 45px) rotate(180deg); }
                    75% { transform: translate(-10px, 23px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                @keyframes float-aura-10 {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(20px, 20px) rotate(90deg); }
                    50% { transform: translate(35px, 40px) rotate(180deg); }
                    75% { transform: translate(25px, 20px) rotate(270deg); }
                    100% { transform: translate(0px, 0px) rotate(360deg); }
                }

                .group:hover .float-aura-1 { animation: float-aura-1 0.8s ease-in-out infinite; }
                .group:hover .float-aura-2 { animation: float-aura-2 1s ease-in-out infinite; }     /* (+) */
                .group:hover .float-aura-3 { animation: float-aura-3 0.8s ease-in-out infinite; }
                .group:hover .float-aura-4 { animation: float-aura-4 1.4s ease-in-out infinite; }
                .group:hover .float-aura-5 { animation: float-aura-5 0.7s ease-in-out infinite; }   /* (+) */
                .group:hover .float-aura-6 { animation: float-aura-6 1.4s ease-in-out infinite; }
                .group:hover .float-aura-7 { animation: float-aura-7 1.3s ease-in-out infinite; }
                .group:hover .float-aura-8 { animation: float-aura-8 1.4s ease-in-out infinite; }
                .group:hover .float-aura-9 { animation: float-aura-9 1s ease-in-out infinite; }     /* (-) */
                .group:hover .float-aura-10 { animation: float-aura-10 0.7s ease-in-out infinite; } /* (-) */
            `;


            document.head.appendChild(style);
            styleRef.current = style;
        }

        /*return () => { // No se limpia. Las animaciones están todo el ciclo de la app
            if (styleRef.current) {
                document.head.removeChild(styleRef.current);
            }
        };*/
    }, []);

    /* Para añadir una NUEVA PARTÍCULA (aura-X), hay que crear:
       1. @keyframe
       2. .group:hover 
       3. Nuevo 'classname' dentro del arreglo de configuraciones
    */

    const getSizeClasses = () => {
        switch (tamaño) {
            case 'sm':
                return 'px-3 py-1.5 text-sm';
            case 'md':
                return 'px-3 py-2 text-sm font-semibold';
            case 'lg':
                return 'px-6 py-3 text-lg font-semibold';
            default:
                return 'px-3 py-2 text-sm font-semibold';
        }
    };

    // Clases de variante
    const getVariantClasses = () => {
        switch (variante) {
            case 'classic':     // focus-visible se activa solo con el teclado
                return 'bg-red-500 text-white shadow hover:bg-orange-500 hover:border-[#00b947] border-2 border-transparent focus:ring-3 focus:ring-offset-3 focus:ring-orange-500';
            case 'particles':
                return 'bg-red-500 text-white shadow hover:bg-orange-500 hover:border-[#00b947] border-2 border-transparent focus:ring-3 focus:ring-offset-3 focus:ring-orange-500';
            case 'primario':
                return 'bg-red-600 hover:bg-red-700 hover:border-[#00b947] border-2 border-transparent text-white';
            case 'secundario':
                return 'bg-gray-600 hover:bg-gray-700 hover:border-[#00b947] border-2 border-transparent text-white';
            default:
                return 'bg-red-500 text-white shadow hover:bg-orange-500 hover:border-[#00b947] border-2 border-transparent';
        }
    };

    // Clases base
    const buttonClasses = [
        'rounded-md relative z-30',
        'transition-all duration-300 ease-in-out',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        getSizeClasses(),
        getVariantClasses(),
        className
    ].filter(Boolean).join(' ');

    // Acción del click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        
        // Ejecutar callback personalizado si existe
        const shouldNavigate = onClick?.() !== false;

        // Navegación si hay destino y no está deshabilitado
        if (shouldNavigate && !deshabilitado && destino) {
            navigate(destino, { replace: reemplazar });
        }
    };

    // Arreglo de configuraciones
    const particulas = [                                                     //     V---- Gira en sentido de las manecillas del reloj a mayor graduación
        { className: 'top-0 left-1/10 w-5 h-5 opacity-70 blur-[1px] -translate-x-1/2 rotate-320' }, // aura-1
        { className: 'bottom-0 left-1/4 w-4 h-4 opacity-60 blur-[1px] -rotate-10' }, // aura-2   (-) En contra
        { className: 'top-1/2 right-0 w-6 h-6 opacity-75 blur-[1px] rotate-45' }, // aura-3
        { className: 'top-1/4 right-0 w-5 h-5 opacity-65 blur-[1px] rotate-30' }, // aura-4
        { className: 'bottom-1/4 right-1/4 w-4 h-4 opacity-70 blur-[1px] rotate-10' }, // aura-5
        { className: 'top-1/3 left-0 w-5 h-5 opacity-60 blur-[1px] -rotate-15' }, // aura-6
        { className: 'top-0 left-4/9 w-6 h-6 opacity-50 blur-[1px] rotate-0' }, // aura-7
        { className: 'bottom-0 right-1/2 w-4 h-4 opacity-55 blur-[1px] -rotate-0' }, // aura-8
        { className: 'top-0 left-1/4 w-4 h-4 opacity-60 blur-[1px] rotate-140' }, // aura-9
        { className: 'top-1/4 right-1/4 w-4 h-4 opacity-70 blur-[1px] rotate-240' }, // aura-10
    ];

    //       Tamaños:
    // w-1 h-1 = 0.25rem = 4px     (muy pequeño)         |            A      + ---> New
    // w-2 h-2 = 0.5rem  = 8px                           |            |     /   Particle Pos
    // w-3 h-3 = 0.75rem = 12px                          |            | +  /
    // w-4 h-4 = 1rem    = 16px    (tamaño estándar)     |            |.-./
    // w-5 h-5 = 1.25rem = 20px                          |            |  /
    // w-6 h-6 = 1.5rem  = 24px                          |            | /
    // w-7 h-7 = 1.75rem = 28px                          |            |/
    // w-8 h-8 = 2rem    = 32px    (grande)              |            *
    // w-12 h-12 = 3rem  = 48px    (muy grande)          |
    // ... hasta w-96 h-96                               |     

    return (  /*   [inline-flex] permite que el contenedor se ajuste a su contenido.
               *   Con [p-4] amplías el área del hover.
               */
        <div className="relative inline-flex items-center justify-center group hover:cursor-pointer">
            {/* Zona de detección invisible (No clickeable, pero activa el efecto CTA) */}
            <div className="pointer-events-none cursor-default absolute inset-0 -mx-140 -my-60"></div>
  
            {/* Botón principal */}
                <button
                    type={tipo}
                    className={`${buttonClasses} group-hover:scale-105`}
                    onClick={handleClick}
                    disabled={deshabilitado}
                >
                    <span className="relative z-30">{texto}</span>
                </button>

            {/* Aura y partículas - solo se muestra en variante 'particles' */}
            {variante === 'particles' && (   /* Bajar a z-20 para que las partículas estén debajo del botón */
                <div className="absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {/* Aura/Halo difuminado */}
                    {mostrarAura && (
                        <div className="absolute
                                        -inset-5
                                        rounded-2xl
                                        blur-3xl
                                        bg-red-500/40
                                        group-hover:bg-orange-500/50
                                        transition-all
                                        duration-500"
                        />
                    )}
                    
                    {/* Partículas */}
                    <div className="absolute inset-0">
                        {particulas.map((p, i) => (
                            <img   /*Renderiza la misma imagen en todas las partículas*/
                                key={i}
                                src={tomato}
                                alt=""
                                className={`absolute transform ${p.className} float-aura-${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GetStarted;