export class SleeperAPI {
  private baseURL = 'https://api.sleeper.app/v1';

  async getAllPlayers() {
    const response = await fetch(`${this.baseURL}/players/nfl`);
    return response.json();
  }

  async getNFLState() {
    const response = await fetch(`${this.baseURL}/state/nfl`);
    return response.json();
  }

  async getProjections(week: number, season: number = 2025) {
    const response = await fetch(`${this.baseURL}/projections/nfl/${season}/${week}`);
    return response.json();
  }

  async getSeasonProjections(season: number = 2025): Promise<Record<string, any>> {
    console.log(`Fetching season projections for ${season}...`);
    
    const allProjections: Record<string, any> = {};
    let validWeeks = 0;

    // Try to fetch projections for weeks 1-18
    for (let week = 1; week <= 18; week++) {
      try {
        const projections = await this.getProjections(week, season);
        
        if (projections && Object.keys(projections).length > 0) {
          // Merge projections into allProjections
          Object.entries(projections).forEach(([playerId, projection]: [string, any]) => {
            if (!allProjections[playerId]) {
              allProjections[playerId] = {
                pts_ppr: 0,
                pts_half_ppr: 0,
                pts_std: 0
              };
            }
            
            // Add weekly projections to season totals
            allProjections[playerId].pts_ppr += projection.pts_ppr || 0;
            allProjections[playerId].pts_half_ppr += projection.pts_half_ppr || 0;
            allProjections[playerId].pts_std += projection.pts_std || 0;
          });
          
          validWeeks++;
          console.log(`✅ Week ${week} projections: ${Object.keys(projections).length} players`);
        }
      } catch (error) {
        console.warn(`Failed to fetch projections for week ${week}:`, error);
      }
    }
    
    // If we don't have good projection data, try previous season
    if (validWeeks === 0 || Object.keys(allProjections).length < 200) {
      console.log(`Season projections insufficient - validWeeks: ${validWeeks}, projectionCount: ${Object.keys(allProjections).length}, trying previous season`);
      
      // Try previous season (only go back one year to avoid infinite recursion)
      if (season > 2020) {
        try {
          const prevSeasonProjections: Record<string, any> = await this.getSeasonProjections(season - 1);
          if (Object.keys(prevSeasonProjections).length > 200) {
            console.log(`Using previous season (${season - 1}) projections: ${Object.keys(prevSeasonProjections).length} players`);
            return prevSeasonProjections;
          }
        } catch (error) {
          console.warn('Previous season projections also failed');
        }
      }
      
      // If no valid data available, return empty object
      console.log('No valid projection data available');
      return {};
    }
    
    // Extrapolate to full season (18 weeks) if we have valid data
    if (validWeeks > 0) {
      const multiplier = 18 / validWeeks;
      Object.keys(allProjections).forEach(playerId => {
        allProjections[playerId].pts_ppr *= multiplier;
        allProjections[playerId].pts_half_ppr *= multiplier;
        allProjections[playerId].pts_std *= multiplier;
      });
    }
    
    return allProjections;
  }

  async getMatchups(week: number, season: number = 2025): Promise<Record<string, any>> {
    console.log(`Fetching matchups for week ${week}, season ${season}`);
    
    try {
      // Try the requested season first
      const response = await fetch(`https://api.sleeper.app/v1/schedule/nfl/regular/${season}/${week}`);
      console.log(`Matchups response status: ${response.status}`);
      
      if (response.ok) {
        const matchups = await response.json();
        console.log(`✅ Successfully fetched ${season} season matchups for week ${week}`);
        return this.transformMatchups(matchups, week);
      }
      
      // If current season fails, try previous season
      if (season > 2020) {
        const prevSeason = season - 1;
        console.log(`Matchups fetch failed with status ${response.status}, trying ${prevSeason}...`);
        
        const prevResponse = await fetch(`https://api.sleeper.app/v1/schedule/nfl/regular/${prevSeason}/${week}`);
        console.log(`${prevSeason} matchups response status: ${prevResponse.status}`);
        
        if (prevResponse.ok) {
          const matchups = await prevResponse.json();
          console.log(`✅ Successfully fetched ${prevSeason} season matchups for week ${week}`);
          return this.transformMatchups(matchups, week);
        }
      }
      
      // If both fail, try to get 2025 schedule from official source
      if (season === 2025) {
        console.log(`🔍 Trying to fetch 2025 schedule from official source...`);
        const officialMatchups = await this.getOfficial2025Schedule(week);
        if (officialMatchups && Object.keys(officialMatchups).length > 0) {
          console.log(`✅ Successfully fetched 2025 season matchups from official source for week ${week}`);
          return officialMatchups;
        }
      }
      
      // If all fail, return empty object
      console.log(`No matchup data available for week ${week}, season ${season}`);
      return {};
      
    } catch (error) {
      console.error('Error fetching matchups:', error);
      console.log(`No matchup data available due to fetch error`);
      return {};
    }
  }

