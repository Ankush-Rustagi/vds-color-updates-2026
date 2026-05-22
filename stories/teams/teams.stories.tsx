import type { Meta, StoryObj } from '@storybook/react'
import { PRODUCT_TEAMS } from '../../src/content/teams'
import { TeamSurfacePreview, TeamMigrationCard } from '../../src/components/migration/TeamSurfacePreview'

const meta: Meta = {
  title: 'Teams/Overview',
}

export default meta

export const AllTeams: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24 }}>
      {PRODUCT_TEAMS.map((team) => (
        <div key={team.id}>
          <TeamMigrationCard team={team} />
          <div style={{ marginTop: 12 }}>
            <TeamSurfacePreview team={team} />
          </div>
        </div>
      ))}
    </div>
  ),
}

function makeTeamStory(teamId: string) {
  const team = PRODUCT_TEAMS.find((t) => t.id === teamId)!
  return {
    render: () => (
      <div>
        <TeamMigrationCard team={team} />
        <div style={{ marginTop: 16 }}>
          <TeamSurfacePreview team={team} />
        </div>
      </div>
    ),
  }
}

export const VideoSecurity = makeTeamStory('video-security')
export const AccessControl = makeTeamStory('access-control')
export const Alarms = makeTeamStory('alarms')
export const Intercom = makeTeamStory('intercom')
export const Sensors = makeTeamStory('sensors')
export const Guest = makeTeamStory('guest')
export const Maps = makeTeamStory('maps')
export const CommandAnalytics = makeTeamStory('command-analytics')
