import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.tsx'
import { FeedProvider } from './context/FeedContext.tsx'
import { ProfileProvider } from './context/ProfileContext.tsx'
import { FollowProvider } from './context/FollowContext.tsx'
import { BookmarkProvider } from './context/BookmarkContext.tsx'
import { ChatProvider } from './context/ChatContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <FeedProvider>
            <ProfileProvider>
              <FollowProvider>
                <BookmarkProvider>
                  <ChatProvider>
                    <App />
                  </ChatProvider>
                </BookmarkProvider>
              </FollowProvider>
            </ProfileProvider>
          </FeedProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
