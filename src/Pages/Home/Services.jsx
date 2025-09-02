import React from 'react';
import person1 from '../../Utiles/person1.jpg';
import person2 from '../../Utiles/person2.jpg';
import person3 from '../../Utiles/person1.jpg';
import person4 from '../../Utiles/person2.jpg';
import person5 from '../../Utiles/person1.jpg';
import person6 from '../../Utiles/person2.jpg';
import person7 from '../../Utiles/person1.jpg';
import person8 from '../../Utiles/person2.jpg';

function Services() {
  const images = [person1, person2, person3, person4, person5, person6, person7, person8];

  return (
    <section className="p-6 sm:p-10 bg-gradient-to-b from-white to-blue-200 w-full">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Browse With The Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {images.map((image, index) => (
          <div key={index} className="group relative overflow-hidden rounded">

            <div className="relative overflow-hidden rounded">
              <img
                src={image}
                alt={`Men's service ${index + 1}`}
                className="w-full h-40 sm:h-64 md:h-[25rem] object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-110"
              />
            </div>
            <p className="text-center text-blue-900 font-semibold">Men's</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;
