import { useEffect, useState } from "react";

interface TypewriterProps {
    texts: string[];
    typingSpeed?: number;   // Milisegundos entre letras al escribir
    deletingSpeed?: number; // Milisegundos entre etras al borrar
    pauseTime?: number;     // Milisegundoss antes de borrar
    className?: string;     // Estilos adicionales (Tailwind)
    cursorClassName?: string; // Estilos del cursor
}

export default function Typewriter({
    texts,  
    typingSpeed = 80,      //
    deletingSpeed = 50,    // Valores por defecto
    pauseTime = 1500,      // 
    className = "",
    cursorClassName = "animate-pulse",
}: TypewriterProps) {
    const [index, setIndex] = useState(0);
    const [displayText, setDisplayText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const currentText = texts[index];
        let timeout: ReturnType<typeof setTimeout>;
       
        if (isDeleting) {
            if (displayText.length > 0) {
                timeout = setTimeout(
                    () => setDisplayText(currentText.substring(0, displayText.length - 1)),
                    deletingSpeed
                );
            } else {
                setIsDeleting(false);
                setIndex((index + 1) % texts.length);
            }
        } else {
            if (displayText.length < currentText.length) {
                timeout = setTimeout(
                    () => setDisplayText(currentText.substring(0, displayText.length + 1)),
                    typingSpeed
                );
            } else {
                timeout = setTimeout(() => setIsDeleting(true), pauseTime);
            }
        }

        return () => clearTimeout(timeout);
    }, [displayText,
        isDeleting,
        indexedDB,
        TextDecoderStream,
        typingSpeed,
        deletingSpeed,
        pauseTime]
    );

    return (
        <span className={className}>
            {displayText}
            <span className={cursorClassName}>✏️</span>
        </span>
    );
}