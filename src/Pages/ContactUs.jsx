import React, { useState } from 'react';
import Nav from '../Components/Nav';  // Corrected path for Nav component

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Handle form submission here
  };

  return (
    <div className="bg-[linear-gradient(114.91deg,_#BEE2EF_7.73%,_#73C1DE_103.62%)] text-white">
      {/* Include Nav here */}
      <Nav />

      <div className="container mx-auto px-10 flex flex-col items-center space-y-10 pt-20">
        {/* Header Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-black leading-relaxed">
            Contact <span className="text-blue-600">Us</span>
          </h1>
          <p className="text-lg text-gray-700">
            We would love to hear from you! Reach out for any queries or feedback.
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="w-full max-w-lg bg-white/40 backdrop-blur-lg rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600"
                placeholder="Your Name"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600"
                placeholder="Your Email"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-gray-800 font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="px-4 py-2 rounded-lg bg-transparent text-gray-800 focus:outline-none border border-gray-400 focus:border-blue-600"
                placeholder="Your Message"
                rows="4"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2"
            >
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
