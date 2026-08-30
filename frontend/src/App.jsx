import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { IntroSection } from './sections/IntroSection';
import { StarJourney } from './sections/StarJourney';
import { GiftSection } from './sections/GiftSection';
import { MemoriesSection } from './sections/MemoriesSection';
import { MessagesSection } from './sections/MessagesSection';
import { BirthdayReveal } from './sections/BirthdayReveal';
import { UniverseSection } from './sections/UniverseSection';
import { MessageFormSection } from './sections/MessageFormSection';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Intro Page: / and /svg */}
        {['/', '/svg'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              >
                <IntroSection />
              </motion.div>
            }
          />
        ))}

        {/* Star Journey Page: /stars and /starssvg */}
        {['/stars', '/starssvg'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
                transition={{ duration: 0.8 }}
              >
                <StarJourney />
              </motion.div>
            }
          />
        ))}

        {/* Secret Gift Page: /gift and /giftsvg */}
        {['/gift', '/giftsvg'].map((path) => (
          <Route
            key={path}
            path={path}
            element={
              <motion.div
                initial={{ opacity: 0, filter: 'blur(8px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
                transition={{ duration: 0.8 }}
              >
                <GiftSection />
              </motion.div>
            }
          />
        ))}

        {/* Memories Page: /memories */}
        <Route
          path="/memories"
          element={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              transition={{ duration: 0.8 }}
            >
              <MemoriesSection />
            </motion.div>
          }
        />

        {/* Personal Messages Sequence Page: /messages */}
        <Route
          path="/messages"
          element={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              transition={{ duration: 0.8 }}
            >
              <MessagesSection />
            </motion.div>
          }
        />

        {/* Birthday Reveal Page: /birthday */}
        <Route
          path="/birthday"
          element={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              transition={{ duration: 0.8 }}
            >
              <BirthdayReveal />
            </motion.div>
          }
        />

        {/* Universe Final Experience: /universe */}
        <Route
          path="/universe"
          element={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              transition={{ duration: 0.8 }}
            >
              <UniverseSection />
            </motion.div>
          }
        />

        {/* Final Personal Message & Email Submission Page: /message */}
        <Route
          path="/message"
          element={
            <motion.div
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(8px)', transition: { duration: 0.8 } }}
              transition={{ duration: 0.8 }}
            >
              <MessageFormSection />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-[#0B0B0F] text-[#FFFFFF] font-sans overflow-hidden selection:bg-[#FF4F81] selection:text-white">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
