// Panel definition + scenarios. Each panelist is a different vendor's vision
// model (reached via Bedrock) so the feedback reflects genuinely different
// "users". Swap PANEL / pick a scenario via env (see run.mjs).

export const PANEL = [
  {
    key: 'claude',
    label: 'Claude Haiku 4.5',
    modelId: 'global.anthropic.claude-haiku-4-5-20251001-v1:0',
  },
  { key: 'nova', label: 'Amazon Nova Pro', modelId: 'amazon.nova-pro-v1:0' },
  {
    key: 'llama',
    label: 'Meta Llama 4 Maverick',
    modelId: 'us.meta.llama4-maverick-17b-instruct-v1:0',
  },
  { key: 'pixtral', label: 'Mistral Pixtral Large', modelId: 'us.mistral.pixtral-large-2502-v1:0' },
];

export const SCENARIOS = {
  wedding: {
    title: 'Plan a wedding',
    persona:
      'You are one half of a couple planning your wedding. You are NOT technical — you just want to get organized.',
    goal:
      'Create a project for your wedding, add a few sections (e.g. Venue, Guests, Catering), ' +
      'and add several real tasks with due dates and priorities (book venue, send invitations, ' +
      'choose caterer, buy rings). Try the board and list views. Organize it the way a real couple would.',
  },
  launch: {
    title: 'Plan a product launch',
    persona: 'You are a product manager organizing a software launch. You want a clear plan.',
    goal:
      'Create a project for a product launch, add sections and tasks (write announcement, QA, ' +
      'marketing, ship), set priorities and due dates, and try both board and list views.',
  },
  trip: {
    title: 'Plan a group trip',
    persona: 'You are organizing a trip for a group of friends. You want everyone aligned.',
    goal:
      'Create a project for a group trip, add sections (Flights, Lodging, Activities), add tasks ' +
      'with due dates, assign priorities, and explore the views.',
  },
};

export const FEEDBACK_PROMPT = `You just spent time using this task-management web app to accomplish your goal.
Give honest, specific product feedback as the non-technical user you were role-playing.
Respond as JSON with EXACTLY these keys (no code fences):
{
  "delight": <integer 1-10, how delightful + easy it felt>,
  "clarity": <integer 1-10, how visually clear the UI was>,
  "firstImpression": "<one sentence>",
  "worked_well": ["<short bullet>", "..."],
  "confusing_or_bad": ["<short bullet>", "..."],
  "top_improvements": ["<the single most impactful change>", "<second>", "<third>"],
  "vs_asana": "<one sentence comparing clarity/delight to Asana>"
}`;
