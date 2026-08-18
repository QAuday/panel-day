import { Link } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  return (
    <section className="notfound-page">
      <div className="container notfound-page__inner">
        <span className="eyebrow">404</span>
        <h1 className="notfound-page__title">This panel doesn&rsquo;t exist.</h1>
        <p className="notfound-page__text">
          The page you&rsquo;re looking for got left on the cutting room floor.
        </p>
        <Link to="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  )
}

export default NotFound
