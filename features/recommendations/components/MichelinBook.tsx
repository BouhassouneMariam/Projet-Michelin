"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type BookStatus = "closed" | "opening" | "open";

type MichelinBookProps = {
  status: BookStatus;
  contentVisible: boolean;
  onOpen: () => void;
  children?: ReactNode;
};

export function MichelinBook({
  status,
  contentVisible,
  onOpen,
  children
}: MichelinBookProps) {
  const isClosed = status === "closed";
  const isOpening = status === "opening";
  const isOpenLike = status !== "closed";

  return (
    <div className="michelin-book-scene flex w-full select-none items-center justify-center">
      <motion.div
        className="michelin-physical-book-stage"
        initial={{ opacity: 0, rotateY: -18, y: 26 }}
        animate={{
          opacity: 1,
          rotateY: isClosed ? -20 : 0,
          y: isClosed ? [0, -8, 0] : 0
        }}
        transition={{
          opacity: { duration: 0.7 },
          rotateY: { duration: isClosed ? 0.9 : 1.15, ease: [0.22, 1, 0.36, 1] },
          y: isClosed
            ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
            : { duration: 0.9, ease: [0.22, 1, 0.36, 1] }
        }}
      >
        {isClosed ? (
          <motion.button
            type="button"
            onClick={onOpen}
            aria-label="Ouvrir le Guide Michelin"
            className="michelin-closed-book-button"
            initial={false}
            animate={{ opacity: 1 }}
            transition={{
              opacity: { duration: 0.38, ease: [0.22, 1, 0.36, 1] }
            }}
          >
            <motion.div
              className="michelin-book-3d"
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                rotateY: 0
              }}
              transition={{
                opacity: { duration: 0.8 },
                rotateY: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
              }}
              whileHover={{ rotateY: 12, scale: 1.02 }}
              whileTap={{ scale: 0.992 }}
            >
              <div className="michelin-book-face michelin-book-cover-back">
                <div className="px-7 text-center">
                  <p className="text-2xl font-semibold text-rouge">Bienvenue.</p>
                  <p className="mt-2 text-sm text-[#757575]">Tournez la page.</p>
                </div>
              </div>

              <div className="michelin-book-pages-edge" />
              <div className="michelin-book-spine" />

              <div className="michelin-book-face michelin-book-cover-front">
                <div className="flex h-full flex-col justify-between rounded border-2 border-white/35 px-6 py-8 text-center">
                  <div>
                    <p className="michelin-book-foil text-[10px] font-semibold uppercase tracking-[0.36em]">
                      Le Guide
                    </p>
                    <p className="michelin-book-foil mt-2 text-4xl font-bold leading-none">
                      MICHELIN
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="flex gap-1 text-[#E5C86C]">
                      {[0, 1, 2].map((item) => (
                        <svg
                          key={item}
                          className="h-4 w-4 michelin-star-glow"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M12 2l2.6 6.9L22 10l-5.5 4.7L18.2 22 12 18l-6.2 4 1.7-7.3L2 10l7.4-1.1z" />
                        </svg>
                      ))}
                    </div>
                    <p className="michelin-book-foil text-[9px] font-semibold uppercase tracking-[0.3em]">
                      France 2026
                    </p>
                  </div>

                  <div>
                    <p className="michelin-book-foil text-[9px] font-semibold uppercase tracking-[0.3em]">
                      Edition
                    </p>
                    <p className="michelin-book-foil mt-1 text-xl font-semibold">
                      Nouvelle Generation
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.button>
        ) : null}

        <motion.div
          className="michelin-physical-pages"
          aria-hidden={!contentVisible}
          style={{ visibility: isClosed ? "hidden" : "visible" }}
          initial={false}
          animate={{
            opacity: isOpenLike ? 1 : 0,
            scaleX: isOpenLike ? 1 : 0.78
          }}
          transition={{
            opacity: { duration: isOpenLike ? 0.24 : 0.2 },
            scaleX: { duration: 1.55, ease: [0.18, 0.88, 0.18, 1] }
          }}
        >
          <motion.div
            className="michelin-physical-content"
            initial={false}
            animate={{
              opacity: contentVisible ? 1 : 0,
              y: 0
            }}
            transition={{
              duration: 0
            }}
          >
            {children}
          </motion.div>
        </motion.div>

        {isOpening ? (
          <motion.div
            className="michelin-opening-fold"
            aria-hidden="true"
            initial={{ opacity: 0, x: 0, scaleY: 0.96 }}
            animate={{
              opacity: [0, 0.88, 0.42, 0],
              x: [0, -10, -18, -24],
              scaleY: [0.96, 1, 0.98, 0.96]
            }}
            transition={{
              duration: 1.95,
              times: [0, 0.28, 0.72, 1],
              ease: [0.18, 0.88, 0.18, 1]
            }}
          />
        ) : null}

        <motion.div
          className="michelin-physical-paper-depth"
          style={{ visibility: isClosed ? "hidden" : "visible" }}
          initial={false}
          animate={{ opacity: isOpenLike ? 1 : 0 }}
          transition={{ duration: 1 }}
        />
      </motion.div>
    </div>
  );
}
