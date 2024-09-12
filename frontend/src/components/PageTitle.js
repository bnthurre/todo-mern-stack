import styles from '../styles/modules/title.module.scss';
import React from 'react';

function PageTitle({ children, ...rest }) {
  return (
    <p className={styles.title} {...rest}>
      {children}
    </p>
  );
}

export default PageTitle;

