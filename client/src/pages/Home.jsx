import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AITools from '../components/AiTools';
import Testimonial from '../components/Testimonial';
import Plan from '../components/Plan';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <AITools />
      <Testimonial />
      <Plan />
      <Footer />
    </>
  );
};

export default Home;