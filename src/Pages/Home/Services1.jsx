import React from 'react';
import sneakers from '../../Utiles/sneakers.png';
import jacket from '../../Utiles/jacket.png';
import hoddie from '../../Utiles/hoddie.png';
import jeans from '../../Utiles/jeans.png';
import watches from '../../Utiles/watches.png';
import swimware from '../../Utiles/swimware.png';
import inners from '../../Utiles/inners.png';
import sunglass from '../../Utiles/sunglass.png';
import footware from '../../Utiles/footware.png';
import suits from '../../Utiles/suits.png';




function Services1() {
  const images = [sneakers,jacket,hoddie,jeans,watches,swimware,inners,sunglass,footware,suits];

  return (
    <section className="p-6 sm:p-10 bg-gradient-to-b from-white to-blue-200 w-full">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-8">Browse With The Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {images.map((image, index) => (
          <div key={index} className=" relative overflow-hidden rounded-xl">

            <div className="relative overflow-hidden rounded-xl">
              <img
                src={image}
                alt={`label`}
                className="w-full h-[22rem] object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services1;
