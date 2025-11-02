import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
  socials: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: 'Emmanuel Calica',
    role: 'Project Manager & Backend Developer',
    image: 'https://i.ibb.co/dw7N7KB0/474862650-1850779965731720-7251136394819950153-n.jpg',
    description: 'Specializes in AI-driven analytics and automation for the project.',
    socials: {
      github: 'https://github.com/emman',
      linkedin: 'https://linkedin.com/in/emman',
      email: 'emman@example.com',
    },
  },
  {
    name: 'Matthew Balinton',
    role: 'Frontend Developer & UI/UX Designer',
    image: 'https://i.ibb.co/8gRDWFTf/Matt-ID-1-1.jpg',
    description: 'Responsible for building an intuitive UI using React and Tailwind.',
    socials: {
      github: 'https://github.com/abfasb',
      linkedin: 'https://linkedin.com/in/',
      email: 'matbalinton@gmail.com',
    },
  },
  {
    name: 'Jamaica Mistiola',
    role: 'System Analyst & Technical Writer',
    image: 'https://i.ibb.co/XTYsNW0/462579078-928813822492507-2147962897797461503-n.jpg',
    description: 'Manages the server, database, and API development for our system.',
    socials: {
      github: 'https://github.com/jamaica',
      linkedin: 'https://linkedin.com/jamaica/',
      email: 'jamaica@gmail.com',
    },
  },
];

const MeetTheTeam = () => {
  return (
    <section className="min-h-screen py-20 px-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Meet the Dream Team</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            The brilliant minds behind our capstone project
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="relative group bg-slate-800 rounded-2xl p-6 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="relative overflow-hidden rounded-xl h-80">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
              </div>

              <div className="mt-6">
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-emerald-400 mt-1">{member.role}</p>
                <p className="text-slate-400 mt-4">{member.description}</p>

                <div className="flex space-x-4 mt-6">
                  {member.socials.github && (
                    <a
                      href={member.socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <FaGithub size={24} />
                    </a>
                  )}
                  {member.socials.linkedin && (
                    <a
                      href={member.socials.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {member.socials.email && (
                    <a
                      href={`mailto:${member.socials.email}`}
                      className="text-slate-300 hover:text-emerald-400 transition-colors"
                    >
                      <FaEnvelope size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetTheTeam;
