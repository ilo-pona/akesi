import React, { useState } from "react";
import { EnhancedText } from "../components/EnhancedText";
import { fontOptions } from "../config/fontConfig";

const AboutPage: React.FC = () => {
  const [isTableVisible, setIsTableVisible] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8 text-size-base">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">toki lon ilo Akesi</h1>
          <div className="mb-4">
            <EnhancedText
              text={`kama pona tawa Akesi, jan pona tawa kama sona en kama lukin e toki pona! Akesi li pali tawa pana e musi e pali pona tawa sina. sona pi toka pona li musi mute a!`}
            />
          </div>
          <div className="mb-4">
            <a
              href="https://tokipona.org"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              <EnhancedText text="toki pona " />
            </a>
            <EnhancedText
              text={`jan Sonja Lang li pali e ona lon tenpo suno tu ala tu wan (2001), li toki lili pi pona mute en pilin nasa pi toki. Kepeken nimi lili tu wan ala wan (120) taso en toki pona, Toki Pona li wile e pilin seli en sona pi ijo pona taso.  `}
            />
          </div>
          <div className="mb-4">
            <EnhancedText
              text={`Sina wile pana e pali tawa lipu ni, kepeken ante e toki, o toki tawa `}
            />
            jan.kolin@akesi.site.
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">About Akesi</h1>
          <div className="mb-4">
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
          </div>
          <div className="mb-4">
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
          </div>
          <div className="mb-4">
            If you are interested in helping with this site, especially
            contributing or editing stories, please contact
            <a
              href="mailto:jan.kolin@akesi.site"
              className="text-blue-600 hover:text-blue-800 underline ml-1"
            >
              jan.kolin@akesi.site
            </a>
            .
          </div>
          <div className="mb-4">
            <strong>Keyboard Shortcuts:</strong>
            <ul className="list-disc list-inside">
              <li><strong>\</strong> - Toggle between Latin and sitelen pona</li>
              <li><strong>u</strong> - Toggle UCSUR</li>
              <li><strong>[</strong> and <strong>]</strong> - Cycle through fonts</li>
              <li><strong>?</strong> - Toggle hints</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <h4 className="text-lg font-medium mb-2 flex items-center cursor-pointer" onClick={() => setIsTableVisible(!isTableVisible)}>
          <span className={`transform transition-transform ${isTableVisible ? 'rotate-90' : ''} mr-2`}>▶</span>
          Font Credits
        </h4>
        {isTableVisible && (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Font Name</th>
                <th className="p-2 text-left">Creator</th>
                <th className="p-2 text-left">Link</th>
              </tr>
            </thead>
            <tbody>
              {fontOptions
                .filter((font) => font.creator && font.link)
                .map((font) => (
                  <tr key={font.value} className="border-b">
                    <td className="p-2">{font.label}</td>
                    <td className="p-2">{font.creator}</td>
                    <td className="p-2">
                      <a
                        href={font.link}
                        className="text-blue-600 hover:text-blue-800 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {font.link}
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AboutPage;
