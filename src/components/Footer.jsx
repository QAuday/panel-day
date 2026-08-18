import { Link } from 'react-router-dom'
import Logo from './Logo'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <Logo size={26} className="footer__logo" />
        <Link to="/info" className="footer__social">
          Shipping &amp; Returns
        </Link>
        <Link to="/track" className="footer__social">
          Track Order
        </Link>
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
