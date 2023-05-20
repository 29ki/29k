/*
 * Copyright (c) 2018-2021 29k International AB
 */

import createDebug from 'debug';

import { RETRY_CONFIG } from '../constants.js';

const debug = createDebug('app:backups:firestore');

const IGNORED_COLLECTION_IDS = ['scheduler'];

const createHandler = (services) => async ({ timestamp }) => {
  const { firestore, firestoreAdmin, env, googleAuth } = services;
  const { FUNCTIONS_BACKUP_BUCKET: bucketName } = env();

  // Creating a path to the database
  // The db name seems to always be the same as the project id
  const projectId = await googleAuth().getProjectId();
  const formattedPath = firestoreAdmin().databasePath(projectId, '(default)');

  const collectionRefs = await firestore().listCollections();
  const collectionIds = collectionRefs
    .map((ref) => ref.id)
    .filter((id) => !IGNORED_COLLECTION_IDS.includes(id));

  await firestoreAdmin().exportDocuments({
    name: formattedPath,
    outputUriPrefix: `gs://${bucketName}/firestore/${timestamp}`,
    collectionIds: collectionIds,
  });
  debug(`Firestore backup started: ${timestamp}`);

  return null;
};

export default ({ functions, ...services }) =>
  functions()
    .runWith({ memory: '256MB', maxInstances: 1, timeoutSeconds: 540 })
    .pubsub.schedule('every day 00:00')
    .retryConfig(RETRY_CONFIG)
    .onRun(createHandler(services));
