import React, { useEffect, useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import styles from '../styles/modules/modal.module.scss';
import Button from './Button';
import axios from 'axios';

const dropIn = {
  hidden: {
    opacity: 0,
    transform: 'scale(0.9)',
  },
  visible: {
    transform: 'scale(1)',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    transform: 'scale(0.9)',
    opacity: 0,
  },
};

function TodoModal({ type, modalOpen, setModalOpen, name,alt,identity }) {
  const dispatch = useDispatch();
  const [id, setid]=useState('')
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('incompleted');
  useEffect(() => {
    if (type === 'update') {
      setTitle(name);
      setStatus(alt);
      setid(identity)
    } else {
      setTitle('');
      setStatus('incompleted');
    }
  }, [type,name,alt,identity, modalOpen]);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (title === '') {
      toast.error('Please enter a title');
      return;
    }
    if (title && status) {
      if (type === 'add') {
        try{
            await axios.post('/add',{
                title,
                status,
            })
            toast.success('Task added successfully');


          }catch(error){
          toast.error("Error try again")
        }
      }
      if (type === 'update') {
        console.log(id)
        if (name !== title || alt !== status) {
            try{
                await axios.put(`/update/${id}`,{
                    title,
                    status,
                })
                toast.success('Task updated successfully');
    
              }catch(error){
                    toast.error("Error try again")}
        } else {
          toast.error('No changes made');
          return;
        }
    }
    reload()
      setModalOpen(false);
    }
  };

  const reload=()=>{
    window.location.reload(false);
  }

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className={styles.wrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.container}
            variants={dropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div
              className={styles.closeButton}
              onKeyDown={() => setModalOpen(false)}
              onClick={() => setModalOpen(false)}
              role="button"
              tabIndex={0}
              // animation
              initial={{ top: 40, opacity: 0 }}
              animate={{ top: -10, opacity: 1 }}
              exit={{ top: 40, opacity: 0 }}
            >
              <MdOutlineClose />
            </motion.div>

            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
              <h1 className={styles.formTitle}>
                {type === 'add' ? 'Add' : 'Update'} TODO
              </h1>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>
              <div className={styles.buttonContainer}>
                <Button type="submit" variant="primary">
                  {type === 'add' ? 'Add Task' : 'Update Task'}
                </Button>
                <Button variant="secondary" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TodoModal;
