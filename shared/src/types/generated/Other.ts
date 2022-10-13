/* eslintdisable */
/* tslint:disable */

export type AllContributorsContributorContributionsOptions =
  | 'a11y'
  | 'audio'
  | 'blog'
  | 'bug'
  | 'business'
  | 'code'
  | 'content'
  | 'coreTeam'
  | 'data'
  | 'design'
  | 'doc'
  | 'eventOrganizing'
  | 'example'
  | 'financial'
  | 'fundingFinding'
  | 'ideas'
  | 'infra'
  | 'maintenance'
  | 'marketing'
  | 'mentoring'
  | 'people'
  | 'platform'
  | 'plugin'
  | 'projectManagement'
  | 'question'
  | 'research'
  | 'review'
  | 'security'
  | 'talk'
  | 'test'
  | 'tool'
  | 'translation'
  | 'tutorial'
  | 'userExperience'
  | 'userTesting'
  | 'video';

export interface AllContributorsContributor {
  name: string;
  avatarurl: string;
  profile: string;
  login?: string;
  contributions: AllContributorsContributorContributionsOptions[];
}

export interface AllContributors {
  contributors: AllContributorsContributor[];
}
