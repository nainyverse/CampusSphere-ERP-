import { ComplaintCategory, ComplaintPriority } from '../types';

export interface PriorityEvaluation {
  priority: ComplaintPriority;
  isSafetyHazard: boolean;
  reasons: string[];
  departmentSuggestion: string;
  slaHours: number;
}

// Transparent safety trigger keywords
const SAFETY_KEYWORDS = [
  'fire',
  'spark',
  'shock',
  'smoke',
  'bare wire',
  'exposed wire',
  'burning',
  'gas leak',
  'flood',
  'ceiling fall',
  'collapse',
  'shattered glass',
  'electric shock',
  'short circuit',
  'chemical spill',
  'danger',
  'hazard',
  'injury',
  'bleeding',
  'emergency'
];

// High urgency keywords
const HIGH_KEYWORDS = [
  'blackout',
  'power cut',
  'no power',
  'projector not working',
  'exam',
  'no water',
  'water cut',
  'server down',
  'internet down',
  'wifi down',
  'lab test',
  'air conditioner failure',
  'ac down',
  'overflowing',
  'lift stuck',
  'elevator'
];

// Low priority / suggestions keywords
const LOW_KEYWORDS = [
  'paint',
  'suggestion',
  'request for book',
  'dusty',
  'plant',
  'whiteboard marker',
  'clock battery',
  'cosmetic',
  'minor stain',
  'recommendation'
];

export function evaluateComplaintPriority(
  category: ComplaintCategory,
  title: string,
  description: string
): PriorityEvaluation {
  const text = `${title} ${description}`.toLowerCase();
  const reasons: string[] = [];
  let isSafetyHazard = false;
  let priority: ComplaintPriority = 'Medium';
  let slaHours = 48;

  // 1. Safety check
  const matchedSafety = SAFETY_KEYWORDS.filter((kw) => text.includes(kw));
  if (matchedSafety.length > 0) {
    isSafetyHazard = true;
    priority = 'Critical';
    slaHours = 4;
    reasons.push(
      `Safety hazard flagged due to detected terms: "${matchedSafety.slice(0, 3).join(', ')}". Immediate human response required.`
    );
  }

  // 2. Critical/High category rules if not already Critical
  if (!isSafetyHazard) {
    const matchedHigh = HIGH_KEYWORDS.filter((kw) => text.includes(kw));
    if (matchedHigh.length > 0) {
      priority = 'High';
      slaHours = 12;
      reasons.push(
        `High impact detected from terms: "${matchedHigh.slice(0, 2).join(', ')}"`
      );
    } else if (category === 'Water supply' && text.includes('no water')) {
      priority = 'High';
      slaHours = 8;
      reasons.push('Campus water supply outage rule applied');
    } else if (category === 'Laboratory equipment' && text.includes('exam')) {
      priority = 'High';
      slaHours = 12;
      reasons.push('Laboratory examination dependency detected');
    } else if (category === 'Internet and Wi-Fi' && (text.includes('exam') || text.includes('hostel'))) {
      priority = 'High';
      slaHours = 12;
      reasons.push('Network disruption in high-demand zone');
    }
  }

  // 3. Low priority checks
  if (priority === 'Medium') {
    const matchedLow = LOW_KEYWORDS.filter((kw) => text.includes(kw));
    if (matchedLow.length > 0 || category === 'Other') {
      priority = 'Low';
      slaHours = 96;
      reasons.push('Non-disruptive maintenance or general enhancement');
    } else {
      reasons.push('Standard campus operational SLA (48 hours resolution target)');
    }
  }

  // Department assignment suggestion based on category
  let departmentSuggestion = 'Estate & Facilities';
  switch (category) {
    case 'Electrical maintenance':
      departmentSuggestion = 'Electrical Maintenance';
      break;
    case 'Internet and Wi-Fi':
      departmentSuggestion = 'Campus IT & Networks';
      break;
    case 'Classroom facilities':
      departmentSuggestion = 'Estate & Facilities';
      break;
    case 'Washroom and sanitation':
      departmentSuggestion = 'Housekeeping & Sanitation';
      break;
    case 'Water supply':
      departmentSuggestion = 'Plumbing & Water Works';
      break;
    case 'Laboratory equipment':
      departmentSuggestion = 'Lab Technical Operations';
      break;
    case 'Library':
      departmentSuggestion = 'Central Library Services';
      break;
    case 'Transport':
      departmentSuggestion = 'Campus Transport Desk';
      break;
    case 'Academic administration':
      departmentSuggestion = 'Academic Affairs & Registry';
      break;
    default:
      departmentSuggestion = 'Campus General Administration';
  }

  return {
    priority,
    isSafetyHazard,
    reasons,
    departmentSuggestion,
    slaHours
  };
}

export function calculateDueDate(priority: ComplaintPriority, fromDate = new Date()): string {
  const date = new Date(fromDate);
  switch (priority) {
    case 'Critical':
      date.setHours(date.getHours() + 4);
      break;
    case 'High':
      date.setHours(date.getHours() + 24);
      break;
    case 'Medium':
      date.setDate(date.getDate() + 3);
      break;
    case 'Low':
      date.setDate(date.getDate() + 7);
      break;
  }
  return date.toISOString().split('T')[0];
}
