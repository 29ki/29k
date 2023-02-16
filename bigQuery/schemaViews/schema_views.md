# firebaseextensions/fs-bq-schema-views

### Example on how to genereate schema views

```bash
$ npx @firebaseextensions/fs-bq-schema-views \
  --non-interactive \
  --project=${param:PROJECT_ID} \
  --dataset=${param:DATASET_ID} \
  --table-name-prefix=${param:TABLE_ID} \
  --schema-files=./schema.json
```

Read more on how to generate scheme views [Documentation](https://github.com/firebase/extensions/blob/master/firestore-bigquery-export/guides/GENERATE_SCHEMA_VIEWS.md)
