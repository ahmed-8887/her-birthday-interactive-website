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
    { id: 'memories', title: 'Heartfelt Message', subtitle: 'Written in the stars' },
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
    
    // Step 5 Heartfelt Message
    memoriesTitle: "Dil mein rakhi kuch baatein...",
    memoriesSubtitle: "...jo tum tak pohanchani hain",
    memoriesParagraphs: [
      "Aaj tumhara birthday hai, aur is khaas din par main tumse kuch aisa kehna chahta hoon jo shayad main aam dinon mein theek se keh nahi pata. Zindagi mein kuch log aise hote hain jinki ahmiyat waqt ke saath samajh aati rehti hai, aur tum mere liye unhi logon mein se ho. Tumhare saath guzre hue lamhe, choti choti baatein aur woh yaadein jo shayad us waqt itni khaas mehsoos nahi hui thin, aaj un sab ki value aur zyada samajh aati hai.",
      "Main yeh nahi chahta ke tumhara birthday sirf ek normal wish, kuch pictures aur do chaar lafzon tak reh jaye. Main chahta hoon ke is baar tum meri woh baatein bhi suno jo shayad main pehle kehne mein fail raha. Kuch baatein jo dil mein reh gayin, kuch cheezein jo waqt ke saath samajh aayin, aur kuch feelings jo shayad kabhi sahi words mein tum tak nahi pohanch sakin.",
      "Is liye aaj, tumhare birthday par, main tumhare liye sirf ek wish nahi laya. Main kuch yaadein, kuch ehsaas aur kuch baatein laya hoon... jo main chahta hoon ke tum ek ek karke meri taraf se suno."
    ],
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
    message: "Meri dil se dua hai ke tumhari zindagi ka yeh naya saal tumhare liye bohat si khushiyan, sukoon aur khoobsurat lamhe lekar aaye.",
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
        title: "Ek Khamosh Raat",
        text: "Woh shaam jab hum sitaron ke neeche baith kar itni der tak baatein karte rahe ke kuch der ke liye aisa laga jaise duniya ki baaki har cheez kahin door reh gayi ho.",
        type: "memory",
        x: 22,
        y: 28,
      },
      {
        id: 2,
        title: "Ek Muskurahat Saath",
        text: "Tumhari woh muskurahat jo tumhein khud bhi pata nahi hota ke tumhare chehre par aa gayi hai... shayad meri sabse pasandeeda cheez hai. Bas tumhein yun khush dekhna hi mere liye bohat khaas hai.",
        type: "message",
        x: 78,
        y: 22,
      },
      {
        id: 3,
        title: "Meri Dua Tumhare Liye",
        text: "Meri dil se dua hai ke tumhare har din mein sukoon ho, tumhari hansi kabhi kam na ho, aur tumhari zindagi hamesha un khushiyon se bhari rahe jo tumhare chehre par sachchi muskurahat le aayein.",
        type: "wish",
        x: 18,
        y: 68,
      },
      {
        id: 4,
        title: "Tumhari Meherbani",
        text: "Tum jis tarah apne aas paas ke logon ki fikr karti ho aur unki choti choti baaton ka bhi khayal rakhti ho, woh tumhein aur bhi khaas banata hai. Tumhara dil bohat khoobsurat hai, aur shayad tumhein khud bhi andaza nahi ke tumhari yeh kindness doosron ke liye kitni meaningful hoti hai.",
        type: "message",
        x: 82,
        y: 64,
      },
      {
        id: 5,
        title: "Ek Pasandeeda Lamha",
        text: "Woh achanak hone wali khamosh si baat-cheet, jab kuch der ke liye waqt jaise tham sa gaya tha aur bas hum dono ki baatein hi reh gayi thin.",
        type: "memory",
        x: 50,
        y: 18,
      },
      {
        id: 6,
        title: "Be-Inteha Sitare",
        text: "Zindagi humein chahe kitni bhi door le jaye, meri yeh choti si duniya hamesha tumhare liye yahin rahegi.",
        type: "wish",
        x: 34,
        y: 78,
      },
      {
        id: 7,
        title: "Hamesha Khaas",
        text: "Duniya mein bohat si khoobsurat cheezein hain, lekin meri zindagi mein tumhara aana un sab mein se mere liye sabse khaas tohfa hai.",
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
      text: "Kabhi kabhi kisi insaan ki ahmiyat humein us waqt samajh aati hai jab hum apni purani baaton aur lamhon ko dobara sochte hain. Tum mere liye sirf ek naam ya ek yaad nahi ho. Tum meri zindagi ke un khoobsurat hisson mein se ho jinhein main chahe jitna waqt guzar jaye, dil se alag nahi kar sakta. Shayad main hamesha yeh baat sahi tareeqe se keh nahi saka, lekin tumhari ahmiyat mere liye bohat zyada hai.",
      smallLabel: "01",
      styleVariant: "centered",
    },
    {
      id: 2,
      text: "Tumhare saath guzre hue kuch lamhe aaj bhi yaad aate hain. Kuch bohat simple thay, lekin unki value baad mein samajh aayi. Kisi baat par hansna, kisi choti si baat ka yaad reh jana, ya bas tumhara apne tareeqe se hona... yeh sab cheezein waqt ke saath aur meaningful lagti gayi hain. Shayad isi liye kuch yaadein waqt ke saath purani nahi hotin, bas unka matlab aur gehra hota jata hai.",
      smallLabel: "02",
      styleVariant: "leftAligned",
    },
    {
      id: 3,
      text: "Bohat si baatein aisi hoti hain jo insaan us waqt keh nahi pata jab kehni chahiye hoti hain. Kabhi words nahi milte aur kabhi insaan khud nahi samajh pata ke apne dil ki baat kis tarah saamne rakhe. Mere saath bhi aisa hi raha. Kuch feelings aur kuch baatein mere andar reh gayin jo shayad tum tak us tarah nahi pohanch sakin jis tarah main chahta tha. Aaj tumhare birthday par bas itna chahta hoon ke tum un baaton ko meri taraf se mehsoos kar sako.",
      smallLabel: "03",
      styleVariant: "heartGlow",
    },
    {
      id: 4,
      text: "Aaj main tumhare liye sirf yeh wish nahi karna chahta ke tumhara birthday acha guzre. Main chahta hoon ke tumhari zindagi mein aise din aur log zyada hon jo tumhein genuinely khush rakhein. Tumhein woh sukoon mile jo dil ko halka kar de, woh khushi mile jo kisi wajah ki mohtaj na ho, aur tumhare chehre par woh muskurahat rahe jo tum par hamesha achi lagti hai. Jo kuch bhi tum dil se chahti ho, umeed hai waqt ke saath tumhein woh sab mile.",
      smallLabel: "04",
      styleVariant: "largeTypography",
    },
    {
      id: 5,
      text: "Waqt ke saath insaan bohat si cheezein samajhta hai jo shayad us waqt nazar nahi aatin. Main ne bhi kuch cheezein der se samjhi hain. Kisi ki feelings ko samajhna, kisi ki value karna aur kisi ki presence ko taken for granted na lena... yeh sab baatein sirf kehne se nahi, samajhne aur apne actions se prove hoti hain. Aur shayad kuch log humein yeh sab cheezein samjhane ke liye hamari zindagi ka hissa bante hain.",
      smallLabel: "05",
      styleVariant: "starSurrounded",
    },
    {
      id: 6,
      text: "Toh aaj, sab baaton se pehle, main chahta hoon ke tum apna din enjoy karo aur yeh yaad rakho ke tumhari zindagi aur tumhari khushi matter karti hai. Tumhari birthday par meri sabse sincere wish tumhare liye yahi hai ke aane wala saal tumhare liye pichle saal se zyada khoobsurat ho. Aur chahe zindagi humein kisi bhi mod par le jaye, tumhare liye meri dil se dua hamesha yahi rahegi ke tum khush raho, sukoon mein raho aur tumhein woh sab mile jiski tum haqdar ho.",
      smallLabel: "06",
      styleVariant: "minimalRedLine",
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
