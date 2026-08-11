// ============================================================
// PROJECTS DATA
// Single source of truth for the Projects section. To add a new
// project, add a new object here — the markup, cards, and both
// popups (project detail + Project Explorer) are all generated
// from this file, nothing else needs to change.
//
// Fields:
//   id            unique slug, used for the modal instance
//   featured      true = shown on the main screen (max 3 expected)
//   category      short label shown next to the category icon
//   categoryIcon  inline SVG path content for the category icon
//   accent        one of the CSS accent vars: lime, cyan, purple,
//                 blue, gold, pink, orange
//   image         path under assets/images/projects, or null to
//                 fall back to a category-tinted placeholder until
//                 a real screenshot is dropped into content-to-add/projects
//   title, subtitle, oneLiner, cardDescription
//   techStack     array of strings shown as chips on the card
//   repo          GitHub URL, or null to hide the button entirely
//   demo          live URL, or null to hide the button entirely
//   overview, problem, solution, challenges   paragraph strings
//   features      array of strings (Key Features)
//   stack         array of strings (full Technology Stack list)
//   learned       array of strings (What I Learned)
// ============================================================

const PROJECTS_DATA = [
  {
    id: "phishbreaker",
    featured: true,
    order: 1,
    category: "Cybersecurity",
    categoryIcon: '<path d="M12 3 4 6.5V11c0 4.9 3.4 9.4 8 10.5 4.6-1.1 8-5.6 8-10.5V6.5L12 3Z"/><path d="m9.5 12 2 2 3.5-3.5"/>',
    accent: "cyan",
    image: "assets/images/projects/phishbreaker.jpg",
    title: "PhishBreaker",
    subtitle: "AI-Powered Phishing Detection System",
    oneLiner: "Detects malicious URLs using machine learning and real-time threat intelligence.",
    cardDescription: "Detects malicious URLs using machine learning and real-time threat intelligence.",
    techStack: ["Python", "Flask", "Random Forest", "VirusTotal API", "Scikit-learn"],
    repo: "https://github.com/Vedansh-Gupta-VG/phishbreaker",
    demo: null,
    overview: "PhishBreaker combines machine learning with threat intelligence to detect malicious URLs before users become victims of phishing attacks. The system analyzes structural URL features, network information, and external reputation sources to generate an explainable security score.",
    problem: "Phishing attacks continue to evolve and often bypass traditional blacklist-based detection. Users need an intelligent system capable of identifying suspicious URLs in real time before they interact with malicious websites.",
    solution: "Developed a phishing detection platform that extracts URL-based features, predicts malicious behavior using a Random Forest classifier, and enhances decisions with VirusTotal reputation analysis to provide a unified safety score.",
    features: ["Machine Learning URL Classification", "Real-time Safe Score", "VirusTotal Integration", "WHOIS Analysis", "SSL Verification", "DNS Lookup", "Feature Engineering", "Interactive Dashboard"],
    stack: ["Python", "Flask", "Random Forest", "Scikit-learn", "VirusTotal API", "Pandas", "NumPy", "HTML", "CSS", "JavaScript"],
    challenges: "Building reliable phishing detection while reducing false positives and combining multiple intelligence sources into a single prediction.",
    learned: ["Feature engineering for cybersecurity", "Threat intelligence integration", "Model deployment", "Flask application development", "Security focused UI design"]
  },
  {
    id: "equidecide",
    featured: true,
    order: 2,
    category: "Responsible AI",
    categoryIcon: '<circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 2"/>',
    accent: "purple",
    image: "assets/images/projects/equidecide.jpg",
    title: "EquiDecide",
    subtitle: "Context-Aware AI Evaluation Platform",
    oneLiner: "An AI evaluation system that introduces contextual fairness through Opportunity Deficit Scoring.",
    cardDescription: "An AI evaluation system that introduces contextual fairness through Opportunity Deficit Scoring.",
    techStack: ["React", "Flask", "Gemini", "Python", "Machine Learning"],
    repo: "https://github.com/Vedansh-Gupta-VG/EquiDecide",
    demo: "https://equidecide.vercel.app/",
    overview: "EquiDecide addresses algorithmic bias by introducing an Opportunity Deficit Score (ODS), allowing AI systems to make fairer decisions while maintaining transparency through explainable AI.",
    problem: "Traditional AI screening systems apply identical thresholds to everyone, often overlooking structural disadvantages that affect opportunities.",
    solution: "Created a context-aware evaluation engine that dynamically adjusts decision thresholds using Opportunity Deficit Score while generating transparent explanations through an LLM-powered explanation layer.",
    features: ["Opportunity Deficit Score", "Dynamic Threshold Adjustment", "LLM Explainability", "Comparison Dashboard", "Real-time Evaluation", "Policy-backed Decisions", "Streaming Responses", "Analytics Dashboard"],
    stack: ["React", "Flask", "Python", "Gemini API", "Machine Learning", "Vite"],
    challenges: "Designing a fairness metric that improves equity without compromising transparency or introducing uncontrolled bias.",
    learned: ["Responsible AI", "Explainable AI", "Prompt Engineering", "Full Stack Development", "Human-centered AI"]
  },
  {
    id: "mental-health-chatbot",
    featured: true,
    order: 3,
    category: "NLP",
    categoryIcon: '<path d="M4 5h16v10H8l-4 4V5Z"/><path d="M8 9h8M8 12h5"/>',
    accent: "pink",
    image: "assets/images/projects/mental-health-chatbot.jpg",
    title: "Mental Health Support Chatbot",
    subtitle: "AI-Powered Depression Detection using DistilBERT",
    oneLiner: "Detects signs of depression from conversations and provides supportive responses using NLP.",
    cardDescription: "Detects signs of depression from conversations and provides supportive responses using NLP.",
    techStack: ["Python", "DistilBERT", "TensorFlow", "Streamlit", "Transformers"],
    repo: "https://github.com/Vedansh-Gupta-VG/Depression-Detection-Chatbot",
    demo: null,
    overview: "A conversational chatbot powered by DistilBERT that detects signs of depression in user messages and generates supportive responses while maintaining transparency through confidence scores.",
    problem: "Early identification of emotional distress is difficult, and many individuals hesitate to seek immediate support.",
    solution: "Built an NLP-powered chatbot using DistilBERT that classifies text into depression-related categories and responds with empathetic, context-aware messages.",
    features: ["DistilBERT Classification", "Confidence Score", "Interactive Chat", "Conversation History", "Supportive Responses", "Probability Visualization", "Session Management"],
    stack: ["Python", "TensorFlow", "DistilBERT", "Transformers", "Streamlit"],
    challenges: "Balancing prediction accuracy with responsible AI usage in a sensitive domain.",
    learned: ["Natural Language Processing", "Transformer Models", "Model Deployment", "Responsible AI Design", "User Experience for AI Applications"]
  },

  // ---- Project Explorer (the remaining projects, strongest to weakest) ----
  {
    id: "ransomshield",
    featured: false,
    order: 1,
    category: "Cybersecurity & ML Detection",
    categoryIcon: '<path d="M12 3 4 6.5V11c0 4.9 3.4 9.4 8 10.5 4.6-1.1 8-5.6 8-10.5V6.5L12 3Z"/>',
    accent: "cyan",
    image: null,
    title: "RansomShield",
    subtitle: "Dynamic Ransomware Detection & Behavioral Analysis Platform",
    oneLiner: "Behavioral ransomware detection using honeypots, entropy analysis, and machine learning.",
    cardDescription: "Detects ransomware attacks by monitoring file behavior, entropy changes, CPU activity, and network patterns using machine learning.",
    techStack: ["Python", "FastAPI", "Streamlit", "Random Forest", "Isolation Forest"],
    repo: "https://github.com/Vedansh-Gupta-VG/ransomware-detection-system",
    demo: null,
    overview: "RansomShield is a cybersecurity platform designed to detect ransomware before widespread damage occurs. Instead of relying solely on signatures, it continuously analyzes behavioral indicators such as file modifications, entropy changes, CPU spikes, and suspicious network activity to identify active ransomware attacks.",
    problem: "Traditional antivirus solutions often detect ransomware only after encryption has already begun. Organizations need a proactive behavioral detection system capable of identifying malicious activity at an earlier stage.",
    solution: "Developed a behavioral detection engine that combines honeypot monitoring, entropy analysis, resource monitoring, and machine learning to generate a real-time ransomware risk score with forensic logs.",
    features: ["Behavioral Detection Engine", "Honeypot File Monitoring", "Entropy Analysis", "CPU & Disk Activity Monitoring", "Network Traffic Analysis", "Random Forest Classification", "FastAPI Backend", "Interactive Streamlit Dashboard"],
    stack: ["Python", "FastAPI", "Streamlit", "Random Forest", "Isolation Forest", "Scikit-learn", "Watchdog", "Psutil"],
    challenges: "Creating a detection strategy that minimizes false positives while identifying ransomware before large-scale encryption occurs.",
    learned: ["Behavioral Malware Analysis", "Threat Detection", "Machine Learning Pipelines", "System Monitoring", "Cybersecurity Dashboard Design"]
  },
  {
    id: "exam-proctoring-system",
    featured: false,
    order: 2,
    category: "Distributed Computing • Java RMI",
    categoryIcon: '<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M8 21h8M12 18v3"/>',
    accent: "blue",
    image: null,
    title: "Exam Proctoring System",
    subtitle: "Distributed Online Examination Platform using Java RMI",
    oneLiner: "Distributed online examination platform built with Java RMI supporting real-time invigilation, client monitoring, and synchronized exam control.",
    cardDescription: "A distributed examination system that enables one invigilator to monitor and control multiple student machines in real time.",
    techStack: ["Java", "Java RMI", "Swing", "Multi-threading"],
    repo: null,
    demo: null,
    overview: "A Java RMI-based distributed examination platform where a central invigilator manages multiple student clients simultaneously. The system synchronizes exam state, detects disconnections, monitors violations, and supports deployment across localhost, LAN, VPN, or the public internet.",
    problem: "Managing online examinations requires synchronized communication between invigilators and multiple students while ensuring secure monitoring and instant event reporting.",
    solution: "Implemented a distributed client-server architecture using Java RMI with callback mechanisms for real-time synchronization, heartbeat monitoring, and violation reporting.",
    features: ["Real-time Exam Control", "Java RMI Communication", "Bidirectional Callbacks", "Heartbeat Monitoring", "Focus Loss Detection", "Automatic Reconnection", "LAN & ZeroTier Support"],
    stack: ["Java", "Java RMI", "Swing", "Multi-threading", "ZeroTier", "ngrok"],
    challenges: "Maintaining reliable communication across multiple distributed clients while ensuring synchronization during network interruptions.",
    learned: ["Distributed Computing", "Remote Method Invocation", "Concurrent Programming", "Client Server Architecture", "Fault Tolerant Design"]
  },
  {
    id: "plant-species-identifier",
    featured: false,
    order: 3,
    category: "Deep Learning • Computer Vision",
    categoryIcon: '<path d="M12 21s7-4.5 7-11a7 7 0 0 0-14 0c0 6.5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
    accent: "lime",
    image: null,
    title: "Plant Species Identifier",
    subtitle: "Deep Learning Based Plant Classification System",
    oneLiner: "Deep learning based plant recognition supporting multiple CNN architectures with Streamlit interface.",
    cardDescription: "Identifies plant species using transfer learning with multiple CNN architectures through an interactive web application.",
    techStack: ["Python", "TensorFlow", "EfficientNet", "Streamlit"],
    repo: "https://github.com/Vedansh-Gupta-VG/Species_Identifier",
    demo: null,
    overview: "An AI-powered plant recognition platform capable of identifying 91 different plant species using transfer learning. Users can compare multiple deep learning models, perform batch predictions, and provide feedback to continuously improve model performance.",
    problem: "Identifying plant species manually requires expertise and can be time-consuming for students, researchers, and agriculture professionals.",
    solution: "Developed a deep learning application supporting multiple CNN models with an intuitive Streamlit interface for fast and accurate species recognition.",
    features: ["Multi-CNN Model Support", "Batch Image Prediction", "Confidence Scores", "Model Comparison", "Prediction History", "Active Learning Feedback", "Transfer Learning"],
    stack: ["Python", "TensorFlow", "EfficientNet", "ResNet50", "VGG16", "InceptionV3", "Streamlit"],
    challenges: "Balancing prediction accuracy with inference speed while supporting multiple neural network architectures within a single application.",
    learned: ["Transfer Learning", "Computer Vision", "CNN Optimization", "Model Evaluation", "Deep Learning Deployment"]
  },
  {
    id: "smart-notes-repository",
    featured: false,
    order: 4,
    category: "Cloud Computing • AWS",
    categoryIcon: '<path d="M7 18a4.5 4.5 0 0 1-.4-8.98A5.5 5.5 0 0 1 17.3 9.1 4 4 0 0 1 17 18H7Z"/>',
    accent: "gold",
    image: null,
    title: "Smart Notes Repository",
    subtitle: "Cloud-Based OCR Document Search Platform",
    oneLiner: "Cloud-native OCR document search platform built on AWS using S3, SQS, EC2, and DynamoDB.",
    cardDescription: "Transforms uploaded PDFs and images into a searchable cloud knowledge base using OCR and AWS services.",
    techStack: ["AWS", "Python", "Flask", "DynamoDB"],
    repo: "https://github.com/Vedansh-Gupta-VG/Smart-Notes-AWS",
    demo: null,
    overview: "A cloud-native document management platform built on AWS that extracts text from PDFs and images using OCR and stores searchable metadata in DynamoDB, enabling fast full-text document retrieval.",
    problem: "Traditional file storage systems organize documents by filenames, making it difficult to search content inside uploaded files.",
    solution: "Built an event-driven cloud architecture where uploaded documents are automatically processed using OCR and indexed for full-text search.",
    features: ["OCR Extraction", "AWS S3 Storage", "DynamoDB Search", "Amazon SQS Queue", "Event Driven Processing", "Flask API", "Presigned Upload URLs"],
    stack: ["AWS", "Python", "Flask", "Amazon S3", "Amazon EC2", "Amazon DynamoDB", "Amazon SQS", "Tesseract OCR"],
    challenges: "Designing an asynchronous cloud workflow that efficiently processes large numbers of uploaded documents while remaining cost-effective.",
    learned: ["Cloud Architecture", "Event Driven Systems", "OCR Pipelines", "AWS Services", "Backend Scalability"]
  },
  {
    id: "food-donation-platform",
    featured: false,
    order: 5,
    category: "Full Stack Web Development",
    categoryIcon: '<path d="M12 21s-7-4.6-9.5-9.1C.8 8.4 2.4 5 6 5c2 0 3.3 1 4 2 0.7-1 2-2 4-2 3.6 0 5.2 3.4 3.5 6.9C19 16.4 12 21 12 21Z"/>',
    accent: "orange",
    image: null,
    title: "Food Donation Platform",
    subtitle: "Location-Based Food Donation Management System",
    oneLiner: "Location-based web application connecting food donors with nearby receivers using MongoDB.",
    cardDescription: "A full-stack web platform that connects food donors with nearby receivers to reduce food wastage.",
    techStack: ["MongoDB", "Express.js", "Node.js"],
    repo: "https://github.com/Vedansh-Gupta-VG/Foonate",
    demo: null,
    overview: "A MERN-based donation platform where users can register, upload available food, attach images, and discover nearby donations using location-aware search.",
    problem: "Large quantities of edible food go to waste because donors and organizations lack an efficient way to connect locally.",
    solution: "Developed a web platform that allows donors to publish food donations while helping nearby receivers quickly discover available resources.",
    features: ["User Authentication", "Food Donation Listings", "Image Uploads", "Geo-location Support", "MongoDB Database", "Secure Sessions"],
    stack: ["MongoDB", "Express.js", "Node.js", "HTML", "CSS", "JavaScript"],
    challenges: "Handling user authentication, image uploads, and location-based filtering while maintaining a responsive user experience.",
    learned: ["Backend Development", "MongoDB Integration", "Authentication", "REST APIs", "CRUD Applications"]
  },
  {
    id: "face-recognition-attendance-system",
    featured: false,
    order: 6,
    category: "Computer Vision • OpenCV",
    categoryIcon: '<circle cx="12" cy="9" r="3.2"/><path d="M5 20c1.5-4 4.2-6 7-6s5.5 2 7 6"/><rect x="2.5" y="3" width="19" height="18" rx="3"/>',
    accent: "purple",
    image: null,
    title: "Face Recognition Attendance System",
    subtitle: "Automated Attendance using Computer Vision",
    oneLiner: "Attendance automation using OpenCV and the LBPH face recognition algorithm.",
    cardDescription: "Automates classroom attendance using face detection and recognition with OpenCV.",
    techStack: ["Python", "OpenCV", "NumPy"],
    repo: "https://github.com/Vedansh-Gupta-VG/Attendance-Face-Recognition",
    demo: null,
    overview: "A computer vision application that recognizes registered students and automatically records attendance in CSV files using the LBPH face recognition algorithm.",
    problem: "Manual attendance is time-consuming, error-prone, and difficult to manage in large classrooms.",
    solution: "Built an attendance system that detects and recognizes faces in real time, automatically generating attendance records without manual intervention.",
    features: ["Face Detection", "LBPH Recognition", "Automatic Attendance", "CSV Export", "Image Preprocessing", "Model Training"],
    stack: ["Python", "OpenCV", "NumPy", "Pandas", "LBPH"],
    challenges: "Improving recognition consistency under varying lighting conditions and camera angles while maintaining real-time performance.",
    learned: ["Computer Vision", "Image Processing", "Face Recognition", "OpenCV", "Data Preprocessing"]
  }
];