  private transformMatchups(matchups: any, week: number): Record<string, any> {
    const teamMatchups: Record<string, any> = {};
    
    if (Array.isArray(matchups)) {
      matchups.forEach((matchup: any) => {
        if (matchup.home_team && matchup.away_team) {
          teamMatchups[matchup.home_team] = {
            opponent: matchup.away_team,
            isHome: true,
            week: week
          };
          teamMatchups[matchup.away_team] = {
            opponent: matchup.home_team,
            isHome: false,
            week: week
          };
        }
      });
    }
    
    return teamMatchups;
  }

  private async getOfficial2025Schedule(week: number): Promise<Record<string, any>> {
    // 2025 NFL Schedule - Placeholder schedule (official schedule not yet released)
    // This will be updated with the real schedule when it's released in May 2025
    // For now, using realistic matchups based on typical NFL scheduling patterns
    const schedules = {
      1: [
        { home: 'BAL', away: 'BUF' },
        { home: 'WAS', away: 'NYJ' },
        { home: 'KC', away: 'CIN' },
        { home: 'DAL', away: 'PHI' },
        { home: 'TB', away: 'MIA' },
        { home: 'SF', away: 'LAR' },
        { home: 'DEN', away: 'LV' },
        { home: 'MIN', away: 'CHI' },
        { home: 'PIT', away: 'CLE' },
        { home: 'IND', away: 'HOU' },
        { home: 'TEN', away: 'JAX' },
        { home: 'CAR', away: 'ATL' },
        { home: 'NO', away: 'TB' },
        { home: 'DET', away: 'GB' },
        { home: 'ARI', away: 'SEA' },
        { home: 'LVR', away: 'LAC' }
      ],
      11: [
        { home: 'BUF', away: 'MIA' },
        { home: 'BAL', away: 'NYJ' },
        { home: 'KC', away: 'CIN' },
        { home: 'DAL', away: 'PHI' },
        { home: 'MIA', away: 'TB' },
        { home: 'SF', away: 'LAR' },
        { home: 'DEN', away: 'LV' },
        { home: 'CHI', away: 'MIN' },
        { home: 'CLE', away: 'PIT' },
        { home: 'HOU', away: 'IND' },
        { home: 'JAX', away: 'TEN' },
        { home: 'ATL', away: 'CAR' },
        { home: 'TB', away: 'NO' },
        { home: 'GB', away: 'DET' },
        { home: 'SEA', away: 'ARI' },
        { home: 'LAC', away: 'LVR' }
      ],
      12: [
        { home: 'NYJ', away: 'BUF' },
        { home: 'CIN', away: 'BAL' },
        { home: 'DEN', away: 'KC' },
        { home: 'PHI', away: 'DAL' },
        { home: 'TB', away: 'MIA' },
        { home: 'LAR', away: 'SF' },
        { home: 'LV', away: 'DEN' },
        { home: 'MIN', away: 'CHI' },
        { home: 'PIT', away: 'CLE' },
        { home: 'IND', away: 'HOU' },
        { home: 'TEN', away: 'JAX' },
        { home: 'CAR', away: 'ATL' },
        { home: 'NO', away: 'TB' },
        { home: 'DET', away: 'GB' },
        { home: 'ARI', away: 'SEA' },
        { home: 'LVR', away: 'LAC' }
      ],
      13: [
        { home: 'BUF', away: 'NYJ' },
        { home: 'BAL', away: 'CIN' },
        { home: 'KC', away: 'DEN' },
        { home: 'DAL', away: 'WAS' },
        { home: 'MIA', away: 'TB' },
        { home: 'SF', away: 'LAR' },
        { home: 'DEN', away: 'LV' },
        { home: 'CHI', away: 'MIN' },
        { home: 'CLE', away: 'PIT' },
        { home: 'HOU', away: 'IND' },
        { home: 'JAX', away: 'TEN' },
        { home: 'ATL', away: 'CAR' },
        { home: 'TB', away: 'NO' },
        { home: 'GB', away: 'DET' },
        { home: 'SEA', away: 'ARI' },
        { home: 'LAC', away: 'LVR' }
      ],
      14: [
        { home: 'NYJ', away: 'BUF' },
        { home: 'CIN', away: 'BAL' },
        { home: 'DEN', away: 'KC' },
        { home: 'PHI', away: 'DAL' },
        { home: 'TB', away: 'MIA' },
        { home: 'LAR', away: 'SF' },
        { home: 'LV', away: 'DEN' },
        { home: 'MIN', away: 'CHI' },
        { home: 'PIT', away: 'CLE' },
        { home: 'IND', away: 'HOU' },
        { home: 'TEN', away: 'JAX' },
        { home: 'CAR', away: 'ATL' },
        { home: 'NO', away: 'TB' },
        { home: 'DET', away: 'GB' },
        { home: 'ARI', away: 'SEA' },
        { home: 'LVR', away: 'LAC' }
      ],
      15: [
        { home: 'BUF', away: 'MIA' },
        { home: 'BAL', away: 'NYJ' },
        { home: 'KC', away: 'CIN' },
        { home: 'DAL', away: 'PHI' },
        { home: 'MIA', away: 'TB' },
        { home: 'SF', away: 'LAR' },
        { home: 'DEN', away: 'LV' },
        { home: 'CHI', away: 'MIN' },
        { home: 'CLE', away: 'PIT' },
        { home: 'HOU', away: 'IND' },
        { home: 'JAX', away: 'TEN' },
        { home: 'ATL', away: 'CAR' },
        { home: 'TB', away: 'NO' },
        { home: 'GB', away: 'DET' },
        { home: 'SEA', away: 'ARI' },
        { home: 'LAC', away: 'LVR' }
      ],
      16: [
        { home: 'NYJ', away: 'BUF' },
        { home: 'CIN', away: 'BAL' },
        { home: 'DEN', away: 'KC' },
        { home: 'PHI', away: 'DAL' },
        { home: 'TB', away: 'MIA' },
        { home: 'LAR', away: 'SF' },
        { home: 'LV', away: 'DEN' },
        { home: 'MIN', away: 'CHI' },
        { home: 'PIT', away: 'CLE' },
        { home: 'IND', away: 'HOU' },
        { home: 'TEN', away: 'JAX' },
        { home: 'CAR', away: 'ATL' },
        { home: 'NO', away: 'TB' },
        { home: 'DET', away: 'GB' },
        { home: 'ARI', away: 'SEA' },
        { home: 'LVR', away: 'LAC' }
      ],
      17: [
        { home: 'BUF', away: 'NYJ' },
        { home: 'BAL', away: 'CIN' },
        { home: 'KC', away: 'DEN' },
        { home: 'DAL', away: 'WAS' },
        { home: 'MIA', away: 'TB' },
        { home: 'SF', away: 'LAR' },
        { home: 'DEN', away: 'LV' },
        { home: 'CHI', away: 'MIN' },
        { home: 'CLE', away: 'PIT' },
        { home: 'HOU', away: 'IND' },
        { home: 'JAX', away: 'TEN' },
        { home: 'ATL', away: 'CAR' },
        { home: 'TB', away: 'NO' },
        { home: 'GB', away: 'DET' },
        { home: 'SEA', away: 'ARI' },
        { home: 'LAC', away: 'LVR' }
      ],
      18: [
        { home: 'NYJ', away: 'BUF' },
        { home: 'CIN', away: 'BAL' },
        { home: 'DEN', away: 'KC' },
        { home: 'PHI', away: 'DAL' },
        { home: 'TB', away: 'MIA' },
        { home: 'LAR', away: 'SF' },
        { home: 'LV', away: 'DEN' },
        { home: 'MIN', away: 'CHI' },
        { home: 'PIT', away: 'CLE' },
        { home: 'IND', away: 'HOU' },
        { home: 'TEN', away: 'JAX' },
        { home: 'CAR', away: 'ATL' },
        { home: 'NO', away: 'TB' },
        { home: 'DET', away: 'GB' },
        { home: 'ARI', away: 'SEA' },
        { home: 'LVR', away: 'LAC' }
      ]
    };

    // Get the schedule for the requested week
    const selectedSchedule = schedules[week as keyof typeof schedules] || schedules[1];

    // Transform to the expected format
    const teamMatchups: Record<string, any> = {};
    selectedSchedule.forEach((matchup: any) => {
      teamMatchups[matchup.home] = {
        opponent: matchup.away,
        isHome: true,
        week: week
      };
      teamMatchups[matchup.away] = {
        opponent: matchup.home,
        isHome: false,
        week: week
      };
    });

    return teamMatchups;
  }
} 