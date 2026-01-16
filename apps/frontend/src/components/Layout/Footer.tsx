import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
      ],
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Careers', href: '/careers' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Cookie Policy', href: '/cookies' },
      ],
    },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com/crypture', icon: 'twitter' },
    { name: 'GitHub', href: 'https://github.com/crypture', icon: 'github' },
    { name: 'Discord', href: 'https://discord.gg/crypture', icon: 'discord' },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center space-x-2"
            >
              <img
                className="h-8 w-auto"
                src="/logo/svg/crypture-logo-negative-space-monochrome.svg"
                alt="Crypture"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
                Crypture
              </span>
            </a>
            <p className="text-gray-500 text-base">
              Track your crypto clearly. Simple. Fast. Accessible.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{item.name}</span>
                  <i
                    className={`fab fa-${item.icon} h-6 w-6`}
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-3 md:gap-8">
              {footerLinks.map((section) => (
                <div key={section.title} className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                    {section.title}
                  </h3>
                  <ul className="mt-4 space-y-4">
                    {section.links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-base text-gray-500 hover:text-gray-900"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {currentYear} Crypture. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
