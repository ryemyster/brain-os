export interface InterviewRound {
  id: string;
  name: string;
  duration: string;
  stage: "screen" | "phone" | "take-home" | "onsite";
  tests: string[];
  what_they_actually_want: string;
  questions: string[];
  rubric: string[];
  great_signals: string[];
  weak_signals: string[];
  notes?: string;
}

export interface CompanyLoop {
  company: string;
  alias: string[];
  total_rounds: string;
  timeline: string;
  unique_emphasis: string;
  framework: string;
  deal_breakers: string[];
  ai_specific_notes: string;
  rounds: InterviewRound[];
}

export const MAANG_LOOPS: Record<string, CompanyLoop> = {
  meta: {
    company: "Meta",
    alias: ["facebook", "fb", "meta"],
    total_rounds: "5-6 total (2 phone + 3-4 onsite)",
    timeline: "~6 weeks",
    unique_emphasis:
      "Impact at scale — think billions of people (DAP/MAP), not thousands. PMs are collaborative leaders, not product CEOs. AI collaboration fluency now evaluated explicitly.",
    framework: "Understand → Identify → Execute (internalized, not spoken aloud)",
    deal_breakers: [
      "Thinking like the CEO of a product (hierarchical, not collaborative)",
      "Focusing on company metrics instead of user pain",
      "Using DAU/MAU instead of DAP/MAP terminology",
      "Mechanical framework recitation",
      "Failing to show influence without authority",
    ],
    ai_specific_notes:
      "Meta added a 'Product Sense with AI' round in 2025-26 for IC6+ and manager roles. Evaluates whether you can use AI as a thinking partner — push back on it, ask it clarifying questions, synthesize its output with your own judgment. They do NOT test prompt engineering tricks.",
    rounds: [
      {
        id: "meta-recruiter",
        name: "Recruiter Screen",
        duration: "30 min",
        stage: "screen",
        tests: ["Motivation", "Basic fit", "Role alignment"],
        what_they_actually_want:
          "Confirm you understand the role and Meta's mission, and that your background is plausibly relevant.",
        questions: [
          "Why Meta? Why this team specifically?",
          "Walk me through your PM background in 2 minutes.",
          "What are you looking for in your next role?",
          "What do you know about how Meta builds products?",
        ],
        rubric: [
          "Specific motivation (not 'scale' or 'impact' generically)",
          "Crisp background summary without rambling",
          "Alignment with Meta's mission and people-first product philosophy",
        ],
        great_signals: [
          "References specific Meta products and articulates what makes them work",
          "Connects personal experience to Meta's DAP-scale challenges",
          "Asks sharp questions about the team/role",
        ],
        weak_signals: [
          "Generic 'I love Meta's scale' without specifics",
          "Can't explain what makes Meta's PM culture different",
          "Doesn't have questions",
        ],
      },
      {
        id: "meta-product-sense-phone",
        name: "Product Sense (Phone)",
        duration: "45 min",
        stage: "phone",
        tests: ["User empathy", "Problem decomposition", "Solution design", "Prioritization"],
        what_they_actually_want:
          "Show you can transform ambiguous problems into valuable products by starting with real user pain — not company goals.",
        questions: [
          "How would you improve Instagram for creators who are losing followers to TikTok?",
          "Design a new Meta product to help people maintain long-distance relationships.",
          "Walk me through how you'd think about adding AI to Messenger — what problem does it solve and for whom?",
          "Meta's DAP growth has plateaued in the US. What would you build and why?",
        ],
        rubric: [
          "Started with user segments, not features",
          "Named a specific, underserved user and articulated their real pain",
          "Prioritized with explicit trade-off reasoning",
          "Solutions scaled to Meta's global DAP opportunity",
          "AI/platform thinking where relevant",
        ],
        great_signals: [
          "Uses 'DAP' language naturally",
          "Narrows to one user segment and goes deep before expanding",
          "Connects solution to Meta's mission, not just user need",
          "Proposes validation approach",
        ],
        weak_signals: [
          "Lists features without anchoring to a user problem",
          "Thinks at app-level scale instead of global scale",
          "Uses DAU/MAU instead of DAP/MAP",
          "Skips trade-offs",
        ],
      },
      {
        id: "meta-execution-phone",
        name: "Execution / Analytical Thinking (Phone)",
        duration: "45 min",
        stage: "phone",
        tests: ["Metrics fluency", "Data-driven decision making", "Root cause analysis", "Trade-off evaluation"],
        what_they_actually_want:
          "Can you measure what matters and make decisions when the data is messy or incomplete?",
        questions: [
          "Stories shared on Facebook dropped 15% this quarter. Walk me through your investigation.",
          "How would you measure whether a new AI feature in WhatsApp is working?",
          "You have two competing roadmap items with similar estimated impact. How do you decide?",
          "Define the metrics you'd use to evaluate success for Meta AI's assistant product.",
        ],
        rubric: [
          "Started with a hypothesis before diving into data",
          "Segmented the metric by platform, cohort, geography, or behavior",
          "Distinguished leading indicators from lagging outcomes",
          "Named counter-metrics to watch",
          "Made a clear decision recommendation — didn't hedge everything",
        ],
        great_signals: [
          "Hypothesis-first before data pull",
          "Knows what to segment and why",
          "Makes a confident call with stated assumptions",
        ],
        weak_signals: [
          "Lists every possible metric without prioritizing",
          "No hypothesis — just 'I'd look at everything'",
          "Endless 'it depends' with no resolution",
        ],
      },
      {
        id: "meta-product-sense-onsite",
        name: "Product Sense (Onsite)",
        duration: "45 min",
        stage: "onsite",
        tests: ["Product vision", "User empathy at scale", "AI product thinking", "Strategic prioritization"],
        what_they_actually_want:
          "Same as phone but harder questions, more ambiguity, deeper follow-ups. They want to see your ceiling.",
        questions: [
          "Design a product that helps 1 billion people feel less lonely — without social networking.",
          "How would you rethink Facebook Groups for the AI era?",
          "Meta's AR glasses are coming. Design the first killer PM use case that's not obvious.",
          "You're the PM for Meta AI. What's your 3-year roadmap and why?",
        ],
        rubric: [
          "Handles high ambiguity without freezing — asks good clarifying questions",
          "Thinks at global DAP scale while staying user-specific",
          "Integrates AI as infrastructure, not as a feature bolt-on",
          "Shows a point of view and defends it under pressure",
        ],
        great_signals: [
          "Takes a bold position and defends it when pushed",
          "Thinks cross-platform (IG, WhatsApp, FB, Threads, Ray-Ban) not just one app",
          "Considers non-obvious user segments",
        ],
        weak_signals: [
          "Hedges every answer",
          "Stays in one app without considering the ecosystem",
          "Generic AI feature ideas ('add a chatbot to everything')",
        ],
      },
      {
        id: "meta-leadership-drive",
        name: "Leadership & Drive",
        duration: "45 min",
        stage: "onsite",
        tests: ["Influence without authority", "Cross-functional leadership", "Resilience", "Self-awareness"],
        what_they_actually_want:
          "Evidence you can rally people who don't report to you, navigate ambiguity, and learn from failure — all without being the 'CEO of the product.'",
        questions: [
          "Tell me about a time you had to influence a major decision without having authority to mandate it.",
          "Describe a time you failed as a PM. What happened, and what did you actually change afterward?",
          "Tell me about a time you had to push back on leadership. How did you do it and what was the result?",
          "Describe the hardest cross-functional conflict you've navigated. Walk me through what you did.",
          "Tell me about a time you had to ship something you disagreed with. What was your role?",
        ],
        rubric: [
          "STAR structure with clear individual ownership ('I', not 'we')",
          "Demonstrates influence through data, alignment, and trust — not authority",
          "Reflection is honest and specific — not 'I learned to communicate better'",
          "Shows collaborative leadership, not command-and-control",
          "Result is quantified or clearly articulated",
        ],
        great_signals: [
          "Says 'I' consistently with clear personal ownership",
          "Failure stories show real learning that changed behavior",
          "Pushback stories show respectful courage, not stubbornness",
        ],
        weak_signals: [
          "Overuses 'we' — unclear what they personally did",
          "Failure story has no real failure or learning",
          "Can't describe a time they were wrong",
        ],
      },
      {
        id: "meta-ai-product-sense",
        name: "Product Sense with AI (IC6+ / Manager roles)",
        duration: "45 min",
        stage: "onsite",
        tests: ["AI collaboration judgment", "Critical thinking with AI tools", "Product sense applied to AI outputs"],
        what_they_actually_want:
          "Can you use AI as a thinking partner — push back on it, direct it, synthesize its output — rather than just accept what it generates?",
        questions: [
          "We'll work through a product design question together using an AI tool. I want to see how you guide it, push back on it, and integrate its output with your own judgment.",
          "AI generated three product directions for this problem. Walk me through which you'd choose, which you'd reject, and why.",
          "You're designing an AI feature for a vulnerable user population. What guardrails do you build and why?",
          "Where do you think AI makes a PM's job harder, not easier? What does that imply for product design?",
        ],
        rubric: [
          "Directs the AI toward useful output rather than accepting the first response",
          "Pushes back when AI output is generic, wrong, or misses the user",
          "Synthesizes AI output with independent product judgment",
          "Thinks about trust, safety, and failure modes — not just capability",
        ],
        great_signals: [
          "Actively questions AI assumptions — doesn't treat outputs as ground truth",
          "Uses AI to explore faster but owns the final product direction",
          "Brings user trust and safety into AI feature design unprompted",
        ],
        weak_signals: [
          "Accepts AI output uncritically",
          "Treats AI as a search engine, not a thinking partner",
          "No consideration of failure modes or hallucination risk in product context",
        ],
        notes: "Only required for IC6+ and manager-track roles in Central Products. Check with recruiter if it applies to your role.",
      },
    ],
  },

  amazon: {
    company: "Amazon",
    alias: ["amazon", "aws", "amzn"],
    total_rounds: "6 onsite + 2 phone + written essay",
    timeline: "~4 weeks",
    unique_emphasis:
      "Leadership Principles are the evaluation framework — every answer must map to one or more LPs. Customer Obsession is the most critical. Bar Raiser can veto any hire.",
    framework: "LP mapping — every story should explicitly connect to a Leadership Principle",
    deal_breakers: [
      "Saying 'we' instead of 'I' — Amazon wants individual ownership",
      "Hypothetical answers ('I would...') instead of real examples",
      "Failing to show Customer Obsession — company metrics before user outcomes",
      "Not having a story prepared for 'Disagree and Commit'",
      "Over-relying on STAR template mechanically",
    ],
    ai_specific_notes:
      "Amazon now evaluates AI/ML thinking through the Customer Obsession LP — how does AI solve a real customer problem, not just an operational efficiency? Expect questions about building AI products responsibly and what 'Think Big' means in an AI-native world.",
    rounds: [
      {
        id: "amazon-phone-screen",
        name: "Recruiter Phone Screen",
        duration: "60 min (30 behavioral + 30 functional)",
        stage: "screen",
        tests: ["LP alignment basics", "Functional PM knowledge", "Motivation"],
        what_they_actually_want:
          "Confirm LP cultural alignment and basic PM competence before investing in the full loop.",
        questions: [
          "Tell me about a time you had to make a decision with incomplete data. (LP: Bias for Action)",
          "Describe a time you went above and beyond for a customer. (LP: Customer Obsession)",
          "How do you prioritize your roadmap when everything is P0? (functional)",
          "Tell me about a product you're proud of shipping. What was your role?",
        ],
        rubric: [
          "Real examples, not hypotheticals",
          "Individual ownership clear in every story",
          "LP connection visible even if not stated",
          "Functional answers show structured PM thinking",
        ],
        great_signals: ["Specific stories with clear 'I' ownership", "Results quantified", "LP language natural"],
        weak_signals: ["Hypothetical framing", "Vague outcomes", "Stories that could be anyone's"],
      },
      {
        id: "amazon-essay",
        name: "Written Essay",
        duration: "1-2 pages, submitted pre-onsite",
        stage: "take-home",
        tests: ["Written communication", "Customer Obsession", "Innovation thinking", "Think Big LP"],
        what_they_actually_want:
          "A clear, specific narrative about a time you identified a customer problem others missed and drove a solution. Should demonstrate LP alignment through writing, not just talking.",
        questions: [
          "Describe a time you identified a significant customer problem and the product or process you built to solve it.",
          "Tell the story of a product innovation you drove — from insight to customer impact.",
        ],
        rubric: [
          "Clear customer problem stated upfront — not a company problem",
          "Specific, not generic — names users, context, constraints",
          "Your specific role and actions are unambiguous",
          "Result is quantified and customer-impact-oriented",
          "Writing is direct and concise — Amazon values clarity over eloquence",
        ],
        great_signals: [
          "Leads with customer insight, not internal goal",
          "Shows 'Invent and Simplify' thinking",
          "Crisp, no filler sentences",
        ],
        weak_signals: [
          "Buries customer insight",
          "Story is about internal efficiency, not customer outcome",
          "Writing is vague or uses jargon",
        ],
        notes:
          "Now standardized for most PM candidates. Write in plain English — Amazon values clarity over sophisticated vocabulary.",
      },
      {
        id: "amazon-product-design-1",
        name: "Product Design (Round 1)",
        duration: "45 min",
        stage: "onsite",
        tests: ["Strategic thinking", "Customer Obsession", "Invent and Simplify", "User identification"],
        what_they_actually_want:
          "Can you identify non-obvious users and design products that solve real customer problems at Amazon's scale?",
        questions: [
          "Design a product to help Amazon sellers understand and respond to customer reviews using AI.",
          "How would you build a product to help first-time parents navigate the Amazon shopping experience?",
          "Design the ideal Alexa experience for elderly users living alone.",
          "Amazon wants to expand Prime benefits. What would you add and why — starting from customer research, not assumptions.",
        ],
        rubric: [
          "Started with customer identification, not feature ideation",
          "Found a non-obvious or underserved user segment",
          "Solution demonstrates 'Invent and Simplify' — not more complexity",
          "Connected solution to measurable customer outcome",
          "Showed 'Think Big' without ignoring implementation reality",
        ],
        great_signals: [
          "Identifies unusual user segments (not just 'Amazon's average user')",
          "Proposes something genuinely new, not an iteration of existing Amazon products",
          "Thinks about customer trust and potential misuse",
        ],
        weak_signals: [
          "Generic user identification ('Amazon shoppers who...')",
          "Copies existing Amazon products slightly modified",
          "Feature-first instead of problem-first",
        ],
      },
      {
        id: "amazon-product-design-2",
        name: "Product Design (Round 2)",
        duration: "45 min",
        stage: "onsite",
        tests: ["Metrics", "Success definition", "Ownership LP", "Deliver Results LP"],
        what_they_actually_want:
          "Can you define what success looks like for a product and hold yourself accountable to it?",
        questions: [
          "You shipped a new AI feature in the Amazon app. How do you know if it worked?",
          "Define the metrics for an Amazon product that helps customers make more sustainable shopping choices.",
          "Your feature launched and adoption is lower than expected. Walk me through your response.",
          "How would you measure the success of a product that has no direct revenue tie?",
        ],
        rubric: [
          "North Star metric clearly defined and justified",
          "Leading indicators distinguished from lagging outcomes",
          "Counter-metrics named (what could be gamed or hurt)",
          "Response to underperformance shows ownership, not blame",
          "Data-driven but not data-paralyzed",
        ],
        great_signals: [
          "Connects metrics to customer outcomes, not just business metrics",
          "Shows 'Dive Deep' LP — knows what to segment",
          "Owns the outcome personally in the failure scenario",
        ],
        weak_signals: [
          "Lists every possible metric without prioritizing",
          "Blames engineering or external factors for underperformance",
          "Success metrics are vanity metrics",
        ],
      },
      {
        id: "amazon-collaboration-behavioral",
        name: "Collaboration & Behavioral",
        duration: "45 min",
        stage: "onsite",
        tests: ["Earn Trust LP", "Have Backbone: Disagree and Commit LP", "Hire and Develop the Best LP"],
        what_they_actually_want:
          "Can you challenge decisions respectfully, build trust across teams, and commit once a decision is made even if you disagreed?",
        questions: [
          "Tell me about a time you disagreed with your manager or leadership. What did you do? (LP: Have Backbone, Disagree and Commit)",
          "Describe a time you had to work with a difficult stakeholder. How did you build the relationship? (LP: Earn Trust)",
          "Tell me about a time you gave critical feedback to a peer or someone more senior. (LP: Candor)",
          "Describe a time you had to commit to and execute a decision you disagreed with. (LP: Disagree and Commit)",
        ],
        rubric: [
          "Pushback was respectful and data-driven, not emotional",
          "Committed to the decision once made — didn't undermine it",
          "Trust-building was active and specific",
          "Feedback was direct and constructive",
          "Stories show 'I' not 'we'",
        ],
        great_signals: [
          "Can describe a real disagreement with a specific outcome",
          "Shows how they committed after losing the argument",
          "Feedback story shows genuine candor, not diplomatic hedging",
        ],
        weak_signals: [
          "Can't think of a real disagreement ('I generally agree with my team')",
          "Committed but clearly resentful — undermined the decision",
          "Feedback story is too soft to be credible",
        ],
      },
      {
        id: "amazon-customer-obsession",
        name: "Customer Obsession Deep Dive",
        duration: "45 min",
        stage: "onsite",
        tests: ["Customer Obsession LP", "Think Big LP", "Invent and Simplify LP"],
        what_they_actually_want:
          "Demonstrate genuine, deep empathy for customers — not just lip service. Show you go beyond what customers ask for to solve what they actually need.",
        questions: [
          "Tell me about a time you went against popular opinion to advocate for the customer. What happened?",
          "Describe a time when you discovered a customer problem that wasn't in any data — how did you find it and what did you do?",
          "Tell me about a product decision where you prioritized the customer experience over business metrics. Was it the right call?",
          "How would you apply AI to solve a customer problem that Amazon hasn't addressed yet? What's the unmet need?",
        ],
        rubric: [
          "Customer insight was specific and earned — not assumed",
          "Action taken was beyond the obvious",
          "Outcome connected back to customer impact, not just metrics",
          "AI application starts from customer need, not technology capability",
        ],
        great_signals: [
          "Found the problem through real customer contact, not just data",
          "Took a position that was unpopular internally but right for the customer",
          "AI framing is 'what problem does the customer have?' not 'how can we use AI?'",
        ],
        weak_signals: [
          "Customer Obsession is just good UX — no real depth or sacrifice",
          "AI answer is technology-first",
          "Story doesn't show what they personally gave up to serve the customer",
        ],
      },
      {
        id: "amazon-bar-raiser",
        name: "Bar Raiser",
        duration: "45 min",
        stage: "onsite",
        tests: ["Long-term potential", "LP alignment holistically", "Strategic intuition", "Decision-making under pressure"],
        what_they_actually_want:
          "Are you better than 50% of current Amazonians at this level? This is a veto-power round from outside the team — they're assessing long-term ceiling, not just role fit.",
        questions: [
          "What's the biggest strategic mistake you've seen a tech company make in the last 3 years? What would you have done differently?",
          "Tell me about a time you made a very unpopular decision. How did you know it was right?",
          "Where do you want to be in 5 years, and how does this role connect to that?",
          "What LP do you think you're weakest on, and what are you doing about it?",
          "Tell me about a time you raised the bar — where you set a higher standard than was expected of you.",
        ],
        rubric: [
          "Strategic thinking is genuinely original — not textbook",
          "LP self-awareness is honest, not performative",
          "Long-term ambition aligns with Amazon's growth trajectory",
          "Unpopular decision story shows real courage with a real outcome",
          "Raises the bar story shows standards above the minimum",
        ],
        great_signals: [
          "Strategic take on a company mistake is nuanced and specific",
          "LP weakness is honest and shows active work to improve",
          "Can defend a decision under adversarial follow-up questions",
        ],
        weak_signals: [
          "Strategic take is obvious or hedged",
          "LP weakness is a humble-brag ('I work too hard')",
          "Folds under follow-up questioning",
        ],
        notes:
          "Bar Raiser can veto the hire regardless of what every other interviewer says. Treat this as your most important round. They are not from your team — they're assessing fit with Amazon, not the specific role.",
      },
    ],
  },

  netflix: {
    company: "Netflix",
    alias: ["netflix", "nflx"],
    total_rounds: "4-5 total (recruiter + hiring manager + optional take-home + 3-4 onsite)",
    timeline: "4-8 weeks (some stretch longer)",
    unique_emphasis:
      "Keeper Test mentality — you must be someone they'd fight hard to keep. 95% behavioral (real examples only). 40% of scoring is behavioral, 30% is cultural fit. Must exceed expectations in at least one dimension.",
    framework: "STAR results-first — lead with impact, then explain how you got there",
    deal_breakers: [
      "Hypothetical answers ('I would...') instead of real examples",
      "Being 'solid' across all dimensions without exceeding in any",
      "Inability to demonstrate the Keeper Test mentality",
      "Stories that lack depth or specificity",
      "Can't connect personal actions to business outcomes",
    ],
    ai_specific_notes:
      "Netflix is selective about AI adoption in product given their engineering culture. Questions about AI tend to focus on product judgment — when to use AI, when not to, and how to maintain trust with the Netflix experience brand.",
    rounds: [
      {
        id: "netflix-recruiter",
        name: "Recruiter Screen",
        duration: "30 min",
        stage: "screen",
        tests: ["Culture fit basics", "Motivation", "Background alignment"],
        what_they_actually_want:
          "Verify you understand Netflix's culture and can articulate your background specifically.",
        questions: [
          "Why Netflix? What specifically draws you to this team?",
          "How would you describe your leadership style?",
          "Tell me about a product you're most proud of and your specific role in it.",
        ],
        rubric: [
          "Specific Netflix knowledge (not 'I love Netflix's content')",
          "Leadership style shows judgment, not just process",
          "Product story is specific and ownership is clear",
        ],
        great_signals: ["References specific Netflix product decisions or culture deck principles", "Has a point of view on what makes Netflix's PM role unique"],
        weak_signals: ["Generic enthusiasm", "Can't articulate what 'freedom and responsibility' means for PMs"],
      },
      {
        id: "netflix-hiring-manager",
        name: "Hiring Manager Interview",
        duration: "45 min",
        stage: "phone",
        tests: ["Leadership judgment", "Culture alignment", "Product thinking depth"],
        what_they_actually_want:
          "Would I hire this person if I could only talk to them once? Netflix hiring managers apply the Keeper Test from the first conversation.",
        questions: [
          "Tell me about the most impactful product decision you've made. Walk me through your thinking, not just the outcome.",
          "Describe a time you led without authority — where you had to drive alignment across people who didn't report to you.",
          "What's a product bet you made that didn't pay off? What did you learn, and how did it change what you do?",
          "Tell me about a time you received genuinely tough feedback. What was it and what did you do with it?",
        ],
        rubric: [
          "Impact is specific and quantified",
          "Stories show genuine ownership and judgment — not process compliance",
          "Failure story has real failure and real learning",
          "Feedback story shows openness to being wrong",
        ],
        great_signals: [
          "High-stakes, specific stories",
          "Shows 'exceeds expectations' ceiling in at least one dimension",
          "Feedback story changed actual behavior",
        ],
        weak_signals: [
          "Stories are generic enough to be anyone's",
          "Failure story is too safe",
          "Feedback story is superficial",
        ],
      },
      {
        id: "netflix-take-home",
        name: "Take-Home Case (Optional)",
        duration: "2-4 hours",
        stage: "take-home",
        tests: ["Written product thinking", "Structured analysis", "Judgment under self-direction"],
        what_they_actually_want:
          "See how you think without the pressure of a live interview — and whether you can be concise and opinionated on paper.",
        questions: [
          "You're the PM for Netflix's new feature targeting users who share accounts across households. Define what success looks like and how you'd measure it.",
          "Design a Netflix feature that uses viewing data to help users discover content they didn't know they wanted.",
        ],
        rubric: [
          "Takes a clear position — doesn't over-hedge",
          "Writing is concise and structured",
          "User insight is specific, not assumed",
          "Success metrics are tied to user behavior, not vanity",
        ],
        great_signals: ["Strong point of view from the start", "Trade-offs named explicitly", "Concise — doesn't pad"],
        weak_signals: ["Lists options without recommending one", "Pads with framework descriptions", "No data or metric specificity"],
        notes: "Not required for all roles — confirm with recruiter.",
      },
      {
        id: "netflix-behavioral-1",
        name: "Behavioral Deep Dive (Round 1)",
        duration: "45 min",
        stage: "onsite",
        tests: ["Judgment", "Ownership", "Impact", "Communication"],
        what_they_actually_want:
          "One or two stories explored very deeply. They're not looking for quantity — they want to see every layer of your judgment in a specific situation.",
        questions: [
          "Tell me about a time you launched a product or feature. Walk me through from the decision to launch to how you measured success.",
          "Describe a time you made a product decision with incomplete data. What was your reasoning process?",
          "Tell me about a time you had to say no to a customer or stakeholder request. How did you handle it and what happened?",
        ],
        rubric: [
          "Results-first — lead with impact, then explain the path",
          "Deep follow-ups answered without deflection",
          "Individual ownership crystal clear",
          "Learning from the experience is specific and behavioral",
        ],
        great_signals: [
          "Welcomes deep follow-ups and goes deeper without repeating surface story",
          "Can name alternatives they considered and why they chose differently",
          "Shows one area where they clearly 'exceed expectations'",
        ],
        weak_signals: [
          "Repeats same surface-level story when pressed",
          "Can't explain the 'why' behind key decisions",
          "Results are soft or unmeasured",
        ],
      },
      {
        id: "netflix-behavioral-2",
        name: "Behavioral Deep Dive (Round 2)",
        duration: "45 min",
        stage: "onsite",
        tests: ["Curiosity", "Selflessness", "Courage", "Sustained impact"],
        what_they_actually_want:
          "Evidence of the Netflix culture deck in action — specifically judgment, candor, and sustained impact over time.",
        questions: [
          "Tell me about a time you failed. I want the real one — not the one that makes you look good. (94% likelihood — 'Led without authority' or failure question)",
          "Describe a time you changed your mind on something important. What convinced you?",
          "Tell me about a decision you made that was unpopular — and how you handled the aftermath.",
          "When did you most recently ask for feedback from someone junior to you? What happened?",
        ],
        rubric: [
          "Failure story has genuine failure — not a dressed-up success",
          "Mind-changing story shows intellectual honesty",
          "Unpopular decision story shows sustained conviction without arrogance",
          "Feedback from junior shows genuine humility",
        ],
        great_signals: [
          "Failure story makes interviewer slightly uncomfortable — that's right",
          "Can articulate what they actually believe vs. what they said in the moment",
        ],
        weak_signals: [
          "Failure is really a success story in disguise",
          "Mind-change story is about a small tactical choice",
          "Feedback from junior is theoretical",
        ],
      },
      {
        id: "netflix-product-design",
        name: "Product Design",
        duration: "45 min",
        stage: "onsite",
        tests: ["Product sense", "User empathy", "Strategic thinking", "Netflix ecosystem thinking"],
        what_they_actually_want:
          "Show that you think about entertainment, content discovery, and user experience with genuine depth — not generic product frameworks.",
        questions: [
          "How would you improve Netflix's recommendation algorithm from a product perspective — not the ML side, the user experience side?",
          "Design a Netflix product for users who mostly watch with a partner but sometimes watch alone.",
          "Netflix is losing subscribers in a specific region. How would you diagnose and respond?",
          "What's the most underserved user segment on Netflix, and what would you build for them?",
        ],
        rubric: [
          "User insight is specific and earned — not assumed from personal experience",
          "Recommendations system thinking goes beyond 'better ratings'",
          "Solution shows trade-offs explicitly — not just a feature list",
          "Takes a clear position on what to build and why",
        ],
        great_signals: [
          "Understands the nuance of passive vs. active content discovery",
          "Connects user insight to Netflix's business model (subscriber retention)",
          "Shows taste — not just process",
        ],
        weak_signals: [
          "Only references their own Netflix usage as evidence",
          "Generic product design answer that could apply to any streaming app",
          "No trade-off reasoning",
        ],
      },
    ],
  },

  google: {
    company: "Google",
    alias: ["google", "alphabet", "goog"],
    total_rounds: "5-6 total (recruiter + hiring manager phone + 4-5 onsite)",
    timeline: "~5 weeks (34 days avg)",
    unique_emphasis:
      "Analytical depth is table stakes. Structured thinking shown naturally — never robotically. Level matters: L3 executes, L4 owns, L5 sets strategy. AI fluency now explicitly evaluated.",
    framework: "CIRCLES (Comprehend, Identify, Report, Cut, List, Evaluate, Summarize) — internalized, never spoken aloud",
    deal_breakers: [
      "Saying 'Let me use the CIRCLES framework' out loud",
      "Rambling answers over 5 minutes without a clear structure",
      "Vague impact language ('I improved conversion') without numbers",
      "Applying traditional PM thinking to AI product questions — major 2026 red flag",
      "Endless 'it depends' with no judgment call",
    ],
    ai_specific_notes:
      "Google now evaluates AI fluency as a distinct competency. Expect product questions specifically about AI/ML products, how to measure AI feature success, and how to handle AI failure modes. L5+ must show how they'd set AI product strategy, not just design features.",
    rounds: [
      {
        id: "google-recruiter",
        name: "Recruiter Screen",
        duration: "30 min",
        stage: "screen",
        tests: ["Basic fit", "Motivation", "Level calibration"],
        what_they_actually_want: "Confirm experience level, motivation, and that you're not going to waste everyone's time.",
        questions: [
          "Walk me through your PM background — what products have you owned end-to-end?",
          "Why Google? Why this team specifically?",
          "What level are you targeting and why?",
        ],
        rubric: ["Clear ownership of specific products", "Specific Google motivation beyond 'scale'", "Level calibration is realistic"],
        great_signals: ["References specific Google products or research", "Has a point of view on Google's PM culture vs competitors"],
        weak_signals: ["Vague experience summary", "Generic 'Google's mission' motivation"],
      },
      {
        id: "google-hiring-manager-phone",
        name: "Hiring Manager Phone",
        duration: "45 min",
        stage: "phone",
        tests: ["Product Vision", "Analytical thinking preview", "Cultural fit"],
        what_they_actually_want:
          "Assess ceiling and fit before investing in full onsite. They're checking whether you belong at the level you're targeting.",
        questions: [
          "Walk me through a product you built or improved. I want to understand your specific contribution and the measurable impact.",
          "How do you think about measuring success for an AI product that influences user behavior without explicit user action?",
          "Tell me about a time you had to make a product decision with significant uncertainty. How did you decide?",
        ],
        rubric: [
          "Product impact is quantified and specific",
          "AI measurement thinking shows nuance — not just 'conversion rate'",
          "Decision under uncertainty shows structured thinking, not gut feel alone",
        ],
        great_signals: [
          "Quantifies impact at the right level for target level (L5: $10M+ impact or 1M+ DAU)",
          "AI thinking goes beyond standard metrics to trust, reliability, and latency",
        ],
        weak_signals: ["Vague impact ('improved the product significantly')", "AI measurement answer is surface-level"],
      },
      {
        id: "google-product-vision",
        name: "Product Vision (Onsite)",
        duration: "50-60 min",
        stage: "onsite",
        tests: ["Long-term product thinking", "Strategic direction", "User empathy at scale"],
        what_they_actually_want:
          "Can you define a compelling direction for a product — not just improve what exists? L5+ must show strategic vision, not just feature roadmaps.",
        questions: [
          "You're the PM for Google Search in 5 years — what does it look like, and why?",
          "Design a Google product that doesn't exist today but should. Walk me through your reasoning from user need to go-to-market.",
          "How would you evolve Google Maps to be genuinely AI-native — not just AI-enhanced?",
          "What's the most important product bet Google should make in the next 3 years that it hasn't made yet?",
        ],
        rubric: [
          "Vision is specific and directional — not 'AI will make everything better'",
          "Connects user insight to platform opportunity",
          "Understands Google's business model and where it creates or destroys value",
          "Shows what they'd NOT build — prioritization under constraint",
          "For L5+: strategy spans multiple products or teams, not a single feature",
        ],
        great_signals: [
          "Takes a bold, specific position and defends it",
          "Understands Google's ecosystem dependencies (Search, Ads, Android, Cloud)",
          "AI integration is purposeful, not decorative",
        ],
        weak_signals: [
          "Vision is just an incremental improvement on today's product",
          "AI is tacked on without changing the user experience fundamentally",
          "Doesn't understand Google's advertising dependency",
        ],
      },
      {
        id: "google-product-analysis",
        name: "Product Analysis (Onsite)",
        duration: "50-60 min",
        stage: "onsite",
        tests: ["Analytical depth", "Estimation", "Root cause analysis", "Metrics definition"],
        what_they_actually_want:
          "Can you use data to find the truth and make a clear decision — not just list everything you'd look at?",
        questions: [
          "YouTube watch time dropped 12% in the last 30 days across mobile. Walk me through your investigation.",
          "Estimate the market size for an AI writing assistant targeting enterprise knowledge workers in North America.",
          "How would you measure the success of Google's AI Overviews feature in Search — and what would make you shut it down?",
          "You have two product bets: one with certain small impact and one with uncertain large impact. How do you decide?",
        ],
        rubric: [
          "Hypothesis-first — didn't just 'look at all the data'",
          "Estimation has a clear approach with labeled assumptions",
          "AI feature success metrics address trust and quality, not just engagement",
          "Decision framework is clear and defensible",
        ],
        great_signals: [
          "Hypothesis before data pull — every time",
          "Estimation is structured: segments + math + sanity check",
          "Knows what counter-metrics to watch (e.g., for AI Overviews: click-through rate, publisher trust, user trust in answers)",
        ],
        weak_signals: [
          "'I'd look at everything' — no hypothesis",
          "Estimation is handwavy — no numbers",
          "AI success metrics are only engagement-based",
        ],
      },
      {
        id: "google-execute-judgment",
        name: "Execute with Judgment (Onsite)",
        duration: "50-60 min",
        stage: "onsite",
        tests: ["Execution rigor", "Trade-off decision making", "Roadmap thinking", "For L3-L4: tactics; for L5+: strategy"],
        what_they_actually_want:
          "Show you can take a product direction and execute it with rigor — defining specs, testing assumptions, handling constraints.",
        questions: [
          "You've decided to launch an AI-powered feature in Google Docs. Walk me through your launch plan — what do you validate first, and why?",
          "How would you prioritize a roadmap where every item has legitimate stakeholder support?",
          "Design an A/B test for a major change to Google's homepage. What are you testing, what's your success condition, and when do you call it?",
          "You need to ship something in 6 weeks that normally takes 6 months. What do you cut and how do you decide?",
        ],
        rubric: [
          "Launch plan prioritizes assumption testing, not just feature completeness",
          "Roadmap prioritization shows explicit trade-off reasoning",
          "A/B test design is rigorous: hypothesis, control, metric, confidence threshold",
          "Constraint response shows judgment — not just 'cut everything'",
        ],
        great_signals: [
          "Validates riskiest assumptions first, not easiest ones",
          "Roadmap trade-offs name what they're giving up",
          "6-week answer shows what an MVP actually is vs what it isn't",
        ],
        weak_signals: [
          "Launch plan is just a feature checklist",
          "Roadmap prioritization is RICE calculation without judgment",
          "A/B test has no clear success condition or shut-down criterion",
        ],
      },
      {
        id: "google-behavioral",
        name: "Behavioral & Situational (Onsite)",
        duration: "50-60 min",
        stage: "onsite",
        tests: ["Communication", "Conflict resolution", "Learning from mistakes", "Humility", "'Googleyness'"],
        what_they_actually_want:
          "Are you someone people want to work with? Can you handle ambiguity, disagreement, and failure without becoming a problem?",
        questions: [
          "Tell me about a time you had a significant conflict with a teammate or stakeholder. How did you resolve it?",
          "Describe a product decision you got wrong. What happened, and what changed afterward?",
          "Tell me about a time you had to communicate a complex decision to a non-technical audience. What was your approach?",
          "How have you managed a situation where your team was demoralized or losing momentum?",
        ],
        rubric: [
          "Conflict resolution shows curiosity and empathy — not just winning",
          "Mistake story has genuine learning that changed behavior",
          "Communication example shows adaptation to the audience",
          "Team morale story shows servant leadership",
        ],
        great_signals: [
          "Conflict story ends in stronger relationship, not just resolved conflict",
          "Mistake story changes something specific about how they work",
          "Communication story shows them changing their style, not just simplifying words",
        ],
        weak_signals: [
          "Conflict story is one-sided — they were clearly right",
          "Mistake story is really a success story",
          "Communication story is about slides, not actual adaptation",
        ],
      },
    ],
  },

  apple: {
    company: "Apple",
    alias: ["apple", "aapl"],
    total_rounds: "6-10 onsite (one-day loop) + 1-2 phone screens",
    timeline: "4-6 weeks",
    unique_emphasis:
      "Hardware-software-services integration. Design is how it works, not how it looks. Simplicity and willingness to say no. Quality obsession in every detail. Unpredictability — they deliberately vary question order and ask novel questions.",
    framework: "No prescribed framework — Apple values storytelling over structured method",
    deal_breakers: [
      "Proposing complex or feature-heavy solutions",
      "Ignoring hardware constraints or Apple ecosystem integration",
      "Lack of design sensibility — not understanding why things work the way they do",
      "Generic or template-sounding answers (Apple deliberately varies questions to catch this)",
      "Treating team lunch as a break",
    ],
    ai_specific_notes:
      "Apple is deliberate about AI adoption — they value on-device AI and privacy-first approaches. Questions will test whether you understand the difference between Apple's approach (private, on-device, user-controlled) vs. cloud-dependent AI. Privacy is not a constraint — it's a product value.",
    rounds: [
      {
        id: "apple-phone-screens",
        name: "PM Phone Screen(s)",
        duration: "45-60 min each (1-2 screens)",
        stage: "phone",
        tests: ["Product thinking", "Technical fluency basics", "Apple ecosystem understanding"],
        what_they_actually_want:
          "Can you think about products the way Apple does — with deep craft, user focus, and ecosystem awareness?",
        questions: [
          "Tell me about an Apple product you think could be significantly improved and how you'd approach it.",
          "How do you think about the balance between simplicity and capability in a product?",
          "Walk me through a product decision you made that required understanding technical constraints deeply.",
        ],
        rubric: [
          "Apple product critique shows genuine insight, not just criticism",
          "Simplicity answer shows they know what to remove, not just what to add",
          "Technical constraint answer shows they got genuinely close to engineering",
        ],
        great_signals: [
          "Talks about why Apple made a decision they agree with — not just what to add",
          "Has a real point of view on Apple's design philosophy",
          "Technical fluency is earned through collaboration, not assumed",
        ],
        weak_signals: [
          "'I'd add more features' without understanding what to cut",
          "Apple critique is surface-level ('the App Store should be more open')",
          "No real technical depth",
        ],
      },
      {
        id: "apple-product-sense",
        name: "Product Sense (Onsite — multiple rounds)",
        duration: "45-60 min each",
        stage: "onsite",
        tests: ["Hardware-software integration", "Design thinking", "Ecosystem reasoning", "Simplicity under constraint"],
        what_they_actually_want:
          "Show you think like Apple — design is how it works, every detail matters, and saying no to a thousand things is what makes the one thing great.",
        questions: [
          "How would you improve AirPods — not the hardware specs, but the product experience and the software layer around them?",
          "Design an Apple Watch feature for runners that couldn't exist on any other platform. Why couldn't it exist elsewhere?",
          "Apple is entering the home. What's the first product you'd build that isn't HomePod or AppleTV, and why?",
          "How would you redesign the iPhone onboarding experience for someone switching from Android — using only Apple's existing capabilities?",
          "What Apple privacy capability could be turned into a product advantage that no competitor can copy quickly?",
        ],
        rubric: [
          "Ecosystem integration is natural — not forced",
          "Solution says no to things explicitly",
          "Privacy is treated as a product value, not a compliance checkbox",
          "Hardware constraints are understood and respected",
          "Storytelling — can make the product come alive, not just describe features",
        ],
        great_signals: [
          "References specific Apple APIs, hardware capabilities, or design patterns correctly",
          "Solution is achievable within Apple's existing platform",
          "Privacy framing is proactive ('this is why it's better') not defensive",
          "Answer is specific enough that it couldn't apply to Samsung or Google",
        ],
        weak_signals: [
          "Proposes something that violates Apple's privacy model",
          "Doesn't understand what's hardware vs. software vs. service",
          "Solution requires cloud AI when on-device would be more Apple-appropriate",
          "Generic product sense answer that could apply to any company",
        ],
      },
      {
        id: "apple-technical-fluency",
        name: "Technical Fluency (Onsite)",
        duration: "45-60 min",
        stage: "onsite",
        tests: ["Engineering constraint understanding", "Platform capability knowledge", "Feasibility judgment"],
        what_they_actually_want:
          "Not engineering knowledge — product knowledge of engineering. Can you make product decisions that are grounded in what's actually possible and why?",
        questions: [
          "Walk me through how you'd work with an engineering team to scope a new ML feature for the Photos app. What questions would you ask and what tradeoffs would you surface?",
          "A user-facing feature you championed shipped but performance is 200ms slower than the bar. How do you respond?",
          "Explain how on-device AI vs. cloud AI affects product design decisions — using a specific example.",
          "Your team is debating between two technical approaches. How do you participate in that decision as a PM?",
        ],
        rubric: [
          "Questions to engineering are about constraints and trade-offs, not specs",
          "Performance/quality bar shows they internalize Apple's standards",
          "On-device vs. cloud answer is specific and connected to user experience",
          "Technical debate participation shows informed judgment, not deference",
        ],
        great_signals: [
          "Understands latency, battery, and privacy implications of different approaches",
          "Would not ship a feature that degrades Apple's quality bar — even under pressure",
          "On-device AI understanding is concrete (Core ML, Neural Engine awareness)",
        ],
        weak_signals: [
          "Technical questions are about specs, not constraints",
          "Would compromise quality to ship on time",
          "On-device vs. cloud is theoretical, not grounded",
        ],
      },
      {
        id: "apple-strategy",
        name: "Strategy (Onsite)",
        duration: "45-60 min",
        stage: "onsite",
        tests: ["Long-term thinking", "Market positioning", "Platform strategy", "Competitive understanding"],
        what_they_actually_want:
          "Can you think about where Apple should go — understanding that Apple creates markets rather than entering them, and that integration is the moat?",
        questions: [
          "What's the biggest market Apple isn't in that it should be, given its existing assets?",
          "How should Apple respond to the AI assistant market where Google and Meta are moving aggressively?",
          "Apple's services revenue is growing faster than hardware. What does that imply for product strategy in the next 5 years?",
          "How would you think about Apple's role in health — beyond Apple Watch — given their data, distribution, and trust advantages?",
        ],
        rubric: [
          "Strategy is grounded in Apple's actual assets (distribution, trust, ecosystem, hardware)",
          "Market entry logic starts from Apple's advantage, not the market size",
          "AI response shows understanding of Apple's differentiated approach (privacy, on-device)",
          "Services vs. hardware tension is understood, not oversimplified",
        ],
        great_signals: [
          "Strategy starts from 'what can Apple do that no one else can'",
          "AI response is nuanced — Apple won't do what Google does, and shouldn't",
          "Health strategy connects hardware, services, and regulatory landscape",
        ],
        weak_signals: [
          "Strategy is 'Apple should enter X because it's big'",
          "AI response ignores Apple's privacy differentiation",
          "No understanding of Apple's actual competitive moat",
        ],
      },
      {
        id: "apple-team-lunch",
        name: "Team Lunch",
        duration: "45-60 min",
        stage: "onsite",
        tests: ["Cultural fit", "Informal judgment", "Curiosity", "Collaboration style"],
        what_they_actually_want:
          "This is a full evaluation round. They're assessing whether you'd be a good colleague — intellectually curious, collaborative, not high-maintenance.",
        questions: [
          "What are you working on outside of work that you're genuinely excited about?",
          "What's a product from a non-tech company that you think has exceptional design?",
          "What's something you've changed your mind about recently?",
          "What do you think Apple gets wrong?",
        ],
        rubric: [
          "Outside interests are specific and genuine",
          "Non-tech product design taste is real — not generic",
          "Mind change shows intellectual honesty",
          "Apple critique is thoughtful and earned — not a trap",
        ],
        great_signals: [
          "Genuine curiosity and enthusiasm — not interview mode",
          "Apple critique shows they've thought carefully, not trying to impress",
          "Asks good questions about the team's actual work",
        ],
        weak_signals: [
          "Still in full interview mode — stiff and formal",
          "Refuses to critique Apple or over-praises it",
          "No genuine outside interests",
        ],
        notes: "Treat this as seriously as every other round. Apple evaluates it fully.",
      },
    ],
  },
};

export function getCompanyLoop(name: string): CompanyLoop | null {
  const normalized = name.toLowerCase().replace(/\s+/g, "");
  for (const loop of Object.values(MAANG_LOOPS)) {
    if (loop.alias.some((a) => normalized.includes(a))) return loop;
  }
  return null;
}

export function getRound(company: CompanyLoop, roundName: string): InterviewRound | null {
  const normalized = roundName.toLowerCase();
  return (
    company.rounds.find(
      (r) =>
        r.name.toLowerCase().includes(normalized) ||
        r.id.toLowerCase().includes(normalized) ||
        r.tests.some((t) => t.toLowerCase().includes(normalized))
    ) ?? null
  );
}
