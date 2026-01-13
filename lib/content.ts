export type NavLink = {
  href: string;
  label: string;
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  helper: string;
  bullets: string[];
};

export const siteContent = {
  metadata: {
    title: "I've Got You Covered | Planar vs FinFET vs GAA",
    description:
      "I've Got You Covered — a semiconductor-flavored single page explaining Planar, FinFET, and GAA transistors for NE406."
  },
  branding: {
    mark: "NE",
    course: "NE406",
    title: "I've Got You Covered",
    subtitle: "Semiconductor Devices & Fabrication"
  },
  navLinks: [
    { href: "#hero", label: "Intro" },
    { href: "#tiny-switch", label: "Switch" },
    { href: "#planar", label: "Planar" },
    { href: "#shrink", label: "Short-Channel" },
    { href: "#finfet", label: "FinFET" },
    { href: "#gaa", label: "GAA" },
    { href: "#playground", label: "Playground" },
    { href: "#recap", label: "Recap" }
  ],
  hero: {
    eyebrow: "Introduction",
    title: "Tiny Switches,",
    highlight: "Big Leaps",
    description:
      "I've Got You Covered is your NE406 pocket guide to how transistors evolved from flat to finned to all-around designs. ",
    ctaLabel: "Start Exploring!",
    helper:
      "Scroll down to meet Planar, FinFET, and GAA",
    bullets: [
      "Transistors act like microscopic on/off switches for electricity.",
      "Modern chips evolved from planar to FinFET to GAA to improve gate control.",
      "Better gate control means more current ON, less leakage OFF, faster switching."
    ]
  },
  sections: {
    tinySwitch: {
      id: "tiny-switch",
      eyebrow: "Transistor as a switch",
      title: "The Transistor – A Tiny Electric Switch",
      subtitle:
        "Think of it as a teeny-tiny light switch or water faucet for electricity.",
      body: [
        "A transistor’s gate acts like a switch handle: voltage high opens a conductive channel from source to drain (1), voltage low shuts it off (0). Billions of these rapid switches shape every digital operation.",
        "The perfect switch allows max current ON and almost none OFF. As devices shrink, keeping leakage low becomes the challenge."
      ],
      chips: ["Gate OFF / ON"],
      
      takeaways: {
        title: "Key Takeaways",
        items: [
          "Gate ON → current flows; Gate OFF → current blocked.",
          "Switches fire billions of times per second.",
          "Great switches mean strong ON current and tiny leakage."
        ],
        badge: { tone: "e" as const, label: "Helper: Gate = switch handle" }
      }
    },
    planar: {
      id: "planar",
      eyebrow: "Planar MOSFET",
      title: "Planar Transistor – The Flat Classic",
      subtitle: "A flat little switch that launched the computer age.",
      body: [
        "“Planar” means all regions sit on a flat surface. The gate presses the channel from above; shrinking to tens of nanometers weakens that control, letting leakage sneak under.",
        "The design was easy to manufacture and powered Moore’s Law for decades—until short-channel effects raised off currents."
      ],
      chips: ["Slider: Channel Length", "Long → Short (leakier)"],
      visualNote:
        "Flat silicon with a gate on top. At normal size the gate blocks current; at ultra-short length a faint glow leaks underneath.",
      
    },
    shrink: {
      id: "shrink",
      eyebrow: "Scaling",
      title: "The Shrinking Challenge – When Off Isn’t Really Off",
      subtitle: "Making transistors tiny caused a pesky leak problem.",
      body: [
        "As channels shortened, the gate couldn’t pinch the channel fully. Leakage rose, wasting power like a dripping faucet.",
        "Engineers needed more gate surface on the channel—wrap-around control—to tame leakage and keep scaling."
      ],
      callout: { tone: "h" as const, label: "Idea: hug the channel from more sides" },
      visualNote:
        "Slider placeholder — Transistor Size: Large (no leak) → Tiny (leak)."
    },
    finfet: {
      id: "finfet",
      eyebrow: "FinFET",
      title: "FinFET – The 3D “Fish Fin” Transistor",
      subtitle: "A fin-shaped channel that the gate hugs from three sides.",
      body: [
        "The channel stands vertically like a fin. A U-shaped gate wraps three faces, boosting electrostatic control and cutting leakage.",
        "Multiple fins under one gate add drive strength—like extra lanes for current."
      ],
      chips: ["Slider: Number of Fins (1 → 3)", "Toggle gate OFF / ON"],
      takeaways: {
        title: "Key Takeaways",
        items: [
          "3D fin with gate on three sides → tighter control than planar.",
          "Lower leakage, higher drive; fins can be multiplied for width.",
          "Extended Moore’s Law through the 2010s at ~5–3 nm nodes."
        ],
        
      }
    },
    gaa: {
      id: "gaa",
      eyebrow: "GAA",
      title: "GAA Transistor – Gate-All-Around “Ultimate Hug”",
      subtitle: "Wrapping the channel on all sides for maximum control.",
      body: [
        "Nanowire or nanosheet channels are completely encircled by the gate—top, bottom, all around. Leakage reduced.",
        "To increase the current without taking up more space, stack the sheets vertically. Also, adjust the sheet width to get the best performance for the power you need."
      ],
      chips: ["Slider: Number of Channels (1 → 3)", "Gate OFF / ON"],
      takeaways: {
        title: "Key Takeaways",
        items: [
          "Gate wraps 100% of channel surface → best electrostatic control.",
          "Stacked nanosheets raise drive current without extra width.",
          "Manufacturing is tougher but enables 2 nm and beyond."
        ],
        
      }
    },
    playground: {
      id: "playground",
      eyebrow: "Compare",
      title: "Transistor Playground – Compare the Designs",
      subtitle: "Pick a device, toggle its gate, and imagine how leakage changes."
    },
    recap: {
      id: "recap",
      eyebrow: "Wrap up",
      title: "Recap & Quiz – Wrapping Up the Journey",
      subtitle: "Who wins the gate control game?",
      body: [],
      quiz: {
        title: "Quiz",
        question:
          "Which transistor has the strongest gate control over the channel?",
        options: [
          { label: "A. Planar MOSFET" },
          { label: "B. FinFET" },
          { label: "C. Gate-All-Around (GAA) transistor", isCorrect: true }
        ],
        answerNote: "GAA surrounds the channel fully, almost eliminating leakage."
      },
      cardsTitle: "Transistor Cards"
    }
  },
  transistorCards: [
    {
      tag: "Planar",
      title: "Flat classic — gate on top",
      summary:
        "A planar MOSFET lives on a flat silicon surface; the gate presses from one side only, which eventually leaks at tiny lengths.",
      pros: ["Easy fab", "Moore’s Law starter", "Simple layout"],
      cons: ["Weak off control", "Short-channel leakage"],
      focus: "One-sided gate"
    },
    {
      tag: "FinFET",
      title: "Fin raised — gate hugs 3 sides",
      summary:
        "The channel stands up like a fin so the gate can wrap around three sides. Better electrostatics, far less leakage.",
      pros: ["Tighter control", "Multiple fins = more drive", "Scaling rescue"],
      cons: ["Complex etch", "Fin variability"],
      focus: "Tri-side hug"
    },
    {
      tag: "GAA",
      title: "Gate-all-around — ultimate hug",
      summary:
        "Nanowire or nanosheet channels fully wrapped by the gate for 360° control. Minimal leakage, stackable sheets.",
      pros: ["Best gate control", "Low leakage", "Stacked channels"],
      cons: ["Harder process", "New tooling"],
      focus: "360° wrap"
    }
  ],
  playground: {
    chip: "Compare",
    title: "FinFET vs GAA",
    description:
      "placeholder",
    badges: ["Shape", "E-Field", "Process", "Leakage"],
    helper:
      "Toggle the gate and imagine leakage shrinking from Planar → FinFET → GAA. The gate “hug” tightens, letting almost no current sneak through in the OFF state.",
    
  },
  footer: {
    courseLabel: "NE406",
    courseName: "Semiconductor Devices & Fabrication",
    blurb: "Content © 2026 Yueqiao Wang. All rights reserved.",
  }
};

export type SiteContent = typeof siteContent;
