import React from "react";
import { EnhancedText } from "../components/EnhancedText";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">nimi pi ilo Akesi</h1>
          <EnhancedText
            text={`ilo Akesi li pona tawa sina lon ni: sina wile kama sona e toki pona. ilo Akesi li wile pana e sona pona tawa sina. ona li wile e ni: sina musi, sina pali, sina kama sona.

toki pona li toki pali pi jan Sonja Lang. ona li open e toki ni lon tenpo sike 2001. toki pona li jo e nimi lili. ona li jo e nasin toki lili. tan ni la jan li ken toki e ijo suli kepeken toki lili.

ilo Akesi li pana e ijo ni tawa sina:
- sona sin pi nimi en nasin toki pona
- pali musi tawa ni: sina awen e sona sina
- ilo nimi tawa ni: sina ken lukin kepeken wawa lili
- nanpa pona tawa ni: sina sona e kama sona sina
- kulupu tawa ni: sina ken toki tawa jan ante

sina sona ala sona e toki pona la ilo Akesi li wile pana e pona tawa sina. o open e kama sona pi toki pona kepeken ilo Akesi!`}
          />
        </div>
        <div className="w-full md:w-1/2">
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
      </div>
    </div>
  );
};

export default AboutPage;
