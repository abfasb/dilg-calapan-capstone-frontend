import React from "react";

const AboutSection: React.FC = () => {
  return (
    <section
      id="about"
      className="py-16 px-5 md:px-10 bg-gradient-to-b from-gray-50 to-white relative"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center md:space-x-10">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 leading-tight">
            About the Department of the Interior and Local Government
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
            At DILG, we are committed to fostering peace, order, and good
            governance across every corner of the Philippines. Our mission is
            to create a safe, secure, and empowered society where every citizen
            thrives with dignity and opportunity.
          </p>
          <a
            href="#programs"
            className="inline-block bg-blue-800 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-900 transition-all duration-300"
          >
            Learn About Our Initiatives
          </a>
        </div>

        {/* Right Content */}
        <div className="md:w-1/2 mt-10 md:mt-0 relative">
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center shadow-lg">
            <img src="https://i.ibb.co/HhY2hQs/324585996-672995961192255-7724434555764467102-n.jpg" className="w-full" alt="asdas" />
          </div>
          <div className="absolute top-[-30px] right-[-30px] bg-blue-700 text-white p-4 rounded-full shadow-md hidden lg:block">
            <span className="text-lg font-bold">Empowering Communities</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-blue-100 rounded-full blur-lg opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-20"></div>
    </section>
  );
};

export default AboutSection;
