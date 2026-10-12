export type Opportunity = {
  id: string;
  title: string;
  company: string;
  description: string;
  skills: string[];
  responsibilities: string[];
};

export const opportunities: Opportunity[] = [
  {
    id: "ai-automation-intern",
    title: "AI Automation Intern",
    company: "TechFlow",
    description:
      "Support development of AI-powered workflows and automation solutions for business processes.",
    skills: ["Python", "AI", "Automation", "APIs"],
    responsibilities: [
      "Help design and prototype automated workflows",
      "Write Python scripts that connect to internal and external APIs",
      "Test AI-assisted features and document results",
      "Collaborate with the team to identify processes to automate",
    ],
  },
  {
    id: "junior-frontend-developer",
    title: "Junior Frontend Developer",
    company: "PixelWorks",
    description: "Help build responsive web interfaces and interactive user experiences.",
    skills: ["HTML", "CSS", "JavaScript", "React"],
    responsibilities: [
      "Build responsive layouts from design mockups",
      "Develop reusable React components",
      "Fix UI bugs and improve accessibility",
      "Participate in code reviews with senior developers",
    ],
  },
  {
    id: "iot-solutions-engineer",
    title: "IoT Solutions Engineer",
    company: "Connected Systems Lab",
    description:
      "Support development of connected systems using sensors, microcontrollers, and software.",
    skills: ["IoT", "Python", "ESP32", "APIs"],
    responsibilities: [
      "Prototype sensor-based devices using ESP32 microcontrollers",
      "Write software to collect and transmit device data",
      "Integrate devices with cloud services through APIs",
      "Test and troubleshoot hardware and software systems",
    ],
  },
];

export const getOpportunity = (id: string) => opportunities.find((o) => o.id === id);
