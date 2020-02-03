import * as Factory from 'factory.ts';
import { ProjectVersions, Version } from 'modules/settings/status/types';

export const VersionFactory = Factory.Sync.makeFactory<Version>({
  packageVersion: 'string',
  lastCommittedUser: 'string',
  lastCommittedDate: 'string',
  lastCommitMessage: 'string',
  branch: 'string',
  sha: 'string',
  abbreviatedSha: 'string'
});

export const projectVersionsFactory = Factory.Sync.makeFactory<ProjectVersions>({
  erxesVersion: VersionFactory.build(),
  apiVersion: VersionFactory.build(),
  widgetVersion: VersionFactory.build()
});