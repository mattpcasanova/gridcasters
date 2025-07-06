export class SleeperAPI {
  private baseURL = 'https://api.sleeper.app/v1';

  async getAllPlayers() {
    const response = await fetch(`${this.baseURL}/players/nfl`);
    if (!response.ok) throw new Error('Failed to fetch players');
    return response.json();
  }

  async getNFLState() {
    const response = await fetch(`${this.baseURL}/state/nfl`);
    if (!response.ok) throw new Error('Failed to fetch NFL state');
    return response.json();
  }

  async getProjections(week: number, season: number = 2024) {
    const response = await fetch(`${this.baseURL}/projections/nfl/regular/${season}/${week}`);
    if (!response.ok) throw new Error('Failed to fetch projections');
    return response.json();
  }
} 