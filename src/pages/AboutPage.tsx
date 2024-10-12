import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">About Akesi</h1>
      <p className="mb-4">
        Welcome to Akesi, your companion for learning and exploring Toki Pona! Akesi is designed to make your journey into the world of Toki Pona engaging, interactive, and fun.
      </p>
      <p className="mb-4">
        Toki Pona, created by Sonja Lang in 2001, is a minimalist constructed language known for its simplicity and philosophical approach to communication. With only about 120 root words and a straightforward grammar, Toki Pona encourages clear thinking and a focus on the essential.
      </p>
      <h2 className="text-2xl font-semibold mb-2">What Akesi Offers:</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Interactive lessons on Toki Pona vocabulary and grammar</li>
        <li>Practice exercises to reinforce your learning</li>
        <li>A built-in dictionary for quick reference</li>
        <li>Progress tracking to monitor your advancement</li>
        <li>Community features to connect with other learners</li>
      </ul>
      <p className="mb-4">
        Whether you're a complete beginner or looking to deepen your understanding of Toki Pona, Akesi is here to support your language learning journey.
      </p>
      <p>
        Start exploring the beautiful simplicity of Toki Pona with Akesi today!
      </p>
    </div>
  );
};

export default AboutPage;
