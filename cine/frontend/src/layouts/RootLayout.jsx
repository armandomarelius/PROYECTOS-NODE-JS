import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Asegúrate de que la ruta sea correcta

const RootLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    // Contenedor principal
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-sky-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Sección izquierda del nav */}
            <div className="flex items-center">
              {/* Título */}
              <NavLink to="/" className="text-lg font-bold">
                VideoClub
              </NavLink>
              <div className="flex space-x-4 ml-10">
                <NavLink to="/movies" className="hover:text-amber-600">
                  Películas
                </NavLink>
                <NavLink to="/search" className="hover:text-amber-600">
                  Buscar
                </NavLink>
                <NavLink to="/reviews" className="hover:text-amber-600">
                  Reseñas
                </NavLink>
                {isAuthenticated && (
                  <NavLink to="/favorites" className="hover:text-amber-600">
                    Favoritos
                  </NavLink>
                )}
              </div>
            </div>

            {/* Sección derecha para autenticación */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm">Hola, {user?.username}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="bg-sky-500 hover:bg-sky-700 px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Iniciar sesión
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="bg-sky-500 hover:bg-sky-700 px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Registrarse
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Contenedor principal donde colocar outlet */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Outlet */}
        <Outlet />
      </main>
      
      {/* pie de página */}
      <footer className="bg-sky-950 text-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center">Videoclub Armando Marelius © 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;