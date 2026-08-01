import React from 'react';
import { motion } from 'framer-motion';

export interface ChildProfile {
  id: string;
  name: string;
  avatar?: string;
  favoriteAnimal?: string;
  favoriteColor?: string;
  pinEnabled: boolean;
  lockedUntil?: Date;
}

interface ProfileSelectionScreenProps {
  childrenProfiles: ChildProfile[];
  onSelectChild: (child: ChildProfile) => void;
  onParentLogin: () => void;
}

export function ProfileSelectionScreen({
  childrenProfiles,
  onSelectChild,
  onParentLogin,
}: ProfileSelectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-fuchsia-900 flex flex-col items-center justify-center p-8 overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: Math.random() * 10 + 2 + 'px',
              height: Math.random() * 10 + 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl md:text-6xl font-extrabold text-white mb-12 text-center drop-shadow-lg font-mono tracking-tight"
      >
        Who's ready for a story?
      </motion.h1>

      <div className="flex flex-wrap justify-center gap-8 z-10 max-w-5xl">
        {childrenProfiles.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectChild(child)}
            className="cursor-pointer flex flex-col items-center"
          >
            <div
              className="w-40 h-40 md:w-48 md:h-48 rounded-3xl mb-6 shadow-2xl flex items-center justify-center border-4 border-white/20 relative overflow-hidden group"
              style={{
                background: child.favoriteColor || 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)',
              }}
            >
              {child.avatar ? (
                <img
                  src={child.avatar}
                  alt={child.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <span className="text-6xl">{child.favoriteAnimal || '🦊'}</span>
              )}

              {child.pinEnabled && (
                <div className="absolute bottom-3 right-3 bg-white/30 backdrop-blur-md p-2 rounded-full shadow-lg">
                  <LockIcon className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <h2 className="text-3xl font-bold text-white drop-shadow-md capitalize">
              {child.name}
            </h2>
          </motion.div>
        ))}

        {childrenProfiles.length === 0 && (
          <div className="text-white/80 text-xl font-medium bg-black/20 p-8 rounded-3xl backdrop-blur-sm">
            No children profiles found.
          </div>
        )}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        onClick={onParentLogin}
        className="mt-16 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold backdrop-blur-md border border-white/20 transition-all z-10"
      >
        Parent Dashboard
      </motion.button>
    </div>
  );
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
