// List of inappropriate words to filter out
const INAPPROPRIATE_WORDS = [
  // Common curse words and slurs (censored for safety)
  'f***', 's***', 'a***', 'b***', 'c***', 'd***', 'p***', 't***', 'w***',
  'n***', 'r***', 'k***', 'g***', 'j***', 'm***', 'v***', 'z***',
  // Common variations and misspellings
  'fck', 'sh*t', 'a**', 'b**', 'c**', 'd**', 'p**', 't**', 'w**',
  'n**', 'r**', 'k**', 'g**', 'j**', 'm**', 'v**', 'z**',
  // Additional variations
  'fuk', 'shyt', 'ass', 'bitch', 'cunt', 'dick', 'pussy', 'twat', 'whore',
  'nigger', 'retard', 'kike', 'gook', 'jap', 'mick', 'wop', 'spic',
  // Common gaming/online slurs
  'noob', 'nub', 'scrub', 'trash', 'garbage', 'useless', 'worthless',
  // Add more as needed
];

// Function to check if text contains inappropriate content
export function containsInappropriateContent(text: string): boolean {
  if (!text) return false;
  
  const normalizedText = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  return INAPPROPRIATE_WORDS.some(word => 
    normalizedText.includes(word.toLowerCase().replace(/[^a-z0-9]/g, ''))
  );
}

// Function to validate group name
export function validateGroupName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Group name is required' };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, error: 'Group name must be at least 3 characters long' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Group name must be less than 50 characters' };
  }
  
  if (containsInappropriateContent(name)) {
    return { isValid: false, error: 'Group name contains inappropriate content' };
  }
  
  return { isValid: true };
}

// Function to validate group description
export function validateGroupDescription(description: string): { isValid: boolean; error?: string } {
  if (!description) {
    return { isValid: true }; // Description is optional
  }
  
  if (description.trim().length > 500) {
    return { isValid: false, error: 'Description must be less than 500 characters' };
  }
  
  if (containsInappropriateContent(description)) {
    return { isValid: false, error: 'Description contains inappropriate content' };
  }
  
  return { isValid: true };
} 