import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Music, BookOpen, Mic } from 'lucide-react';

const Home: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const featureVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h1>Welcome to Jazz & Rock Music</h1>
          <p>Discover the world of music through interactive tools, lessons, and performances</p>
          <div className="hero-buttons">
            <Link to="/piano" className="btn btn-primary btn-large">
              Try the Interactive Piano
            </Link>
            <Link to="/lessons" className="btn btn-secondary btn-large">
              Explore Lessons
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="features">
        <motion.div 
          className="section-title"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2>What We Offer</h2>
          <p>Explore our interactive tools and resources to enhance your musical journey</p>
        </motion.div>

        <motion.div 
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="card feature-card" variants={featureVariants}>
            <div className="feature-icon">
              <Music size={48} />
            </div>
            <h3>Interactive Piano</h3>
            <p>Play the piano directly in your browser. Learn notes, chords, and melodies with our interactive tool.</p>
            <Link to="/piano" className="btn btn-primary">Try It Now</Link>
          </motion.div>

          <motion.div className="card feature-card" variants={featureVariants}>
            <div className="feature-icon">
              <BookOpen size={48} />
            </div>
            <h3>Music Lessons</h3>
            <p>Access comprehensive music lessons for all skill levels. Learn theory, technique, and more.</p>
            <Link to="/lessons" className="btn btn-primary">Start Learning</Link>
          </motion.div>

          <motion.div className="card feature-card" variants={featureVariants}>
            <div className="feature-icon">
              <Mic size={48} />
            </div>
            <h3>Live Performances</h3>
            <p>Watch and learn from live performances. Get inspired by professional musicians.</p>
            <Link to="/about" className="btn btn-primary">Discover More</Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home; 