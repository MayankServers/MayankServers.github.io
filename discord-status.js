// Discord Status Integration
class DiscordStatus {
  constructor(userId) {
    this.userId = userId;
    this.statusElement = document.getElementById('status-indicator');
    this.textElement = document.getElementById('status-text');
    this.init();
  }

  async init() {
    try {
      // Try to fetch status from Lanyard API (popular Discord status API)
      await this.fetchLanyardStatus();
    } catch (error) {
      console.log('Lanyard API not available, using fallback');
      this.showFallbackStatus();
    }
  }

  async fetchLanyardStatus() {
    try {
      const response = await fetch(`https://api.lanyard.rest/v1/users/1146756653505593441`);
      
      if (!response.ok) {
        throw new Error('Lanyard API error');
      }
      
      const data = await response.json();
      
      if (data.success) {
        this.updateStatus(data.data);
      } else {
        throw new Error('Invalid response');
      }
    } catch (error) {
      throw error;
    }
  }

  updateStatus(userData) {
    const status = userData.discord_status;
    const activities = userData.activities || [];
    
    // Update status indicator
    this.statusElement.className = `status-indicator ${status}`;
    
    // Update status text
    let statusText = this.getStatusText(status);
    
    // Check for activities in priority order
    const customStatus = activities.find(a => a.type === 4); // Custom status
    const spotify = activities.find(a => a.name === 'Spotify');
    const crunchyroll = activities.find(a => a.name === 'Crunchyroll');
    const playingActivity = activities.find(a => a.type === 0); // Playing activity
    const watchingActivity = activities.find(a => a.type === 3); // Watching activity
    
    // Priority: Custom Status > Crunchyroll > Spotify > Games > Watching > Default
    if (customStatus && customStatus.state) {
      statusText = `💭 ${customStatus.state}`;
    } else if (crunchyroll) {
      if (crunchyroll.details && crunchyroll.state) {
        statusText = `📺 Watching ${crunchyroll.details} - ${crunchyroll.state}`;
      } else if (crunchyroll.details) {
        statusText = `📺 Watching ${crunchyroll.details}`;
      } else {
        statusText = `📺 Watching on Crunchyroll`;
      }
    } else if (spotify) {
      statusText = `🎵 Listening to ${spotify.details}`;
      if (spotify.state) {
        statusText += ` by ${spotify.state}`;
      }
    } else if (playingActivity) {
      statusText = `🎮 Playing ${playingActivity.name}`;
      if (playingActivity.details) {
        statusText += ` - ${playingActivity.details}`;
      }
    } else if (watchingActivity) {
      statusText = `📺 Watching ${watchingActivity.name}`;
      if (watchingActivity.details) {
        statusText += ` - ${watchingActivity.details}`;
      }
    }
    
    this.textElement.textContent = statusText;
    
    // Refresh every 30 seconds
    setTimeout(() => this.init(), 30000);
  }

  getStatusText(status) {
    switch (status) {
      case 'online':
        return 'Online';
      case 'idle':
        return 'Idle';
      case 'dnd':
        return 'Do Not Disturb';
      case 'offline':
      default:
        return 'Offline';
    }
  }

  showFallbackStatus() {
    // Fallback when API is not available
    this.statusElement.className = 'status-indicator online';
    this.textElement.textContent = 'Click to message on Discord';
  }
}

// Initialize Discord status when page loads
document.addEventListener('DOMContentLoaded', () => {
  new DiscordStatus('1146756653505593441');
});
