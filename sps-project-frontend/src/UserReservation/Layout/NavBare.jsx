import React, { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Home, Calendar, History, Bell, Menu, X, LogIn } from 'lucide-react'

function NavBare() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav className={`sticky z  top-0  py-2.5  z-[48]  flex justify-center w-full transition-all duration-300 ${
        scrolled ? "bg-primary/5   backdrop-blur-md shadow-md" : "bg-transparent"
      }`}>
        <div className=" md:px-12 px-8   flex  items-center  w-full       justify-between">
          {/* Logo et nom */}
          <div className="flex items-center">
            <span className="text-gray-950 md:text-blue-500 text-2xl">★</span>
            <span className="text-gray-950 md:text-blue-500 text-xl font-semibold ml-2">Hôtel de Luxe</span>
          </div>

          {/* Navigation links - Desktop */}
      
          <div className="  hidden-nav  md:flex   space-x-4    items-center lg:space-x-12  ">
            <Link to="/user/" className="text-blue-500   text-md  hover:text-blue-400 flex items-center  !no-underline relative group">
              <Home className="w-4 md:w-5 md:h-5 h-4  mr-1  " />
              Accueil
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full   transition-all duration-300"></span>
            </Link>
            <Link to="/reservations" className="text-blue-500  text-sm hover:text-blue-400 flex items-center   !no-underline  *: relative group">
              <Calendar className="w-4 md:w-5 md:h-5 h-4 mr-1" />
              Réservations
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/historique" className="text-blue-500  text-sm hover:text-blue-400 flex items-center  !no-underline relative group">
              <History className="w-4  md:w-5 md:h-5 h-4 mr-1" />
              Historique
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </div>

          
          <div className=" md:flex  hidden-nav    items-center  gap-4  md:gap-6">
          <Link   to="/user/login"  className=' !no-underline '>
            <button className="text-blue-600  flex   items-center gap-1  !no-underline   hover:text-blue-800">
            <LogIn  size={18} /> Connexion
            </button>
            </Link>
            <button className="bg-blue-600  md:text-md  text-sm text-white md:px-6  px-4     py-2    rounded-md  raduis-button-lg  hover:bg-blue-500   duration-200">
              Inscription
            </button>
          </div>
 
      

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hidden-button text-blue-600 hover:text-blue-400 p-2"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Dark Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Modal */}
      <div className={`
        fixed inset-y-0 right-0 w-[60%] bg-white z-50 md:hidden
        transform transition-transform duration-300 ease-out
        ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        shadow-[-10px_0_20px_rgba(0,0,0,0.1)]
      `}>
        <div className="p-4 h-full relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <span className="text-blue-500 text-2xl">★</span>
              <span className="text-blue-500 text-xl font-semibold ml-2">Hôtel de Luxe</span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-blue-500 hover:text-blue-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-center mb-8">
            Découvrez nos chambres luxueuses et profitez d'un séjour inoubliable
          </p>

          {/* Navigation Links */}
          <div className="space-y-4">
            <Link 
              to="/" 
              className="flex items-center text-blue-500 hover:bg-blue-50 p-3 !no-underline rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home className="w-5 h-5 mr-3" />
              Accueil
            </Link>   
            <Link 
              to="/reservations" 
              className="flex items-center text-blue-500 hover:bg-blue-50 p-3    !no-underline rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Calendar className="w-5 h-5 mr-3" />
              Réservations
            </Link>
            <Link 
              to="/historique" 
              className="flex items-center text-blue-500 hover:bg-blue-50 p-3   !no-underline  rounded-lg transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <History className="w-5 h-5 mr-3" />
              Historique
            </Link>
          </div>

          {/* Bottom Buttons */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-8 bg-white">
            <Link   to="/user/login">
            <button className="w-full   raduis-button text-blue-500 hover:bg-blue-50 py-3 rounded-lg transition-colors duration-200">
              Connexion
            </button>
            </Link>
            <button className="w-full bg-blue-600    raduis-button-lg text-white py-2  rounded-lg hover:bg-blue-700 transition-colors duration-200">
              Inscription
            </button>
          </div>
        </div>
      </div>
      <main>
        <Outlet/>
      </main>
    </>
  )
}

export default NavBare