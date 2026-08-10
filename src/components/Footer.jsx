import Logo from './Logo'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo size={26} className="footer__logo" />
        <a
          href="https://instagram.com/panelday"
          target="_blank"
          rel="noreferrer"
          className="footer__social"
        >
          Instagram
        </a>
        <span className="footer__copy">&copy; {year} Panel Day. All rights reserved.</span>
      </div>
    </footer>
  )
}

export default Footer
