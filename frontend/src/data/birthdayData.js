/**
 * Centralized configuration for "Her Birthday" website.
 * Update these values to personalize the experience.
 */

export const themeConfig = {
  colors: {
    black: '#0B0B0F',
    red: '#E63946',
    pink: '#FF4F81',
    white: '#FFFFFF',
    darkSurface: '#12121A',
    mutedText: '#9A9AA5',
  },
  fonts: {
    heading: 'Cormorant Garamond, Georgia, serif',
    body: 'Plus Jakarta Sans, sans-serif',
  },
};

export const birthdayData = {
  // Birthday Person's Information
  recipient: {
    name: "My Special Someone",
    nickname: "Star",
    birthDate: "2026-08-30", // Format: YYYY-MM-DD
  },

  // Planned Experience Sections (Identifiers for smooth section tracking)
  sections: [
    { id: 'intro', title: 'Welcome', subtitle: 'A journey written in the stars' },
    { id: 'star-journey', title: 'Interactive Star Journey', subtitle: 'Connecting our moments' },
    { id: 'secret-gift', title: 'Secret Gift', subtitle: 'Unlocked just for you' },
    { id: 'memories', title: 'Memories & Photos', subtitle: 'Snapshots of love' },
    { id: 'messages', title: 'Personal Messages', subtitle: 'Words from the heart' },
    { id: 'reveal', title: 'Birthday Reveal', subtitle: 'Make a wish' },
    { id: 'universe', title: 'Our Little Universe', subtitle: 'Forever and always' },
  ],

  // Personal Messages (Centralized repository for all interactive texts)
  messages: {
    heroTagline: "Written in the stars, built just for you.",
    heroSubtitle: "A private interactive universe crafted to celebrate your special day.",
    introText: "Welcome to a small digital space created entirely in your honor...",
    
    // Step 4 Secret Gift Messages
    giftText1: "Okay... maybe the real surprise isn't inside the box.",
    giftText2: "It's everything waiting for you next. ❤️",
    
    // Step 5 Memories Messages
    memoriesTitle: "A few little moments...",
    memoriesSubtitle: "Some memories deserve their own little place.",
    memoriesEndText: "And there are still a few things I want to tell you...",

    // Step 6 Messages Opening & Reveal Texts
    messagesOpeningTitle: "There are a few things...",
    messagesOpeningSubtitle: "...I've been wanting to tell you.",
    messagesFinalText1: "And now...",
    messagesFinalText2: "It's finally time.",

    wishes: [],
  },

  // Step 7 Birthday Reveal Data
  birthdayReveal: {
    title: "Happy Birthday",
    name: "My Special Someone",
    message: "I hope this year brings you more beautiful moments than you can count.",
    finalText1: "But this isn't the end...",
    finalText2: "There's one last place I want to take you.",
  },

  // Step 8 Universe Experience Data
  universe: {
    openingTitle1: "And this...",
    openingTitle2: "...is my favorite part.",
    welcomeText: "Welcome to our little universe.",
    allDiscoveredText1: "You found every little piece.",
    allDiscoveredText2: "But there's one thing I wanted you to remember...",
    finalName: "My Special Someone",
    finalSubtitle: "You are loved.",
    finalMessage: "More than words in any universe could ever describe.",
    signature: "Made with ❤️, just for you.",
    author: "With all my love",
    stars: [
      {
        id: 1,
        title: "A Quiet Night",
        text: "The evening we sat under the stars and talked until everything else faded away.",
        type: "memory",
        x: 22,
        y: 28,
      },
      {
        id: 2,
        title: "A Shared Smile",
        text: "The way you smile without realizing it—that's my favorite view in the world.",
        type: "message",
        x: 78,
        y: 22,
      },
      {
        id: 3,
        title: "My Wish For You",
        text: "May your days always be filled with warmth, endless laughter, and boundless joy.",
        type: "wish",
        x: 18,
        y: 68,
      },
      {
        id: 4,
        title: "Your Kindness",
        text: "You care so deeply for everyone around you. Your heart is truly special.",
        type: "message",
        x: 82,
        y: 64,
      },
      {
        id: 5,
        title: "A Favorite Moment",
        text: "That unexpected quiet conversation where time felt like it stood still.",
        type: "memory",
        x: 50,
        y: 18,
      },
      {
        id: 6,
        title: "Endless Starlight",
        text: "No matter how far we go, this little universe will always be right here for you.",
        type: "wish",
        x: 34,
        y: 78,
      },
      {
        id: 7,
        title: "Forever Cherished",
        text: "Out of all the galaxy's wonders, finding you was the greatest gift of all.",
        type: "message",
        x: 66,
        y: 78,
      },
    ],
  },

  // Step 6 Personal Messages Entries (One at a time reveal structure)
  personalMessages: [
    {
      id: 1,
      text: "You make ordinary days feel special.",
      smallLabel: "01",
      styleVariant: "centered",
    },
    {
      id: 2,
      text: "I love the way your eyes light up when you talk about things you care about.",
      smallLabel: "02",
      styleVariant: "leftAligned",
    },
    {
      id: 3,
      text: "Thank you for being my favorite part of every single day.",
      smallLabel: "03",
      styleVariant: "heartGlow",
    },
    {
      id: 4,
      text: "You are stronger, kinder, and more wonderful than you know.",
      smallLabel: "04",
      styleVariant: "largeTypography",
    },
    {
      id: 5,
      text: "I'm so grateful that out of all the stars in the sky, I found you.",
      smallLabel: "05",
      styleVariant: "starSurrounded",
    },
    {
      id: 6,
      text: "No matter where life takes us, you will always have my heart.",
      smallLabel: "06",
      styleVariant: "minimalRedLine",
    },
  ],

  // Step 5 Memory Photo Gallery Data
  memories: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
      caption: "A quiet starlit evening together.",
      date: "Under the stars",
      rotation: -4,
      desktopPos: { top: '15%', left: '8%', width: '220px', zIndex: 10 },
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
      caption: "One of my absolute favorite smiles.",
      date: "Golden hour",
      rotation: 3,
      desktopPos: { top: '8%', left: '42%', width: '240px', zIndex: 12 },
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop",
      caption: "Laughter that makes time stand still.",
      date: "Summer afternoon",
      rotation: -2,
      desktopPos: { top: '12%', left: '72%', width: '220px', zIndex: 11 },
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
      caption: "Small moments that mean everything.",
      date: "Special day",
      rotation: 5,
      desktopPos: { top: '50%', left: '18%', width: '230px', zIndex: 14 },
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      caption: "Forever keeping this memory safe.",
      date: "Quiet moment",
      rotation: -3,
      desktopPos: { top: '48%', left: '58%', width: '240px', zIndex: 13 },
    },
  ],

  // Background Music Configuration
  music: {
    title: "Romantic Ambient Theme",
    artist: "Her Birthday",
    src: "/src/assets/music/bg-music.mp3",
    autoPlayPrompt: true,
  },
};
