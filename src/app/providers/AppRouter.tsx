import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@entities/auth/model/store';
import { LoginPage } from '@pages/login/LoginPage';
import { ProductsPage } from '@pages/products/ProductsPage';

const ProtectedLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export const AppRouter = () => {
  const isHydrated = useAuthStore.persist?.hasHydrated?.() ?? true;

  if (!isHydrated) {
    return <div className="loading-screen">Загрузка...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/products" element={<ProductsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
