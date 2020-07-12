import App from 'next/app';
import React from 'react';
import '../styles/global.scss';
import styles from './_app.module.scss';

export default function CovidDashApp({ Component, pageProps }) {
  return (
    <div className={styles.root}>
      <Component {...pageProps} />
    </div>
  );
}
