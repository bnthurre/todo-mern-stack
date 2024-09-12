import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import styles from '../styles/modules/app.module.scss';
import List from './List';

const child = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function AppContent() {
  const [tasks, setTasks] = useState([
    {
      title: "",
      status: "",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:3001/")
      .then((res) => res.json())
      .then((jsonRes) => setTasks(jsonRes));
  }, []);

  var size=0;
 
  return (
    
    <motion.div
    initial="hidden"
    animate="visible"
  >
    {tasks
          .map((data) => {
            size+=1
            })}
    <AnimatePresence>
      {size > 0 ? (
        <div>
          <List/>
        </div>
      ) : (
        <p variants={child} className={styles.emptyText}>
          No Todos
        </p>
      )}
    </AnimatePresence>
  </motion.div>
  );
}

export default AppContent;
