import { themes } from 'prism-react-renderer';

export default {
  title: 'MarketGenius 360',
  tagline: 'Smart E-commerce Management Platform',
  url: 'https://docs.marketgenius360.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'marketgenius360',
  projectName: 'marketgenius360',

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/marketgenius360/marketgenius360/edit/main/docs/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/marketgenius360/marketgenius360/edit/main/blog/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'MarketGenius 360',
      logo: {
        alt: 'MarketGenius 360 Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Documentation',
        },
        {
          type: 'doc',
          docId: 'api/intro',
          position: 'left',
          label: 'API Reference',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          href: 'https://github.com/marketgenius360/marketgenius360',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api/intro',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/marketgenius360',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/marketgenius360',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/marketgenius360/marketgenius360',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} MarketGenius 360. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
    },
  },
};