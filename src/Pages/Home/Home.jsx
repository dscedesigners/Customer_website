import React, { useEffect, useState } from 'react';
import Nav from "../../Components/Nav";
import Footter from '../../Components/Footter';
import Showcase2 from './Showcase2';
import Products1 from './Products1';
import Services1 from './Services1';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase.config';

function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-100 to-blue-50">
      <Showcase2 />
      <Products1 />
      <Services1 />
      <Footter />
    </div>
  );
}

export default Home;
