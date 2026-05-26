import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SourceProvider } from './context/SourceContext';
import MainLayout from './layouts/MainLayout';
import ChatPage from './pages/ChatPage';

export default function App() {
  return (
    <BrowserRouter>
      <SourceProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<ChatPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SourceProvider>
    </BrowserRouter>
  );
}
