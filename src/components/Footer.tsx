import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-600 text-white p-4 mt-8">
      <div className="container mx-auto text-center">
        <p className="mt-2 text-sm">
          Content is licensed under{' '}
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-green-200"
          >
            CC BY-SA 4.0
          </a>
          , unless otherwise stated.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
