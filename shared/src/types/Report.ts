import * as yup from 'yup';

const ReportParamsSchema = yup.object().shape({
  screen: yup.string(),
  key: yup.string(),
  model: yup.string(),
  os: yup.string(),
  osVersion: yup.string(),
  nativeVersion: yup.string(),
  bundleVersion: yup.string(),
  gitCommit: yup.string(),
});

export const CreateReportSchema = yup.object().shape({
  text: yup.string().required(),
  email: yup.string(),
  params: ReportParamsSchema,
});

export type CreateReportData = yup.InferType<typeof CreateReportSchema>;
export type ReportParams = yup.InferType<typeof ReportParamsSchema>;
