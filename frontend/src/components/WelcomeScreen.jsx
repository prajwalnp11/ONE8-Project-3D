import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import "./WelcomeScreen.css";

function WelcomeScreen({ onComplete }) {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    const redirect = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirect);
    };
  }, [onComplete]);

  return (
    <motion.section
  className="welcome-screen"
  initial={{ opacity: 1 }}
  animate={{ opacity: 1 }}
  exit={{
    opacity: 0,
    scale: 1.04,
    filter: "blur(12px)",
  }}
  transition={{
    duration: 1,
    ease: "easeInOut",
  }}
>
      <motion.div
        className="welcome-image-wrap"
        initial={{ scale: 1.12, rotateY: -5 }}
        animate={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        <img
          src="/images/one8-welcome.png"
          alt="ONE8 cinematic welcome campaign concept"
          className="welcome-image"
        />
      </motion.div>

      <div className="welcome-overlay" />

      <motion.div
        className="welcome-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="welcome-top">
          <span className="welcome-logo">ONE8<span>.</span></span>
          <span className="welcome-edition">
            INDEPENDENT PORTFOLIO CONCEPT / 2026
          </span>
        </div>

        <div className="welcome-message">
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.45em" }}
            transition={{ duration: 1 }}
          >
            WELCOME TO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            YOUR NEXT
            <br />
            <em>CHAPTER.</em>
          </motion.h1>

          <p className="welcome-tagline">
            DEFINE YOUR OWN GAME.
          </p>
        </div>

        <div className="welcome-bottom">
          <div className="welcome-countdown">
            <motion.span
              key={countdown}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {countdown}
            </motion.span>
            <small>SECONDS</small>
          </div>

          <button
            className="welcome-skip"
            onClick={onComplete}
            type="button"
          >
            EXPLORE NOW <ArrowRight size={17} />
          </button>

          <span className="welcome-disclaimer">
            AI-GENERATED PORTFOLIO CONCEPT · NOT AN OFFICIAL ENDORSEMENT
          </span>
        </div>
      </motion.div>

      <div className="welcome-progress">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 5, ease: "linear" }}
        />
      </div>
    </motion.section>
  );
}

export default WelcomeScreen;