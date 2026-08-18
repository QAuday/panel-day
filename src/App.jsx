import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToHash from './components/ScrollToHash'
import WhatsAppButton from './components/WhatsAppButton'
import CartDrawer from './components/CartDrawer'
import AppTabBar from './components/AppTabBar'
import AnimatedOutlet from './components/AnimatedOutlet'
import MobileAppHeader from './components/MobileAppHeader'
import InstallPrompt from './components/InstallPrompt'
import UpdatePrompt from './components/UpdatePrompt'

const Home = lazy(() => import('./pages/Home'))
const Shop = lazy(() => import('./pages/Shop'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const Info = lazy(() => import('./pages/Info'))
const TrackOrder = lazy(() => import('./pages/TrackOrder'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  return (
    <CartProvider>
      <WishlistProvider>
        <BrowserRouter>
          <ScrollToHash />
          <Navbar />
          <main>
            <MobileAppHeader />
            <Suspense fallback={null}>
              <Routes>
                <Route element={<AnimatedOutlet />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order/:id" element={<OrderConfirmation />} />
                  <Route path="/info" element={<Info />} />
                  <Route path="/track" element={<TrackOrder />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Footer />
          <WhatsAppButton />
          <CartDrawer />
          <AppTabBar />
          <InstallPrompt />
          <UpdatePrompt />
        </BrowserRouter>
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
