import './PriceTag.css'

function PriceTag({ mrp, price, size = 'md' }) {
  const onSale = mrp > price

  return (
    <span className={`price-tag price-tag--${size}`}>
      {onSale && <span className="price-tag__mrp">₹{mrp}</span>}
      <span className="price-tag__price">₹{price}</span>
      {onSale && (
        <span className="price-tag__off">{Math.round(((mrp - price) / mrp) * 100)}% off</span>
      )}
    </span>
  )
}

export default PriceTag
