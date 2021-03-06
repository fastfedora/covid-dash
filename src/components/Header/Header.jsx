import Head from 'next/head'
import RegionSearch from '../RegionSearch';
import styles from './Header.module.scss';


export default function Header({ title }) {
  return (
    <header className={styles.header}>
      <h1>{title}</h1>
      <RegionSearch />
    </header>
  );
}
