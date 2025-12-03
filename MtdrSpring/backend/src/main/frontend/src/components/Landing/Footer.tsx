// src/components/Footer.tsx
// npm install @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
  faPinterest,
  faTelegram,
} from "@fortawesome/free-brands-svg-icons";
import { faHome, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import type { IconDefinition } from "@fortawesome/fontawesome-common-types";
import tomato from "../../assets/tomato.svg";

// No recibe props, pero se deja interfaz por si luego lo extiendes
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const socialIcons: IconDefinition[] = [
    faFacebook,
    faTwitter,
    faInstagram,
    faLinkedin,
    faYoutube,
    faPinterest,
    faTelegram,
  ];

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Logo */}
        <div className="flex justify-center py-10 md:py-9 gap-2 items-center">
          <img
            src={tomato}
            alt="TomaTask"
            className="w-2/5 md:w-1/4 lg:w-[18%] xl:w-[15%] max-w-[30px]"
          />
          <h2 className="text-xl">TomaTask</h2>
        </div>

        {/* Contenido */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {/* Información */}
          <div className="text-gray-400 font-medium text-sm space-y-3">
            <div className="flex items-center gap-1 mb-4">
              <h2 className="text-white text-lg font-normal uppercase tracking-wider border-b-2 border-red-500/90 pb-2">
                Information
              </h2>
              <span className="text-white font-normal uppercase tracking-wider"></span>
            </div>
            <p>Registration Start Date</p>
            <p>Registration End Date</p>
            <p>Exam Last Date</p>
          </div>

          {/* Fechas */}
          <div className="text-gray-400 font-medium text-sm space-y-3">
            <h2 className="text-white text-lg font-normal uppercase tracking-wider border-b-2 border-red-500/90 pb-2 inline-block mb-4">
              dates
            </h2>
            <p>23 Dec 2021</p>
            <p>30 May 2022</p>
            <p>23 Dec 2021 to 31 May 2022</p>
          </div>

          {/* Support */}
          <div className="flex flex-col justify-between gap-8">
            {/* Support */}
            <div className="text-gray-400 font-medium text-sm space-y-3 pt-4">
              <div className="flex items-center gap-1 mb-4">
                <h2 className="text-white text-lg font-normal uppercase tracking-wider border-b-2 border-red-500/90 pb-2">
                  support
                </h2>
                <span className="text-white font-normal uppercase tracking-wider"></span>
              </div>
              <p className="flex items-center gap-2 hover:text-gray-300">
                <FontAwesomeIcon icon={faPhone} className="text-lg" />
                <a href="tel:9946948000">
                  +52 1 639 117 5750 (
                  <span className="text-xs">General Enquiry</span>)
                </a>
              </p>
              <p className="flex items-center gap-2 hover:text-gray-300">
                <FontAwesomeIcon icon={faPhone} className="text-lg" />
                <a href="tel:9946947000">
                  +52 1 81 1603 0190 (
                  <span className="text-xs">Technical Support: TomaTask</span>)
                </a>
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="text-gray-400 font-medium text-sm space-y-4">
            <div className="flex items-center gap-1 mb-4">
              <h2 className="text-white text-lg font-normal uppercase tracking-wider border-b-2 border-red-500/90 pb-2">
                Let's Meet
              </h2>
              <span className="text-white font-normal uppercase tracking-wider"></span>
            </div>

            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faHome} className="text-lg mt-1" />
              <div>
                <strong className="text-gray-300 block">Our Company</strong>
                <address className="not-italic mt-1 leading-relaxed">
                  Garza Sada, Paseo Tecnológico
                  <br />
                  Monterrey, Nuevo León (México)
                  <br />
                  General Helpline No: +52 1 921 222 3320
                </address>
              </div>
            </div>

            <div className="space-y-2 mt-3">
              <p className="flex items-center gap-2 hover:text-gray-300">
                <FontAwesomeIcon icon={faEnvelope} className="text-lg" />
                <a href="mailto:admin@Company.in">tomatillos@toma.co</a>
              </p>
            </div>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Redes sociales */}
        <div className="flex justify-center gap-3 py-4 mb-6">
          {socialIcons.map((icon, idx) => (
            <a
              key={idx}
              href="#"
              className="w-10 h-10 bg-gray-700 hover:bg-white hover:text-blue-500 rounded-full flex items-center justify-center transition-all duration-300"
              aria-label={`Visit our ${icon.iconName} page`}
            >
              <FontAwesomeIcon icon={icon} className="text-lg" />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm pb-4">
          &copy; {new Date().getFullYear()} Tomatillos. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
