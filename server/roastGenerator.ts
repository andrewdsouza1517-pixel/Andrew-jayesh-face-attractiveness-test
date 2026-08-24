import type { ComparisonResult, RoastBreakdown, RoastStyle, RoastIntensity } from '../src/types/experiment.js';

interface RoastOptions {
  style?: RoastStyle;
  intensity?: RoastIntensity;
  history?: string[];
  names?: { A: string; B: string };
}

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export function generateResultAwareRoast(
  result: Partial<ComparisonResult>,
  options: RoastOptions = {}
): RoastBreakdown {
  const { style = 'SAVAGE', intensity = 'SAVAGE', history = [], names } = options;

  const winner = result.winner || 'TIE';
  const probA = result.preference?.A ?? 0.5;
  const probB = result.preference?.B ?? 0.5;

  const winPct = Math.round((winner === 'B' ? probB : probA) * 100);
  const losePct = 100 - winPct;

  const nameA = names?.A || 'Person A';
  const nameB = names?.B || 'Person B';
  
  const winnerName = winner === 'A' ? nameA : winner === 'B' ? nameB : `${nameA} and ${nameB}`;
  const loserName = winner === 'A' ? nameB : winner === 'B' ? nameA : `Both`;

  const attributes = result.attributes || [];
  const topWinnerAttributes = attributes
    .filter((a) => a.winner === winner)
    .map((a) => a.name);

  const primaryAttr = topWinnerAttributes[0] || 'Presentation';

  let marginTier: 'PHOTO_FINISH' | 'CLOSE' | 'CLEAR' | 'DOMINANT' | 'VERY_DOMINANT' | 'BLOWOUT' = 'CLEAR';
  if (winner === 'TIE' || Math.abs(probA - probB) <= 0.03) { marginTier = 'PHOTO_FINISH'; }
  else if (winPct <= 59) { marginTier = 'CLOSE'; }
  else if (winPct <= 69) { marginTier = 'CLEAR'; }
  else if (winPct <= 79) { marginTier = 'DOMINANT'; }
  else if (winPct <= 89) { marginTier = 'VERY_DOMINANT'; }
  else { marginTier = 'BLOWOUT'; }

  const numToWords = (num: number) => num.toString(); // spoken version simplifies

  const generateCandidate = () => {
    let verdict = "";
    let loserRoast = "";
    let winnerEnergy = "";
    let spokenVersion = "";

    // Generate extremely varied Hinglish templates
    const templates = [];

    // --- STRATEGY 1: Cricket/Sports Commentary ---
    templates.push({
      type: 'SPORTS',
      verdict: `Bhai ${winnerName} ne ${winPct}% ke strike rate se match nikaal liya! ${loserName} ki team abhi third umpire ke decision ka wait kar rahi hai.`,
      loserRoast: `${loserName} played well, par scoreboard ne seedha clean bowled kar diya.`,
      winnerEnergy: `${winnerName} raises the bat! Solid innings.`
    });
    templates.push({
      type: 'SPORTS',
      verdict: `${winPct}-${losePct} ka score! ${loserName} ka comeback officially possible hai, bas current scoreboard us idea ko reject kar raha hai.`,
      loserRoast: `Condolences to ${loserName}'s comeback committee. Today's match is abandoned.`,
      winnerEnergy: `${winnerName} takes the trophy home effortlessly.`
    });

    // --- STRATEGY 2: Corporate / Performance Review ---
    templates.push({
      type: 'CORPORATE',
      verdict: `Quarterly review is in: ${winnerName} secured ${winPct}% market share. ${loserName}, HR is requesting a meeting to discuss your presentation strategy.`,
      loserRoast: `${loserName}'s promotion has been deferred by the algorithm.`,
      winnerEnergy: `${winnerName} got the maximum appraisal today.`
    });
    templates.push({
      type: 'CORPORATE',
      verdict: `${winnerName} ne ${winPct}% KPI hit karke meeting wrap up kar di. ${loserName} bhai, next quarter mein try karte hain.`,
      loserRoast: `Algorithm ne ${loserName} ka project proposal reject kar diya.`,
      winnerEnergy: `${winnerName} is the employee of the month!`
    });

    // --- STRATEGY 3: Cinematic / Dramatic ---
    templates.push({
      type: 'DRAMATIC',
      verdict: `${winnerName} takes it by ${winPct}%. ${loserName}, bhai itna close tha ki scoreboard ko khud refresh karna pada.`,
      loserRoast: `Yeh ek fictional rivalry thi, par ${loserName} ne ise thoda zyada seriously le liya tha.`,
      winnerEnergy: `${winnerName} walks away with main character energy.`
    });
    templates.push({
      type: 'DRAMATIC',
      verdict: `${winPct}%! Yeh comparison tha ya ${winnerName} ka solo box office hit? ${loserName} ka cameo thoda chhota reh gaya.`,
      loserRoast: `${loserName} was basically an extra in ${winnerName}'s movie today.`,
      winnerEnergy: `${winnerName} steals the entire spotlight.`
    });

    // --- STRATEGY 4: Savage Gen Z / Internet Meme ---
    templates.push({
      type: 'CHAOTIC',
      verdict: `Bro 😭 ${winnerName} grabbed ${winPct}%. ${loserName} came for a competition but apparently ${winnerName} came with the answer key.`,
      loserRoast: `Algorithm literally ghosted ${loserName}'s score after this.`,
      winnerEnergy: `${winnerName} living rent-free on the leaderboard.`
    });
    templates.push({
      type: 'CHAOTIC',
      verdict: `91-9 nahi hai par ${winPct}-${losePct} dekh ke lagta hai scoreboard ne already apna decision likh rakha tha for ${winnerName}.`,
      loserRoast: `${loserName} got hit with that algorithmic uno reverse card.`,
      winnerEnergy: `${winnerName} secured the ultimate flex.`
    });

    // --- STRATEGY 5: Clinical / Deadpan ---
    templates.push({
      type: 'DEADPAN',
      verdict: `Model output stabilized at ${winPct}% favoring ${winnerName}. Minimal variance detected from ${loserName}.`,
      loserRoast: `Statistical probability of ${loserName}'s comeback is currently zero.`,
      winnerEnergy: `${winnerName} performed within optimal parameters.`
    });
    templates.push({
      type: 'DEADPAN',
      verdict: `Analyzing visual data. ${winnerName} selected with ${winPct}% confidence. ${loserName} data logged and archived.`,
      loserRoast: `${loserName} has been classified as an outlier in this dataset.`,
      winnerEnergy: `${winnerName} sets the numerical standard.`
    });

    // --- STRATEGY 6: Savage (Default) ---
    templates.push({
      type: 'SAVAGE',
      verdict: `${winnerName} ne ${winPct}% mark touch karke result lock kar diya. ${loserName} ka comeback arc officially pause par hai.`,
      loserRoast: `Someone check on the scoreboard. It looks emotionally exhausted after dealing with ${loserName}.`,
      winnerEnergy: `${winnerName} just gave a live tutorial on execution.`
    });
    templates.push({
      type: 'SAVAGE',
      verdict: `Yeh rivalry nahi, ${winnerName} ka solo takeover hai at ${winPct}%. ${loserName} bhai, scoreboard has respectfully declined your appeal.`,
      loserRoast: `Scoreboard to ${loserName}: "Thank you for participating."`,
      winnerEnergy: `${winnerName} owns the numerical high ground.`
    });
    templates.push({
      type: 'SAVAGE',
      verdict: `${winnerName} takes the round at ${winPct}%. ${loserName}, bhai, the scoreboard has officially chosen violence today.`,
      loserRoast: `Algorithm practically went into witness protection to avoid calculating ${loserName}'s score.`,
      winnerEnergy: `Flawless sweep by ${winnerName}.`
    });

    // Filtering logic based on persona
    let pool = templates;
    if (style === 'SPORTS') pool = templates.filter(t => t.type === 'SPORTS');
    else if (style === 'CORPORATE') pool = templates.filter(t => t.type === 'CORPORATE');
    else if (style === 'DRAMATIC') pool = templates.filter(t => t.type === 'DRAMATIC');
    else if (style === 'CHAOTIC') pool = templates.filter(t => t.type === 'CHAOTIC');
    else if (style === 'DEADPAN') pool = templates.filter(t => t.type === 'DEADPAN');
    else if (style === 'SAVAGE') pool = templates.filter(t => t.type === 'SAVAGE');

    if (pool.length === 0) pool = templates;

    let selected = pick(pool);
    
    // Add dynamic modifiers based on Margin Tier & Attribute
    const attrMods = [
      ` ${primaryAttr} ne poora game change kar diya.`,
      ` Scoreboard was really obsessed with ${primaryAttr}.`,
      ` Mostly because of ${primaryAttr}.`
    ];
    let extraRoast = Math.random() > 0.5 ? pick(attrMods) : '';

    verdict = selected.verdict + extraRoast;
    loserRoast = selected.loserRoast;
    winnerEnergy = selected.winnerEnergy;

    if (intensity === 'NUCLEAR' && marginTier !== 'PHOTO_FINISH') {
      verdict = `[NUCLEAR ALERT] ${verdict} Bhai, yeh rivalry nahi rahi, yeh scoreboard ka one-sided TED Talk ban gaya! 💀`;
      loserRoast = `${loserRoast} (Status: Completely obliterated by the algorithm).`;
    } else if (intensity === 'PLAYFUL') {
      verdict = `Lighthearted contest: ${winnerName} edges out with ${winPct}%. Good game by ${loserName}!`;
    }

    spokenVersion = `${winnerName} takes the win with ${winPct} percent. ${loserName} gets ${losePct} percent. Bhai, this was supposed to be a competition, but the scoreboard apparently had other plans. The model heavily favored ${primaryAttr}.`;
    if (winner === 'TIE' || marginTier === 'PHOTO_FINISH') {
       spokenVersion = `It is extremely close! ${winnerName} and ${loserName} are practically tied. Scoreboard is sweating right now.`;
    } else if (marginTier === 'BLOWOUT') {
       spokenVersion = `${winnerName} completely dominated with ${winPct} percent. ${loserName} is at ${losePct} percent. This wasn't a comparison, it was a victory lap.`;
    }

    // Mix up spoken version slightly based on style to make it unique
    if (style === 'SPORTS') {
       spokenVersion = `What a match! ${winnerName} surges ahead with ${winPct} percent. ${loserName} is calling a timeout.`;
    } else if (style === 'CORPORATE') {
       spokenVersion = `Quarterly numbers are in. ${winnerName} delivered ${winPct} percent. ${loserName} needs to revise their strategy.`;
    } else if (style === 'DEADPAN') {
       spokenVersion = `Model preference output is ${winPct} percent for ${winnerName}. Minimal variance observed for ${loserName}.`;
    }

    return { style, intensity, verdict, loserRoast, competitionRoast: loserRoast, winnerEnergy, spokenVersion };
  };

  let candidate = generateCandidate();
  let attempts = 0;
  // Ensure we don't repeat the exact verdict from recent history
  while (history.includes(candidate.verdict) && attempts < 10) {
    // Inject some randomness by appending spaces or alternative emojis if we run out of unique combinations
    candidate = generateCandidate();
    if (attempts > 5) {
       candidate.verdict += (Math.random() > 0.5 ? " 😂" : " 🔥");
    }
    attempts++;
  }

  return candidate;
}
