import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define the article data structure
interface Article {
  id: number;
  title: string;
  content: string;
}

// Sample article data - four articles
const articles: Article[] = [
  {
    id: 1,
    title: "YAP IN 150 WORDS ABOUT WHY BUREAUCRACY IS SLOW",
    content: "Bureaucracy's glacial pace stems from its inherent structure. Layers of hierarchy, designed for control, introduce bottlenecks."
  },
  {
    id: 2,
    title: "WHY RED TAPE DELAYS PROGRESS",
    content: "Strict regulations and excessive procedures slow decision-making, reducing efficiency in bureaucratic systems."
  },
  {
    id: 3,
    title: "THE COST OF BUREAUCRATIC INEFFICIENCY",
    content: "Delayed processes lead to economic inefficiencies, frustrating both employees and the public relying on services."
  },
  {
    id: 4,
    title: "IS THERE A SOLUTION TO BUREAUCRATIC DELAYS?",
    content: "Streamlining procedures, reducing redundant approvals, and digital transformation can speed up bureaucracy."
  }
];

// Correct clockwise rotation:
// Center (0) → Bottom Right (2) → Hidden (3) → Bottom Left (1) → Center (0)
const positions = [
  { top: "40%", left: "50%", zIndex: 3, scale: 1.2, opacity: 1 }, // Center (0)
  { top: "75%", left: "25%", zIndex: 1, scale: 1, opacity: 0.8 }, // Bottom Left (1)
  { top: "75%", left: "75%", zIndex: 1, scale: 1, opacity: 0.8 }, // Bottom Right (2)
  { top: "120%", left: "50%", zIndex: 0, scale: 0.8, opacity: 0 } // Hidden (3)
];

const ArticleCarousel: React.FC = () => {
  const [articlePositions, setArticlePositions] = useState([0, 1, 2, 3]);
  const [isAnimating, setIsAnimating] = useState(false);

  // Function to rotate positions clockwise
  const rotateClockwise = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setArticlePositions(prev => [
      prev[1],  // Bottom Left → Center
      prev[3],  // Hidden → Bottom Left
      prev[0],  // Center → Bottom Right
      prev[2]   // Bottom Right → Hidden
    ]);
    
    setTimeout(() => setIsAnimating(false), 500);
  };

  useEffect(() => {
    const interval = setInterval(rotateClockwise, 5000);
    return () => clearInterval(interval);
  }, );

  return (
    <div className="relative w-full h-screen bg-foreground text-background font-inter overflow-hidden px-12 -z-10">
      <div className="absolute top-32 left-12">
        <h2 className="text-7xl font-bold">Empower Your<br />Efficiency</h2>
        <p className="mt-12 font-roboto-mono text-2xl">Read up on past articles</p>
      </div>
      
      {articles.map((article, index) => {
        const positionIndex = articlePositions[index];
        const position = positions[positionIndex];
        
        return (
          <motion.div
            key={article.id}
            className="absolute w-64 border border-background p-4"
            initial={false}
            animate={{
              top: position.top,
              left: position.left,
              scale: position.scale,
              zIndex: position.zIndex,
              opacity: position.opacity,
              x: "-50%",
              y: "-50%"
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className="h-40 p-4 text-primary font-roboto-mono text-sm">
              {article.title}
              <br />
              {article.content}
            </div>
            
            <div className="mt-2 flex justify-center">
              <button 
                className="bg-black text-white px-4 py-1 text-center"
                onClick={rotateClockwise}
              >
                See more
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ArticleCarousel;