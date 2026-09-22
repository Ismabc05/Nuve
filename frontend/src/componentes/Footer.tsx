import { FaLinkedin, FaGithub } from 'react-icons/fa';
import '../estilos/footer/footer.css';
import { LuMail } from 'react-icons/lu';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">

        <div className="footer__brand">
          <img src="/login.png" alt="Nuvé" />

          <p>
            Tu espacio para descubrir y disfrutar.
          </p>
        </div>

        <div className="footer__social">
          <h3>Síguenos</h3>

          <div className="footer__social-links">
            <a
              href="https://www.linkedin.com/in/ismaelbedmar/"
              target="_blank" // se abre el enlace en una pestaña nueva
              rel="noreferrer" // el navegador no sabe de que página vengo
              aria-label="Linkedin"
            >
              <FaLinkedin />
            </a>

            <a
              href="mailto:ismaelbedmarcejas@gmail.com"
              aria-label="Enviar correo"
            >
              <LuMail />
            </a>

            <a
              href="https://github.com/Ismabc05"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>
          </div>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© 2026 Nuvé. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;