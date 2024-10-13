import React from "react";
import { EnhancedText } from "../components/EnhancedText";

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">toki lon ilo Akesi</h1>
          <p className="mb-4">
            <EnhancedText
              text={`kama pona tawa Akesi, jan pona tawa kama sona en kama lukin e toki pona! Akesi li pali tawa pana e musi e pali pona tawa sina. sona pi toka pona li musi mute a!`}
            />
          </p>
          <p className="mb-4">
            <a
              href="https://tokipona.org"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              <EnhancedText text="toki pona " />
            </a>
            <EnhancedText
              text={`jan Sonja Lang li pali e ona lon tenpo suno tu ala tu wan (2001), li toki lili pi pona mute en pilin nasa pi toki. Kepeken nimi lili tu wan ala wan (120) taso en toki pona, Toki Pona li wile e pilin seli en sona pi ijo pona taso.  `}
            />
          </p>
          <p className="mb-4">
            <EnhancedText
              text={`Sina wile pana e pali tawa lipu ni, kepeken ante e toki, o toki tawa `}
            />
            jan.kolin@akesi.site.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">About Akesi</h1>
          <p className="mb-4">
            Welcome to Akesi, a companion for learning and exploring the
            wonderful language of{" "}
            <a
              href="https://tokipona.org"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Toki Pona!
            </a>{" "}
            Akesi is designed to make your journey into the world of Toki Pona
            engaging, interactive, and fun.
          </p>
          <p className="mb-4">
            <a
              href="https://tokipona.org"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Toki Pona
            </a>
            , created by Sonja Lang in 2001, is a minimalist constructed
            language known for its simplicity and philosophical approach to
            communication. With only about 120 words and a straightforward
            grammar, Toki Pona encourages clear thinking and a focus on the
            essential. It is described in the book,{" "}
            <a
              href="https://www.amazon.com/gp/product/0978292308"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Toki Pona: The Language of Good
            </a>
            .
          </p>
          <p className="mb-4">
            If you are interested in helping with this site, especially
            contributing or editing stories, please contact
            <a
              href="mailto:jan.kolin@akesi.site"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              jan.kolin@akesi.site
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
