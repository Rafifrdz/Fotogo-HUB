import React, { createContext, useContext, useState, useEffect } from 'react';

interface Frame {
  id: string;
  name: string;
  imageUrl: string;
}

interface FrameContextType {
  activeFrame: Frame | null;
  setActiveFrame: (frame: Frame | null) => void;
}

const FrameContext = createContext<FrameContextType | undefined>(undefined);

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const [activeFrame, setActiveFrame] = useState<Frame | null>(() => {
    const saved = localStorage.getItem('activeFrame');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (activeFrame) {
      localStorage.setItem('activeFrame', JSON.stringify(activeFrame));
    } else {
      localStorage.removeItem('activeFrame');
    }
  }, [activeFrame]);

  return (
    <FrameContext.Provider value={{ activeFrame, setActiveFrame }}>
      {children}
    </FrameContext.Provider>
  );
}

export function useFrame() {
  const context = useContext(FrameContext);
  if (context === undefined) {
    throw new Error('useFrame must be used within a FrameProvider');
  }
  return context;
}
